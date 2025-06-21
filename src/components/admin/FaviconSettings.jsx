"use client"

import { useState, useRef } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import useFavicon from "../../hooks/useFavicon"

const FaviconSettings = () => {
  const toast = useToast()
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [textFaviconValue, setTextFaviconValue] = useState("")
  const [faviconColor, setFaviconColor] = useState("#4299e1")
  const [textColor, setTextColor] = useState("#ffffff")
  const [badgeText, setBadgeText] = useState("")
  const [badgeColor, setBadgeColor] = useState("#ef4444")

  const { setFavicon, setFaviconWithBadge, resetFavicon, setAnimatedFavicon, setTextFavicon } = useFavicon()

  // Manejar carga de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    const validTypes = ["image/png", "image/jpeg", "image/svg+xml", "image/x-icon"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor selecciona un archivo PNG, JPG, SVG o ICO",
        status: "error",
        duration: 3000,
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setPreviewUrl(dataUrl)
      setFavicon(dataUrl, file.type)

      toast({
        title: "Favicon actualizado",
        description: "El favicon se ha cambiado correctamente",
        status: "success",
        duration: 3000,
      })
    }
    reader.readAsDataURL(file)
  }

  // Crear favicon de texto
  const handleTextFavicon = () => {
    if (!textFaviconValue.trim()) {
      toast({
        title: "Texto requerido",
        description: "Por favor ingresa al menos un carácter",
        status: "warning",
        duration: 3000,
      })
      return
    }

    setTextFavicon(textFaviconValue, {
      backgroundColor: faviconColor,
      textColor: textColor,
    })

    toast({
      title: "Favicon de texto creado",
      description: "El favicon se ha generado con el texto especificado",
      status: "success",
      duration: 3000,
    })
  }

  // Crear favicon con badge
  const handleBadgeFavicon = () => {
    setFaviconWithBadge({
      badgeText: badgeText,
      badgeColor: badgeColor,
      backgroundColor: faviconColor,
      textColor: textColor,
    })

    toast({
      title: "Favicon con badge creado",
      description: "El favicon se ha generado con el badge especificado",
      status: "success",
      duration: 3000,
    })
  }

  // Crear favicon animado de ejemplo
  const handleAnimatedFavicon = () => {
    // Crear frames simples usando canvas
    const createColorFrame = (color) => {
      const canvas = document.createElement("canvas")
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext("2d")

      ctx.fillStyle = color
      ctx.fillRect(0, 0, 32, 32)

      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(16, 16, 8, 0, 2 * Math.PI)
      ctx.fill()

      return canvas.toDataURL("image/png")
    }

    const frames = [createColorFrame("#4299e1"), createColorFrame("#ef4444"), createColorFrame("#10b981")]

    const stopAnimation = setAnimatedFavicon(frames, 1000)

    toast({
      title: "Favicon animado iniciado",
      description: "El favicon ahora está animado. Se detendrá automáticamente en 10 segundos.",
      status: "info",
      duration: 3000,
    })

    // Detener animación después de 10 segundos
    setTimeout(() => {
      if (stopAnimation) stopAnimation()
      resetFavicon()
    }, 10000)
  }

  // Restaurar favicon original
  const handleResetFavicon = () => {
    resetFavicon()
    setPreviewUrl("")

    toast({
      title: "Favicon restaurado",
      description: "Se ha restaurado el favicon original",
      status: "success",
      duration: 3000,
    })
  }

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Configuración de Favicon
      </Text>

      <VStack spacing={6} align="stretch">
        {/* Subir archivo */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Subir Favicon Personalizado
          </Text>
          <HStack spacing={4}>
            <Input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.ico"
              onChange={handleFileUpload}
              ref={fileInputRef}
              display="none"
            />
            <Button onClick={() => fileInputRef.current?.click()} colorScheme="blue">
              Seleccionar Archivo
            </Button>
            {previewUrl && (
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                boxSize="32px"
                border="1px solid"
                borderColor="gray.200"
              />
            )}
          </HStack>
          <Text fontSize="sm" color="gray.600" mt={2}>
            Formatos soportados: PNG, JPG, SVG, ICO (recomendado: 32x32px)
          </Text>
        </Box>

        <Divider />

        {/* Favicon de texto */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Crear Favicon de Texto
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Texto (1 carácter)</FormLabel>
                <Input
                  value={textFaviconValue}
                  onChange={(e) => setTextFaviconValue(e.target.value.slice(0, 1))}
                  placeholder="A"
                  maxLength={1}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Color de fondo</FormLabel>
                <Input type="color" value={faviconColor} onChange={(e) => setFaviconColor(e.target.value)} />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Color de texto</FormLabel>
                <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              </FormControl>
            </GridItem>
            <GridItem>
              <Button onClick={handleTextFavicon} colorScheme="green" mt={6}>
                Crear Favicon de Texto
              </Button>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Favicon con badge */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Crear Favicon con Badge
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Texto del badge</FormLabel>
                <Input
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value.slice(0, 3))}
                  placeholder="NEW"
                  maxLength={3}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Color del badge</FormLabel>
                <Input type="color" value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <Button onClick={handleBadgeFavicon} colorScheme="purple" width="full">
                Crear Favicon con Badge
              </Button>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Acciones adicionales */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Acciones Adicionales
          </Text>
          <HStack spacing={4}>
            <Button onClick={handleAnimatedFavicon} colorScheme="orange">
              Probar Animación
            </Button>
            <Button onClick={handleResetFavicon} variant="outline">
              Restaurar Original
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default FaviconSettings
