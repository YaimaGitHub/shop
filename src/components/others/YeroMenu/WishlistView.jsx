"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Flex,
  Image,
  Text,
  Badge,
  Button,
  useColorMode,
  VStack,
  Divider,
  IconButton,
  useToast,
} from "@chakra-ui/core"
import { BiHeartCircle, BiArrowBack, BiX, BiHeart } from "react-icons/bi"
import products from "../../../data"
import CounterBtn from "../CounterBtn"
import { useRecoilValue } from "recoil"
import { cart } from "../../../recoil/state"
import productDescriptions from "../../../data/productDescriptions"

const WishlistView = ({ onBack }) => {
  const [wishlist, setWishlist] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productDescription, setProductDescription] = useState("")
  const { colorMode } = useColorMode()
  const currentCart = useRecoilValue(cart)
  const toast = useToast()

  // Colores basados en el tema
  const cardBg = colorMode === "light" ? "white" : "gray.700"
  const textColor = colorMode === "light" ? "gray.800" : "white"
  const subTextColor = colorMode === "light" ? "gray.600" : "gray.300"
  const sectionBg = colorMode === "light" ? "gray.50" : "gray.800"

  // Cargar wishlist del localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("yero-wishlist") || "[]")
    setWishlist(savedWishlist)

    // Obtener productos de la wishlist
    const wishlistItems = products.filter((product) => savedWishlist.includes(product.id.toString()))
    setWishlistProducts(wishlistItems)
  }, [])

  // Obtener cantidad en carrito
  const getCartQuantity = (product) => {
    if (!product || !currentCart[product.id]) return 0
    return currentCart[product.id].qty
  }

  // Agregar/quitar de wishlist
  const toggleWishlist = (productId) => {
    const productIdStr = productId.toString()
    let newWishlist = [...wishlist]

    if (newWishlist.includes(productIdStr)) {
      newWishlist = newWishlist.filter((id) => id !== productIdStr)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado de tu lista de deseados",
        status: "info",
        duration: 2000,
        isClosable: true,
      })
    } else {
      newWishlist.push(productIdStr)
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado a tu lista de deseados",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    }

    setWishlist(newWishlist)
    localStorage.setItem("yero-wishlist", JSON.stringify(newWishlist))

    // Actualizar productos de wishlist
    const wishlistItems = products.filter((product) => newWishlist.includes(product.id.toString()))
    setWishlistProducts(wishlistItems)
  }

  // Cargar descripción del producto
  useEffect(() => {
    if (!selectedProduct) {
      setProductDescription("")
      return
    }

    const fetchProductDescription = async () => {
      try {
        if (selectedProduct.description && typeof selectedProduct.description === "string") {
          setProductDescription(selectedProduct.description)
          return
        }

        if (productDescriptions && typeof productDescriptions === "object") {
          const productId = selectedProduct.id.toString()
          if (productDescriptions[productId]) {
            const desc = productDescriptions[productId]
            if (typeof desc === "string") {
              setProductDescription(desc)
              return
            }
          }
        }

        setProductDescription("Este producto no tiene descripción disponible.")
      } catch (error) {
        console.error("Error al obtener la descripción del producto:", error)
        setProductDescription("Este producto no tiene descripción disponible.")
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

          {/* Botón de wishlist */}
          <IconButton
            position="absolute"
            top="10px"
            right="10px"
            bg="white"
            color={wishlist.includes(selectedProduct.id.toString()) ? "red.500" : "gray.400"}
            borderRadius="full"
            size="lg"
            onClick={() => toggleWishlist(selectedProduct.id)}
            _hover={{ transform: "scale(1.1)" }}
            boxShadow="md"
            aria-label="Toggle wishlist"
          >
            <BiHeart />
          </IconButton>

          {/* Badges */}
          <Flex position="absolute" top="10px" left="10px" direction="column" align="flex-start">
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
              <Text color={subTextColor} whiteSpace="pre-wrap">
                {productDescription}
              </Text>
            </Box>

            {/* Botón agregar al carrito */}
            <CounterBtn item={selectedProduct} counter={getCartQuantity(selectedProduct)} size="lg" />

            {/* Botón volver */}
            <Button onClick={() => setSelectedProduct(null)} size="lg" variant="outline">
              <BiArrowBack style={{ marginRight: "8px" }} />
              Volver a lista de deseados
            </Button>
          </VStack>
        </Box>
      </Box>
    )
  }

  return (
    <Box p={4}>
      {wishlistProducts.length > 0 ? (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
            {wishlistProducts.length} producto{wishlistProducts.length !== 1 ? "s" : ""} en tu lista de deseados
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {wishlistProducts.map((product, index) => (
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
                position="relative"
              >
                {/* Número de orden */}
                <Badge
                  variant="solid"
                  variantColor="blue"
                  position="absolute"
                  top="5px"
                  left="5px"
                  borderRadius="full"
                  fontSize="xs"
                  zIndex="2"
                >
                  #{index + 1}
                </Badge>

                {/* Botón de eliminar de wishlist */}
                <IconButton
                  position="absolute"
                  top="5px"
                  right="5px"
                  size="sm"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product.id)
                  }}
                  _hover={{ bg: "red.600" }}
                  zIndex="2"
                  aria-label="Remove from wishlist"
                >
                  <BiX />
                </IconButton>

                <Box position="relative" h={{ base: "120px", sm: "150px", md: "180px" }}>
                  <Image
                    src={`/images/${product.img}`}
                    fallbackSrc="/images/productosinimagen.jpg"
                    alt={product.title}
                    objectFit="cover"
                    size="100%"
                  />
                  {product.offerPrice && (
                    <Badge
                      variant="solid"
                      variantColor="red"
                      position="absolute"
                      px="2"
                      bottom="5px"
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
        </>
      ) : (
        <Box textAlign="center" py={10}>
          <Box as={BiHeartCircle} size="64px" color="gray.400" mx="auto" mb={4} />
          <Text fontSize="lg" color={subTextColor} mb={4}>
            Tu lista de deseados está vacía
          </Text>
          <Text fontSize="md" color={subTextColor}>
            Agrega productos a tu lista de deseados tocando el ❤️ en cualquier producto
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default WishlistView
