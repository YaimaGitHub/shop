"use client"

import { useCallback, useEffect, useRef } from "react"

const useFavicon = () => {
  const originalFavicons = useRef({})
  const currentFavicon = useRef(null)
  const canvasRef = useRef(null)

  // Inicializar y guardar favicons originales
  useEffect(() => {
    if (typeof window === "undefined") return

    // Guardar favicons originales
    const faviconElements = {
      main: document.querySelector('link[rel="icon"]'),
      shortcut: document.querySelector('link[rel="shortcut icon"]'),
      apple: document.querySelector('link[rel="apple-touch-icon"]'),
    }

    Object.entries(faviconElements).forEach(([key, element]) => {
      if (element) {
        originalFavicons.current[key] = element.href
      }
    })

    // Crear canvas para manipulación de favicon
    canvasRef.current = document.createElement("canvas")
    canvasRef.current.width = 32
    canvasRef.current.height = 32
  }, [])

  // Cambiar favicon por URL
  const setFavicon = useCallback((faviconUrl, type = "image/x-icon") => {
    if (typeof window === "undefined") return false

    try {
      let faviconElement = document.querySelector('link[rel="icon"]')

      if (!faviconElement) {
        faviconElement = document.createElement("link")
        faviconElement.rel = "icon"
        document.head.appendChild(faviconElement)
      }

      faviconElement.href = faviconUrl
      faviconElement.type = type

      currentFavicon.current = faviconUrl
      return true
    } catch (error) {
      console.error("Error setting favicon:", error)
      return false
    }
  }, [])

  // Crear favicon con badge/notificación
  const setFaviconWithBadge = useCallback(
    (options = {}) => {
      const {
        badgeText = "",
        badgeColor = "#ff4444",
        backgroundColor = "#4299e1",
        textColor = "#ffffff",
        baseFavicon = null,
      } = options

      if (typeof window === "undefined") return false

      try {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        // Limpiar canvas
        ctx.clearRect(0, 0, 32, 32)

        if (baseFavicon) {
          // Si hay favicon base, cargarlo primero
          const img = new Image()
          img.crossOrigin = "anonymous"

          img.onload = () => {
            ctx.drawImage(img, 0, 0, 32, 32)
            drawBadge()
          }

          img.onerror = () => {
            drawDefaultIcon()
            drawBadge()
          }

          img.src = baseFavicon
        } else {
          drawDefaultIcon()
          drawBadge()
        }

        function drawDefaultIcon() {
          // Dibujar icono por defecto
          ctx.fillStyle = backgroundColor
          ctx.fillRect(0, 0, 32, 32)

          // Agregar un círculo blanco en el centro
          ctx.fillStyle = textColor
          ctx.beginPath()
          ctx.arc(16, 16, 8, 0, 2 * Math.PI)
          ctx.fill()
        }

        function drawBadge() {
          if (badgeText) {
            // Configurar badge
            const badgeSize = 12
            const badgeX = 32 - badgeSize - 2
            const badgeY = 2

            // Círculo del badge
            ctx.fillStyle = badgeColor
            ctx.beginPath()
            ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, 2 * Math.PI)
            ctx.fill()

            // Borde blanco
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 1
            ctx.stroke()

            // Texto del badge
            ctx.fillStyle = textColor
            ctx.font = "bold 8px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"

            const displayText = badgeText.length > 2 ? "9+" : badgeText
            ctx.fillText(displayText, badgeX + badgeSize / 2, badgeY + badgeSize / 2)
          }

          // Actualizar favicon
          const dataURL = canvas.toDataURL("image/png")
          setFavicon(dataURL, "image/png")
        }

        return true
      } catch (error) {
        console.error("Error creating favicon with badge:", error)
        return false
      }
    },
    [setFavicon],
  )

  // Restaurar favicon original
  const resetFavicon = useCallback(() => {
    if (typeof window === "undefined") return false

    try {
      const faviconElement = document.querySelector('link[rel="icon"]')
      if (faviconElement && originalFavicons.current.main) {
        faviconElement.href = originalFavicons.current.main
      }

      currentFavicon.current = null
      return true
    } catch (error) {
      console.error("Error resetting favicon:", error)
      return false
    }
  }, [])

  // Crear favicon animado
  const setAnimatedFavicon = useCallback(
    (frames = [], interval = 500) => {
      if (typeof window === "undefined" || !frames.length) return null

      let currentFrame = 0
      const animationInterval = setInterval(() => {
        setFavicon(frames[currentFrame])
        currentFrame = (currentFrame + 1) % frames.length
      }, interval)

      return () => clearInterval(animationInterval)
    },
    [setFavicon],
  )

  // Crear favicon desde texto
  const setTextFavicon = useCallback(
    (text, options = {}) => {
      const { backgroundColor = "#4299e1", textColor = "#ffffff", fontSize = "16px", fontFamily = "Arial" } = options

      if (typeof window === "undefined") return false

      try {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        // Limpiar canvas
        ctx.clearRect(0, 0, 32, 32)

        // Fondo
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, 32, 32)

        // Texto
        ctx.fillStyle = textColor
        ctx.font = `bold ${fontSize} ${fontFamily}`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(text.charAt(0).toUpperCase(), 16, 16)

        const dataURL = canvas.toDataURL("image/png")
        setFavicon(dataURL, "image/png")
        return true
      } catch (error) {
        console.error("Error creating text favicon:", error)
        return false
      }
    },
    [setFavicon],
  )

  return {
    setFavicon,
    setFaviconWithBadge,
    resetFavicon,
    setAnimatedFavicon,
    setTextFavicon,
    currentFavicon: currentFavicon.current,
  }
}

export default useFavicon
