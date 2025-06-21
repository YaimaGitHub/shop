"use client"

import { useState, useEffect, useCallback } from "react"

// Tasas de cambio del mercado informal cubano
const EXCHANGE_RATES = {
  CUP: 1, // Moneda base
  USD: 375.0, // 1 USD = 375 CUP
  EUR: 410.0, // 1 EUR = 410 CUP
  MLC: 260.0, // 1 MLC = 260 CUP
}

const CURRENCY_SYMBOLS = {
  CUP: "$",
  USD: "$",
  EUR: "€",
  MLC: "MLC",
}

const CURRENCY_NAMES = {
  CUP: "Peso Cubano",
  USD: "Dólar Estadounidense",
  EUR: "Euro",
  MLC: "Moneda Libremente Convertible",
}

const useForceUpdate = () => {
  const [, setTick] = useState(0)
  const update = useCallback(() => {
    setTick((tick) => tick + 1)
  }, [])
  return update
}

export const useCurrency = () => {
  const [currentCurrency, setCurrentCurrency] = useState("CUP")
  const [isLoading, setIsLoading] = useState(false)
  const forceUpdate = useForceUpdate()

  // Cargar moneda guardada al inicializar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("yero-currency") || "CUP"
      setCurrentCurrency(savedCurrency)
    }
  }, [])

  // Función para convertir de CUP a otra moneda
  const convertFromCUP = useCallback(
    (cupPrice, targetCurrency) => {
      const target = targetCurrency || currentCurrency
      if (target === "CUP") return Number(cupPrice)
      const rate = EXCHANGE_RATES[target]
      if (!rate) return Number(cupPrice)
      return Number((cupPrice / rate).toFixed(2))
    },
    [currentCurrency],
  )

  // Función para convertir de cualquier moneda a CUP
  const convertToCUP = useCallback((price, fromCurrency) => {
    if (fromCurrency === "CUP") return Number(price)
    const rate = EXCHANGE_RATES[fromCurrency]
    if (!rate) return Number(price)
    return Number((price * rate).toFixed(2))
  }, [])

  // Función para formatear precio con símbolo de moneda
  const formatPrice = useCallback(
    (price, currency) => {
      const targetCurrency = currency || currentCurrency
      const symbol = CURRENCY_SYMBOLS[targetCurrency]

      // Asegurar que el precio sea un número válido
      const numPrice = Number(price) || 0

      // Si ya está en la moneda objetivo, no convertir
      let convertedPrice = numPrice

      // Solo convertir si el precio está en CUP y queremos otra moneda
      if (targetCurrency !== "CUP" && numPrice > 0) {
        const rate = EXCHANGE_RATES[targetCurrency]
        if (rate && rate > 0) {
          convertedPrice = Number((numPrice / rate).toFixed(2))
        }
      }

      if (targetCurrency === "MLC") {
        return `${convertedPrice} ${symbol}`
      }
      return `${symbol}${convertedPrice} ${targetCurrency}`
    },
    [currentCurrency],
  )

  // Función para obtener precios de ubicaciones convertidos
  const getConvertedLocationPrices = useCallback(
    (basePrices) => {
      console.log("Base prices received:", basePrices)
      console.log("Current currency:", currentCurrency)

      const convertedPrices = {}

      Object.entries(basePrices).forEach(([location, price]) => {
        const basePrice = Number(price)
        console.log(`Converting ${location}: ${basePrice} CUP to ${currentCurrency}`)

        if (currentCurrency === "CUP") {
          convertedPrices[location] = basePrice
        } else {
          // Convertir de CUP a la moneda objetivo
          const rate = EXCHANGE_RATES[currentCurrency]
          if (rate && basePrice > 0) {
            const convertedPrice = basePrice / rate
            convertedPrices[location] = Math.round(convertedPrice * 100) / 100 // Redondear a 2 decimales
            console.log(`${location}: ${basePrice} CUP / ${rate} = ${convertedPrices[location]} ${currentCurrency}`)
          } else {
            convertedPrices[location] = basePrice
          }
        }
      })

      console.log("Final converted prices:", convertedPrices)
      return convertedPrices
    },
    [currentCurrency],
  )

  // Función para cambiar moneda - MEJORADA CON MEJOR SINCRONIZACIÓN
  const changeCurrency = useCallback(
    async (newCurrency) => {
      if (newCurrency === currentCurrency) return

      setIsLoading(true)

      try {
        // Actualizar estado inmediatamente
        setCurrentCurrency(newCurrency)

        // Guardar en localStorage
        localStorage.setItem("yero-currency", newCurrency)
        localStorage.setItem("yero-exchange-rates", JSON.stringify(EXCHANGE_RATES))
        localStorage.setItem("yero-currency-timestamp", Date.now().toString())

        // Disparar múltiples eventos para asegurar actualización completa
        const events = [
          new CustomEvent("currencyChanged", {
            detail: { currency: newCurrency, exchangeRates: EXCHANGE_RATES },
          }),
          new CustomEvent("pricesUpdate", {
            detail: { currency: newCurrency },
          }),
          new CustomEvent("forceUpdatePrices"),
          new Event("storage"), // Para componentes que escuchan localStorage
        ]

        events.forEach((event) => window.dispatchEvent(event))

        // Actualización progresiva de elementos con precios
        const updatePriceElements = (delay = 0) => {
          setTimeout(() => {
            const selectors = [
              ".price-text",
              ".price-container",
              ".currency-price",
              ".location-price",
              ".item-total",
              ".cart-price",
              ".product-price",
              ".delivery-price",
            ]

            selectors.forEach((selector) => {
              const elements = document.querySelectorAll(selector)
              elements.forEach((el) => {
                el.style.animation = "none"
                el.offsetHeight // Trigger reflow
                el.style.animation = "priceUpdate 0.6s ease-in-out"
              })
            })
          }, delay)
        }

        // Ejecutar actualizaciones en intervalos para asegurar que todos los componentes se actualicen
        updatePriceElements(0)
        updatePriceElements(100)
        updatePriceElements(300)
        updatePriceElements(500)

        // Forzar actualización específica de componentes de checkout
        setTimeout(() => {
          const checkoutEvent = new CustomEvent("checkoutPricesUpdate", {
            detail: { currency: newCurrency },
          })
          window.dispatchEvent(checkoutEvent)
        }, 100)

        return Promise.resolve()
      } finally {
        setTimeout(() => setIsLoading(false), 600)
      }
    },
    [currentCurrency],
  )

  // Función para obtener información de la moneda
  const getCurrencyInfo = useCallback(
    (currency) => {
      const targetCurrency = currency || currentCurrency
      return {
        code: targetCurrency,
        name: CURRENCY_NAMES[targetCurrency],
        symbol: CURRENCY_SYMBOLS[targetCurrency],
        rate: EXCHANGE_RATES[targetCurrency],
        isBase: targetCurrency === "CUP",
      }
    },
    [currentCurrency],
  )

  // Función para forzar actualización de todos los precios
  const forceUpdateAllPrices = useCallback(() => {
    const event = new CustomEvent("forceUpdatePrices", {
      detail: { currency: currentCurrency, timestamp: Date.now() },
    })
    window.dispatchEvent(event)
  }, [currentCurrency])

  // Agregar forceUpdateAllPrices al return del hook
  return {
    currentCurrency,
    isLoading,
    exchangeRates: EXCHANGE_RATES,
    convertFromCUP,
    convertToCUP,
    formatPrice,
    changeCurrency,
    getCurrencyInfo,
    getConvertedLocationPrices,
    currencySymbol: CURRENCY_SYMBOLS[currentCurrency],
    currencyName: CURRENCY_NAMES[currentCurrency],
    forceUpdate,
    forceUpdateAllPrices, // Nueva función
  }
}

export default useCurrency
