"use client"

import { useState, useEffect } from "react"
import { Box, VStack, Button, Text, Flex, useColorMode, useToast, Badge } from "@chakra-ui/core"
import { BiGlobe, BiCheck, BiArrowBack } from "react-icons/bi"

const LanguageView = ({ onBack }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("es")
  const { colorMode } = useColorMode()
  const toast = useToast()

  // Colores basados en el tema
  const textColor = colorMode === "light" ? "gray.800" : "white"
  const buttonHoverBg = colorMode === "light" ? "gray.100" : "gray.700"

  // Idiomas disponibles
  const languages = [
    {
      code: "es",
      name: "Español",
      nativeName: "Español",
      flag: "🇪🇸",
      description: "Idioma español",
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      description: "English language",
    },
  ]

  // Cargar idioma guardado
  useEffect(() => {
    const savedLanguage = localStorage.getItem("yero-language") || "es"
    setSelectedLanguage(savedLanguage)
  }, [])

  // Cambiar idioma
  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem("yero-language", languageCode)

    // Mostrar toast de confirmación
    const language = languages.find((l) => l.code === languageCode)
    const message =
      languageCode === "es" ? `Idioma cambiado a ${language.name}` : `Language changed to ${language.name}`

    toast({
      title: languageCode === "es" ? "Idioma cambiado" : "Language changed",
      description: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    })

    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: languageCode },
      }),
    )
  }

  // Obtener textos según el idioma seleccionado
  const getText = (key) => {
    const texts = {
      es: {
        title: "Seleccionar Idioma",
        subtitle: "Elige el idioma de la aplicación",
        note: "💡 Nota: El idioma seleccionado se aplicará a toda la aplicación y se guardará para futuras visitas.",
        backButton: "Volver al menú principal",
      },
      en: {
        title: "Select Language",
        subtitle: "Choose the application language",
        note: "💡 Note: The selected language will be applied to the entire application and saved for future visits.",
        backButton: "Back to main menu",
      },
    }
    return texts[selectedLanguage][key] || texts.es[key]
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={4}>
          <Box as={BiGlobe} size="48px" color="blue.500" mx="auto" mb={3} />
          <Text fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
            {getText("title")}
          </Text>
          <Text fontSize="md" color="gray.500">
            {getText("subtitle")}
          </Text>
        </Box>

        <VStack spacing={3} align="stretch">
          {languages.map((language) => (
            <Button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              variant="outline"
              justifyContent="flex-start"
              h="auto"
              p={4}
              _hover={{ bg: buttonHoverBg }}
              borderRadius="lg"
              transition="all 0.2s"
              borderColor={selectedLanguage === language.code ? "blue.500" : "gray.200"}
              borderWidth={selectedLanguage === language.code ? "2px" : "1px"}
              position="relative"
            >
              <Flex align="center" w="100%" justify="space-between">
                <Flex align="center">
                  <Text fontSize="2xl" mr={3}>
                    {language.flag}
                  </Text>
                  <Box textAlign="left">
                    <Flex align="center" mb={1}>
                      <Text fontSize="lg" fontWeight="bold" color={textColor} mr={2}>
                        {language.nativeName}
                      </Text>
                      <Badge variant="subtle" variantColor="blue" fontSize="xs" px={2} py={1} borderRadius="full">
                        {language.code.toUpperCase()}
                      </Badge>
                    </Flex>
                    <Text fontSize="md" color={textColor} mb={1}>
                      {language.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {language.description}
                    </Text>
                  </Box>
                </Flex>

                {selectedLanguage === language.code && <Box as={BiCheck} size="24px" color="blue.500" />}
              </Flex>
            </Button>
          ))}
        </VStack>

        <Box mt={6} p={4} bg="blue.50" borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.500">
          <Text fontSize="sm" color="blue.700" fontWeight="medium">
            {getText("note")}
          </Text>
        </Box>

        <Button onClick={onBack} size="lg" mt={4} variant="outline">
          <BiArrowBack style={{ marginRight: "8px" }} />
          {getText("backButton")}
        </Button>
      </VStack>
    </Box>
  )
}

export default LanguageView
