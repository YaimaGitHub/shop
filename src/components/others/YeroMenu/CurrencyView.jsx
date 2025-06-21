"use client"

import { useState, useEffect } from "react"
import { Box, VStack, Button, Text, Flex, useColorMode, useToast, Badge } from "@chakra-ui/core"
import { BiDollar, BiCheck, BiArrowBack } from "react-icons/bi"

const CurrencyView = ({ onBack }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("CUP")
  const { colorMode } = useColorMode()
  const toast = useToast()

  // Colores basados en el tema
  const textColor = colorMode === "light" ? "gray.800" : "white"
  const buttonHoverBg = colorMode === "light" ? "gray.100" : "gray.700"

  // Monedas disponibles
  const currencies = [
    {
      code: "CUP",
      name: "Peso Cubano",
      symbol: "$",
      flag: "🇨🇺",
      description: "Moneda oficial de Cuba",
    },
    {
      code: "USD",
      name: "Dólar Estadounidense",
      symbol: "$",
      flag: "🇺🇸",
      description: "Dólar de Estados Unidos",
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      flag: "🇪🇺",
      description: "Moneda de la Unión Europea",
    },
    {
      code: "MLC",
      name: "Moneda Libremente Convertible",
      symbol: "MLC",
      flag: "🏦",
      description: "Moneda digital cubana",
    },
  ]

  // Cargar moneda guardada
  useEffect(() => {
    const savedCurrency = localStorage.getItem("yero-currency") || "CUP"
    setSelectedCurrency(savedCurrency)
  }, [])

  // Cambiar moneda
  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrency(currencyCode)
    localStorage.setItem("yero-currency", currencyCode)

    // Mostrar toast de confirmación
    const currency = currencies.find((c) => c.code === currencyCode)
    toast({
      title: "Moneda cambiada",
      description: `Ahora los precios se mostrarán en ${currency.name}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })

    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(
      new CustomEvent("currencyChanged", {
        detail: { currency: currencyCode },
      }),
    )
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={4}>
          <Box as={BiDollar} size="48px" color="green.500" mx="auto" mb={3} />
          <Text fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
            Seleccionar Moneda
          </Text>
          <Text fontSize="md" color="gray.500">
            Elige la moneda en la que quieres ver los precios
          </Text>
        </Box>

        <VStack spacing={3} align="stretch">
          {currencies.map((currency) => (
            <Button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              variant="outline"
              justifyContent="flex-start"
              h="auto"
              p={4}
              _hover={{ bg: buttonHoverBg }}
              borderRadius="lg"
              transition="all 0.2s"
              borderColor={selectedCurrency === currency.code ? "blue.500" : "gray.200"}
              borderWidth={selectedCurrency === currency.code ? "2px" : "1px"}
              position="relative"
            >
              <Flex align="center" w="100%" justify="space-between">
                <Flex align="center">
                  <Text fontSize="2xl" mr={3}>
                    {currency.flag}
                  </Text>
                  <Box textAlign="left">
                    <Flex align="center" mb={1}>
                      <Text fontSize="lg" fontWeight="bold" color={textColor} mr={2}>
                        {currency.code}
                      </Text>
                      <Badge variant="subtle" variantColor="blue" fontSize="xs" px={2} py={1} borderRadius="full">
                        {currency.symbol}
                      </Badge>
                    </Flex>
                    <Text fontSize="md" color={textColor} mb={1}>
                      {currency.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {currency.description}
                    </Text>
                  </Box>
                </Flex>

                {selectedCurrency === currency.code && <Box as={BiCheck} size="24px" color="blue.500" />}
              </Flex>
            </Button>
          ))}
        </VStack>

        <Box mt={6} p={4} bg="blue.50" borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.500">
          <Text fontSize="sm" color="blue.700" fontWeight="medium">
            💡 Nota: Los precios se convertirán automáticamente según las tasas de cambio actuales. La moneda
            seleccionada se guardará para futuras visitas.
          </Text>
        </Box>

        <Button onClick={onBack} size="lg" mt={4} variant="outline">
          <BiArrowBack style={{ marginRight: "8px" }} />
          Volver al menú principal
        </Button>
      </VStack>
    </Box>
  )
}

export default CurrencyView
