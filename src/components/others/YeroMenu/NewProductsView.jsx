"use client"

import { useState, useEffect } from "react"
import { Box, Grid, Flex, Image, Text, Badge, Button, useColorMode, Spinner, VStack, Divider } from "@chakra-ui/core"
import { BiArrowBack } from "react-icons/bi"
import products from "../../../data"
import CounterBtn from "../CounterBtn"
import { useRecoilValue } from "recoil"
import { cart } from "../../../recoil/state"
import productDescriptions from "../../../data/productDescriptions"

const NewProductsView = ({ onBack }) => {
  const [newProducts, setNewProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productDescription, setProductDescription] = useState("")
  const [isLoadingDescription, setIsLoadingDescription] = useState(false)
  const { colorMode } = useColorMode()
  const currentCart = useRecoilValue(cart)

  // Colores basados en el tema
  const cardBg = colorMode === "light" ? "white" : "gray.700"
  const textColor = colorMode === "light" ? "gray.800" : "white"
  const subTextColor = colorMode === "light" ? "gray.600" : "gray.300"
  const sectionBg = colorMode === "light" ? "gray.50" : "gray.800"

  // Obtener cantidad en carrito
  const getCartQuantity = (product) => {
    if (!product || !currentCart[product.id]) return 0
    return currentCart[product.id].qty
  }

  // Cargar productos nuevos
  useEffect(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const filtered = products
      .filter((product) => {
        if (product.isNew === true) return true
        if (product.dateAdded) {
          const productDate = new Date(product.dateAdded)
          return productDate >= thirtyDaysAgo
        }
        return false
      })
      .sort((a, b) => {
        if (!a.dateAdded) return 1
        if (!b.dateAdded) return -1
        return new Date(b.dateAdded) - new Date(a.dateAdded)
      })
      .slice(0, 20)

    setNewProducts(filtered)
  }, [])

  // Cargar descripción del producto
  useEffect(() => {
    if (!selectedProduct) {
      setProductDescription("")
      return
    }

    setIsLoadingDescription(true)

    const fetchProductDescription = async () => {
      try {
        if (selectedProduct.description && typeof selectedProduct.description === "string") {
          setProductDescription(selectedProduct.description)
          setIsLoadingDescription(false)
          return
        }

        if (productDescriptions && typeof productDescriptions === "object") {
          const productId = selectedProduct.id.toString()
          if (productDescriptions[productId]) {
            const desc = productDescriptions[productId]
            if (typeof desc === "string") {
              setProductDescription(desc)
              setIsLoadingDescription(false)
              return
            }
          }
        }

        setProductDescription("Este producto no tiene descripción disponible.")
        setIsLoadingDescription(false)
      } catch (error) {
        console.error("Error al obtener la descripción del producto:", error)
        setProductDescription("Este producto no tiene descripción disponible.")
        setIsLoadingDescription(false)
      }
    }

    fetchProductDescription()
  }, [selectedProduct])

  if (selectedProduct) {
    return (
      <Box>
        {/* Imagen del producto */}
        <Box position="relative" width="100%">
          <Image
            src={`/images/${selectedProduct.img}`}
            fallbackSrc="/images/productosinimagen.jpg"
            alt={selectedProduct.title}
            objectFit="contain"
            width="100%"
            height={{ base: "250px", sm: "300px", md: "400px" }}
            bg={colorMode === "light" ? "white" : "gray.900"}
          />

          {/* Badges */}
          <Flex position="absolute" top="10px" right="10px" direction="column" align="flex-end">
            <Badge variant="solid" variantColor="green" px="2" py="1" mb={2} borderRadius="full">
              Nuevo
            </Badge>
            {selectedProduct.offerPrice && (
              <Badge variant="solid" variantColor="red" px="2" py="1" mb={2} borderRadius="full">
                Promoción
              </Badge>
            )}
          </Flex>
        </Box>

        {/* Información del producto */}
        <Box p={{ base: 4, md: 6 }}>
          <VStack align="stretch" spacing={4}>
            {/* Título y precio */}
            <Box>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={textColor}>
                {selectedProduct.title}
              </Text>
              {selectedProduct.title1 && (
                <Text fontSize="md" color={subTextColor} mt={1}>
                  {selectedProduct.title1}
                </Text>
              )}
              <Flex align="center" mt={3}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {selectedProduct.offerPrice || selectedProduct.price} CUP
                </Text>
                {selectedProduct.offerPrice && (
                  <Text ml="3" fontSize="md" as="del" color="gray.400">
                    {selectedProduct.price} CUP
                  </Text>
                )}
              </Flex>
            </Box>

            <Divider />

            {/* Categorías */}
            <Flex flexWrap="wrap" gap={2}>
              <Badge variantColor="blue" fontSize="sm">
                {selectedProduct.category}
              </Badge>
              <Badge variantColor="teal" fontSize="sm">
                {selectedProduct.subcategory}
              </Badge>
            </Flex>

            {/* Descripción */}
            <Box p={4} bg={sectionBg} borderRadius="md">
              <Text fontSize="lg" fontWeight="bold" mb={2} color={textColor}>
                Descripción
              </Text>
              {isLoadingDescription ? (
                <Flex justify="center" align="center" py={4}>
                  <Spinner size="md" color="blue.500" mr={3} />
                  <Text>Cargando descripción...</Text>
                </Flex>
              ) : (
                <Text color={subTextColor} whiteSpace="pre-wrap">
                  {productDescription}
                </Text>
              )}
            </Box>

            {/* Botón agregar al carrito */}
            <CounterBtn item={selectedProduct} counter={getCartQuantity(selectedProduct)} size="lg" />

            {/* Botón volver */}
            <Button onClick={() => setSelectedProduct(null)} size="lg" variant="outline">
              <BiArrowBack style={{ marginRight: "8px" }} />
              Volver a productos nuevos
            </Button>
          </VStack>
        </Box>
      </Box>
    )
  }

  return (
    <Box p={4}>
      {newProducts.length > 0 ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {newProducts.map((product) => (
            <Flex
              key={product.id}
              direction="column"
              bg={cardBg}
              rounded="lg"
              overflow="hidden"
              shadow="md"
              onClick={() => setSelectedProduct(product)}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
              height="100%"
            >
              <Box position="relative" h={{ base: "120px", sm: "150px", md: "180px" }}>
                <Image
                  src={`/images/${product.img}`}
                  fallbackSrc="/images/productosinimagen.jpg"
                  alt={product.title}
                  objectFit="cover"
                  size="100%"
                />
                <Badge
                  variant="solid"
                  variantColor="green"
                  position="absolute"
                  px="2"
                  top="5px"
                  left="5px"
                  borderRadius="full"
                  fontSize="xs"
                >
                  Nuevo
                </Badge>
                {product.offerPrice && (
                  <Badge
                    variant="solid"
                    variantColor="red"
                    position="absolute"
                    px="2"
                    top="5px"
                    right="5px"
                    borderRadius="full"
                    fontSize="xs"
                  >
                    Promoción
                  </Badge>
                )}
              </Box>

              <Box p={3} flex="1" display="flex" flexDirection="column" justifyContent="space-between">
                <Box>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" noOfLines={2} color={textColor} mb={1}>
                    {product.title}
                  </Text>
                  <Text fontSize="xs" color={subTextColor} noOfLines={1}>
                    {product.category}
                  </Text>
                </Box>

                <Flex align="flex-end" mt={2}>
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    {product.offerPrice || product.price} CUP
                  </Text>
                  {product.offerPrice && (
                    <Text ml="1" fontSize="sm" as="del" color="gray.400">
                      {product.price} CUP
                    </Text>
                  )}
                </Flex>
              </Box>
            </Flex>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color={subTextColor}>
            No hay productos nuevos disponibles en este momento.
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default NewProductsView
