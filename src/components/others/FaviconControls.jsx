"use client"

import { Box, Button, HStack, Text } from "@chakra-ui/react"
import useFavicon from "../../hooks/useFavicon"

const FaviconControls = () => {
  const { setTextFavicon, setFaviconWithBadge, resetFavicon } = useFavicon()

  const handleSetTextFavicon = () => {
    setTextFavicon("T", "#ff6b6b", "#ffffff")
  }

  const handleSetBadgeFavicon = () => {
    setFaviconWithBadge("5", "#10b981", "#4299e1")
  }

  const handleResetFavicon = () => {
    resetFavicon()
  }

  return (
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text fontSize="md" fontWeight="semibold" mb={3}>
        Controles de Favicon
      </Text>
      <HStack spacing={2}>
        <Button size="sm" onClick={handleSetTextFavicon} colorScheme="red">
          Texto "T"
        </Button>
        <Button size="sm" onClick={handleSetBadgeFavicon} colorScheme="green">
          Badge "5"
        </Button>
        <Button size="sm" onClick={handleResetFavicon} variant="outline">
          Restaurar
        </Button>
      </HStack>
    </Box>
  )
}

export default FaviconControls
