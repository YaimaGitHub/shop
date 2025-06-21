"use client"

import { useState, useEffect } from "react"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Box, Flex, Text, PseudoBox } from "@chakra-ui/core"
import { useRecoilValue } from "recoil"
import { cart } from "../../recoil/state"
import CounterBtn from "./CounterBtn"

// Componente del botón de lista de deseados con animación y cambio de estado
const WishlistButton = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Verificar si el producto ya está en la lista al cargar
  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("yero-wishlist") || "[]")
      setIsAdded(savedWishlist.includes(product.id.toString()))
    } catch (error) {
      console.error("Error checking wishlist:", error)
    }
  }, [product.id])

  const handleAddToWishlist = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const savedWishlist = JSON.parse(localStorage.getItem("yero-wishlist") || "[]")

      if (!savedWishlist.includes(product.id.toString())) {
        const newWishlist = [...savedWishlist, product.id.toString()]
        localStorage.setItem("yero-wishlist", JSON.stringify(newWishlist))
        setIsAdded(true)

        // Crear notificación visual moderna
        const notification = document.createElement("div")
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(72, 187, 120, 0.3);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 600;
          transform: translateX(400px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        `

        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">✅</span>
            <div>
              <div style="font-size: 14px; opacity: 0.9;">Producto agregado</div>
              <div style="font-size: 12px; opacity: 0.7;">"${product.title}"</div>
            </div>
          </div>
        `

        document.body.appendChild(notification)

        // Animar entrada
        setTimeout(() => {
          if (notification && notification.style) {
            notification.style.transform = "translateX(0)"
          }
        }, 100)

        // Animar salida y remover
        setTimeout(() => {
          if (notification && notification.style) {
            notification.style.transform = "translateX(400px)"
            setTimeout(() => {
              if (notification && notification.parentNode) {
                document.body.removeChild(notification)
              }
            }, 500)
          }
        }, 3000)
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PseudoBox
      as="button"
      onClick={handleAddToWishlist}
      p={{ base: 3, sm: 3.5, md: 4 }}
      bg={isAdded ? "green.500" : "red.500"}
      color="white"
      borderRadius="lg"
      minH={{ base: "48px", sm: "52px", md: "56px" }}
      fontSize={{ base: "14px", sm: "15px", md: "16px" }}
      _hover={{
        bg: isAdded ? "green.600" : "red.600",
        transform: "translateY(-2px)",
        boxShadow: isAdded ? "0 8px 25px rgba(72, 187, 120, 0.3)" : "0 8px 25px rgba(229, 62, 62, 0.3)",
      }}
      _active={{
        transform: "translateY(0px)",
        boxShadow: isAdded ? "0 4px 15px rgba(72, 187, 120, 0.2)" : "0 4px 15px rgba(229, 62, 62, 0.2)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      w="100%"
      position="relative"
      overflow="hidden"
      cursor={isLoading ? "not-allowed" : "pointer"}
      opacity={isLoading ? 0.7 : 1}
      _before={{
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "0",
        height: "0",
        bg: "rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        transition: "width 0.6s, height 0.6s",
      }}
      _focus={{
        _before: {
          width: "300px",
          height: "300px",
        },
      }}
    >
      <Flex align="center" justify="center" position="relative" zIndex="1">
        {isLoading ? (
          <>
            <Text fontSize={{ base: "16px", sm: "17px", md: "18px" }} mr={2}>
              ⏳
            </Text>
            <Text fontWeight="semibold">Agregando...</Text>
          </>
        ) : isAdded ? (
          <>
            <Text fontSize={{ base: "16px", sm: "17px", md: "18px" }} mr={2}>
              ✅
            </Text>
            <Text fontWeight="semibold">Ha sido agregado a deseados</Text>
          </>
        ) : (
          <>
            <Text fontSize={{ base: "16px", sm: "17px", md: "18px" }} mr={2}>
              ❤️
            </Text>
            <Text fontWeight="semibold">Agregar a Deseados</Text>
          </>
        )}
      </Flex>
    </PseudoBox>
  )
}

const YeroMenu = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState("main")

  // Resetear vista cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setCurrentView("main")
    }
  }, [isOpen])

  // Navegar a una vista
  const navigateToView = (view) => {
    setCurrentView(view)
  }

  // Volver al menú principal
  const goBack = () => {
    setCurrentView("main")
  }

  // Opciones del menú principal
  const menuOptions = [
    {
      id: "new-products",
      title: "Productos Nuevos",
      description: "Ver los últimos productos agregados",
      icon: "📦",
      color: "green.500",
    },
    {
      id: "wishlist",
      title: "Lista de Productos Deseados",
      description: "Tus productos favoritos guardados",
      icon: "❤️",
      color: "red.500",
    },
    {
      id: "currency",
      title: "Monedas",
      description: "Cambiar tipo de moneda",
      icon: "💰",
      color: "yellow.500",
    },
    {
      id: "language",
      title: "Idioma",
      description: "Cambiar idioma de la aplicación",
      icon: "🌐",
      color: "blue.500",
    },
    {
      id: "admin",
      title: "Panel Administrativo",
      description: "Acceso para administradores",
      icon: "⚙️",
      color: "purple.500",
    },
  ]

  // Obtener título de la vista actual
  const getViewTitle = () => {
    switch (currentView) {
      case "main":
        return "Yero Menu"
      case "new-products":
        return "Productos Nuevos"
      case "wishlist":
        return "Lista de Deseados"
      case "currency":
        return "Seleccionar Moneda"
      case "language":
        return "Seleccionar Idioma"
      case "admin":
        return "Panel Administrativo"
      default:
        return "Yero Menu"
    }
  }

  // Renderizar contenido de la vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case "main":
        return (
          <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
            {menuOptions.map((option) => (
              <PseudoBox
                key={option.id}
                as="button"
                onClick={() => navigateToView(option.id)}
                p={4}
                mb={3}
                borderRadius="lg"
                transition="all 0.2s"
                _hover={{ bg: "gray.100", transform: "translateY(-1px)" }}
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                w="100%"
              >
                <Flex align="center" w="100%">
                  <Text fontSize="24px" mr={4}>
                    {option.icon}
                  </Text>
                  <Box textAlign="left" flex="1">
                    <Text fontSize="md" fontWeight="semibold" color="gray.800">
                      {option.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {option.description}
                    </Text>
                  </Box>
                </Flex>
              </PseudoBox>
            ))}
          </Box>
        )
      case "new-products":
        return <NewProductsView onBack={goBack} />
      case "wishlist":
        return <WishlistView onBack={goBack} />
      case "currency":
        return <CurrencyView onBack={goBack} />
      case "language":
        return <LanguageView onBack={goBack} />
      case "admin":
        return <AdminLoginView onBack={goBack} />
      default:
        return null
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        maxW={{ base: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" }}
        maxH={{ base: "100%", sm: "90%" }}
        my={{ base: 0, sm: "5vh" }}
        borderRadius={{ base: 0, sm: "xl" }}
        bg="white"
        boxShadow="2xl"
        overflow="hidden"
      >
        <ModalHeader
          bg="blue.600"
          color="white"
          borderTopRadius={{ base: 0, sm: "xl" }}
          py={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Flex align="center" flex="1">
            {currentView !== "main" && (
              <PseudoBox
                as="button"
                color="white"
                fontSize="20px"
                mr={3}
                onClick={goBack}
                _hover={{ bg: "rgba(255,255,255,0.2)" }}
                p={2}
                borderRadius="md"
              >
                ←
              </PseudoBox>
            )}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
              {getViewTitle()}
            </Text>
          </Flex>
          <PseudoBox
            as="button"
            color="white"
            fontSize="18px"
            onClick={onClose}
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            p={2}
            borderRadius="md"
          >
            ✕
          </PseudoBox>
        </ModalHeader>

        <ModalBody p={0} maxH="calc(100vh - 120px)" overflowY="auto">
          {renderCurrentView()}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// Componente de Productos Nuevos
const NewProductsView = ({ onBack }) => {
  const [newProducts, setNewProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const currentCart = useRecoilValue(cart)

  const [productDescription, setProductDescription] = useState("")

  // Cargar descripción del producto
  useEffect(() => {
    if (!selectedProduct) {
      setProductDescription("")
      return
    }

    const fetchProductDescription = async () => {
      try {
        // Intentar obtener descripción del producto directamente
        if (selectedProduct.description && typeof selectedProduct.description === "string") {
          setProductDescription(selectedProduct.description)
          return
        }

        // Intentar obtener de productDescriptions
        try {
          const productDescriptions =
            require("../../data/productDescriptions").default || require("../../data/productDescriptions")
          if (productDescriptions && typeof productDescriptions === "object") {
            const productId = selectedProduct.id.toString()
            if (productDescriptions[productId]) {
              const desc = productDescriptions[productId]
              if (typeof desc === "object" && desc.description) {
                setProductDescription(desc.description)
                return
              } else if (typeof desc === "string") {
                setProductDescription(desc)
                return
              }
            }
          }
        } catch (descError) {
          console.log("ProductDescriptions not available:", descError)
        }

        // Descripción por defecto si no se encuentra
        setProductDescription("Este producto no tiene descripción disponible.")
      } catch (error) {
        console.error("Error al obtener la descripción del producto:", error)
        setProductDescription("Este producto no tiene descripción disponible.")
      }
    }

    fetchProductDescription()
  }, [selectedProduct])

  // Obtener cantidad en carrito
  const getCartQuantity = (product) => {
    if (!product || !currentCart[product.id]) return 0
    return currentCart[product.id].qty
  }

  // Cargar productos nuevos con fechas
  useEffect(() => {
    try {
      const products = require("../../data").default || require("../../data")

      // Agregar fechas a productos específicos (simulando productos nuevos)
      const recentDates = [
        "2024-12-10",
        "2024-12-08",
        "2024-12-05",
        "2024-12-03",
        "2024-12-01",
        "2024-11-28",
        "2024-11-25",
        "2024-11-22",
        "2024-11-20",
        "2024-11-18",
      ]

      // Productos que consideraremos como "nuevos"
      const newProductIds = [
        "0001", // Albendazol
        "9", // Azitromicina
        "2", // Amoxicilina
        "77", // Amoxicilina en Suspensión
        "3", // Ciprofloxacino
        "4", // Cefalexina
        "888", // Cefalexina Suspensión
        "789", // Diclofenaco + Paracetamol
        "00012", // Fluconazol
        "000", // Ibuprofeno
      ]

      const productsWithDates = products.map((product) => {
        if (newProductIds.includes(product.id)) {
          const randomDateIndex = Math.floor(Math.random() * recentDates.length)
          return {
            ...product,
            dateAdded: recentDates[randomDateIndex],
            isNew: true,
          }
        }

        return product
      })

      // Filtrar y ordenar productos nuevos por fecha
      const filtered = productsWithDates
        .filter((product) => product.isNew === true)
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 20)

      setNewProducts(filtered)
    } catch (error) {
      console.error("Error loading products:", error)
      setNewProducts([])
    }
  }, [])

  const addToWishlist = (product) => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("yero-wishlist") || "[]")
      if (!savedWishlist.includes(product.id.toString())) {
        const newWishlist = [...savedWishlist, product.id.toString()]
        localStorage.setItem("yero-wishlist", JSON.stringify(newWishlist))

        // Crear notificación visual moderna
        const notification = document.createElement("div")
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(72, 187, 120, 0.3);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 600;
          transform: translateX(400px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        `

        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">✅</span>
            <div>
              <div style="font-size: 14px; opacity: 0.9;">Producto agregado</div>
              <div style="font-size: 12px; opacity: 0.7;">"${product.title}"</div>
            </div>
          </div>
        `

        document.body.appendChild(notification)

        // Animar entrada
        setTimeout(() => {
          if (notification && notification.style) {
            notification.style.transform = "translateX(0)"
          }
        }, 100)

        // Animar salida y remover
        setTimeout(() => {
          if (notification && notification.style) {
            notification.style.transform = "translateX(400px)"
            setTimeout(() => {
              if (notification && notification.parentNode) {
                document.body.removeChild(notification)
              }
            }, 500)
          }
        }, 3000)
      } else {
        // Notificación de producto ya existente
        const notification = document.createElement("div")
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(237, 137, 54, 0.3);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 600;
          transform: translateX(400px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        `

        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">ℹ️</span>
            <div>
              <div style="font-size: 14px; opacity: 0.9;">Ya está en tu lista</div>
              <div style="font-size: 12px; opacity: 0.7;">"${product.title}"</div>
            </div>
          </div>
        `

        document.body.appendChild(notification)

        setTimeout(() => {
          if (notification && notification.style) {
            notification.style.transform = "translateX(0)"
          }
        }, 100)

        setTimeout(() => {
          if (notification && notification.style) {
            notification.style.transform = "translateX(400px)"
            setTimeout(() => {
              if (notification && notification.parentNode) {
                document.body.removeChild(notification)
              }
            }, 500)
          }
        }, 3000)
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
    }
  }

  if (selectedProduct) {
    return (
      <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
        <PseudoBox
          as="button"
          onClick={() => setSelectedProduct(null)}
          mb={4}
          p={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          _hover={{ bg: "gray.100" }}
        >
          <Flex align="center">
            <Text mr={2}>←</Text>
            <Text>Volver a productos nuevos</Text>
          </Flex>
        </PseudoBox>

        <Box>
          <Box position="relative" width="100%" height="300px" bg="gray.100" borderRadius="md" mb={4}>
            <img
              src={`/images/${selectedProduct.img}`}
              alt={selectedProduct.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "6px",
              }}
              onError={(e) => {
                e.target.src = "/images/productosinimagen.jpg"
              }}
            />
          </Box>

          {/* Información del producto */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={2}>
              {selectedProduct.title}
            </Text>

            {selectedProduct.title1 && (
              <Text fontSize="md" color="gray.600" mb={3}>
                {selectedProduct.title1}
              </Text>
            )}

            <Flex align="center" mb={4}>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {selectedProduct.offerPrice || selectedProduct.price} CUP
              </Text>
              {selectedProduct.offerPrice && (
                <Text ml="3" fontSize="md" as="del" color="gray.400">
                  {selectedProduct.price} CUP
                </Text>
              )}
            </Flex>

            {/* Información adicional */}
            <Box bg="gray.50" p={4} borderRadius="md" mb={4}>
              <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={2}>
                Detalles del producto
              </Text>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  ID:
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {selectedProduct.id}
                </Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Categoría:
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {selectedProduct.category}
                </Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Subcategoría:
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {selectedProduct.subcategory}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Stock:
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {selectedProduct.stock} unidades
                </Text>
              </Flex>
            </Box>

            {/* Descripción */}
            <Box bg="gray.50" p={4} borderRadius="md" mb={4}>
              <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={2}>
                Descripción
              </Text>
              <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
                {productDescription}
              </Text>
            </Box>

            {/* Información de pago */}
            <Box
              bg={selectedProduct.allowBankTransfer !== false ? "green.50" : "red.50"}
              p={4}
              borderRadius="md"
              mb={4}
              border="1px solid"
              borderColor={selectedProduct.allowBankTransfer !== false ? "green.200" : "red.200"}
            >
              <Flex align="center">
                <Text fontSize="lg" mr={2}>
                  {selectedProduct.allowBankTransfer !== false ? "✅" : "🚫"}
                </Text>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={selectedProduct.allowBankTransfer !== false ? "green.700" : "red.700"}
                  >
                    {selectedProduct.allowBankTransfer !== false
                      ? "Métodos de pago disponibles"
                      : "Restricción de pago"}
                  </Text>
                  <Text fontSize="xs" color={selectedProduct.allowBankTransfer !== false ? "green.600" : "red.600"}>
                    {selectedProduct.allowBankTransfer !== false
                      ? "Este producto acepta pago en efectivo y transferencia bancaria"
                      : "Este producto solo puede pagarse en efectivo"}
                  </Text>
                </Box>
              </Flex>
            </Box>

            {selectedProduct.dateAdded && (
              <Box bg="blue.50" p={4} borderRadius="md" mb={4} border="1px solid" borderColor="blue.200">
                <Flex align="center">
                  <Text fontSize="lg" mr={2}>
                    📅
                  </Text>
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="blue.700">
                      Producto nuevo
                    </Text>
                    <Text fontSize="xs" color="blue.600">
                      Agregado el: {new Date(selectedProduct.dateAdded).toLocaleDateString("es-ES")}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            )}

            {/* Botones de acción */}
            <Box mb={4}>
              {/* Botón para agregar al carrito */}
              <Box mb={3} w="100%" display="flex" justifyContent="center">
                <Box
                  w="100%"
                  minH={{ base: "48px", sm: "52px", md: "56px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CounterBtn
                    item={selectedProduct}
                    counter={getCartQuantity(selectedProduct)}
                    size="md"
                    style={{ width: "100%", display: "flex", justifyContent: "center" }}
                  />
                </Box>
              </Box>

              {/* Botón para agregar a deseados con animación y cambio de texto */}
              <WishlistButton product={selectedProduct} />
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
      <PseudoBox
        as="button"
        onClick={onBack}
        mb={4}
        p={2}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.100" }}
      >
        <Flex align="center">
          <Text mr={2}>←</Text>
          <Text>Volver al menú</Text>
        </Flex>
      </PseudoBox>

      {newProducts.length > 0 ? (
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
            {newProducts.length} productos nuevos disponibles
          </Text>
          {newProducts.map((product) => (
            <Box
              key={product.id}
              p={3}
              mb={3}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              shadow="sm"
            >
              <Flex align="center" mb={3}>
                <Box w="60px" h="60px" mr={3} bg="gray.100" borderRadius="md" overflow="hidden">
                  <img
                    src={`/images/${product.img}`}
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "/images/productosinimagen.jpg"
                    }}
                  />
                </Box>
                <Box flex="1">
                  <Flex align="center" mb={1}>
                    <Text fontSize="xs" bg="green.100" color="green.700" px={2} py={1} borderRadius="full" mr={2}>
                      NUEVO
                    </Text>
                    {product.dateAdded && (
                      <Text fontSize="xs" color="blue.500">
                        {new Date(product.dateAdded).toLocaleDateString("es-ES")}
                      </Text>
                    )}
                  </Flex>
                  <PseudoBox
                    as="button"
                    onClick={() => setSelectedProduct(product)}
                    textAlign="left"
                    _hover={{ color: "blue.500" }}
                  >
                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                      {product.title}
                    </Text>
                  </PseudoBox>
                  <Text fontSize="sm" color="gray.600">
                    {product.category}
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="green.500">
                    {product.offerPrice || product.price} CUP
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.600">
            No hay productos nuevos disponibles
          </Text>
        </Box>
      )}
    </Box>
  )
}

// Componente de Lista de Deseados
const WishlistView = ({ onBack }) => {
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productDescription, setProductDescription] = useState("")
  const currentCart = useRecoilValue(cart)

  // Obtener cantidad en carrito
  const getCartQuantity = (product) => {
    if (!product || !currentCart[product.id]) return 0
    return currentCart[product.id].qty
  }

  useEffect(() => {
    try {
      const products = require("../../data").default || require("../../data")
      const savedWishlist = JSON.parse(localStorage.getItem("yero-wishlist") || "[]")
      const wishlistItems = products.filter((product) => savedWishlist.includes(product.id.toString()))
      setWishlistProducts(wishlistItems)
    } catch (error) {
      console.error("Error loading wishlist:", error)
      setWishlistProducts([])
    }
  }, [])

  // Cargar descripción del producto
  useEffect(() => {
    if (!selectedProduct) {
      setProductDescription("")
      return
    }

    const fetchProductDescription = async () => {
      try {
        // Intentar obtener descripción del producto directamente
        if (selectedProduct.description && typeof selectedProduct.description === "string") {
          setProductDescription(selectedProduct.description)
          return
        }

        // Intentar obtener de productDescriptions
        try {
          const productDescriptions =
            require("../../data/productDescriptions").default || require("../../data/productDescriptions")
          if (productDescriptions && typeof productDescriptions === "object") {
            const productId = selectedProduct.id.toString()
            if (productDescriptions[productId]) {
              const desc = productDescriptions[productId]
              if (typeof desc === "object" && desc.description) {
                setProductDescription(desc.description)
                return
              } else if (typeof desc === "string") {
                setProductDescription(desc)
                return
              }
            }
          }
        } catch (descError) {
          console.log("ProductDescriptions not available:", descError)
        }

        // Descripción por defecto si no se encuentra
        setProductDescription("Este producto no tiene descripción disponible.")
      } catch (error) {
        console.error("Error al obtener la descripción del producto:", error)
        setProductDescription("Este producto no tiene descripción disponible.")
      }
    }

    fetchProductDescription()
  }, [selectedProduct])

  const removeFromWishlist = (productId) => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("yero-wishlist") || "[]")
      const newWishlist = savedWishlist.filter((id) => id !== productId.toString())
      localStorage.setItem("yero-wishlist", JSON.stringify(newWishlist))

      const products = require("../../data").default || require("../../data")
      const wishlistItems = products.filter((product) => newWishlist.includes(product.id.toString()))
      setWishlistProducts(wishlistItems)

      // Notificación de eliminación
      const notification = document.createElement("div")
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ed8936, #dd6b20);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(237, 137, 54, 0.3);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 600;
        transform: translateX(400px);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      `

      const productTitle = products.find((p) => p.id.toString() === productId.toString())?.title || "Producto"
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px;">🗑️</span>
          <div>
            <div style="font-size: 14px; opacity: 0.9;">Eliminado de deseados</div>
            <div style="font-size: 12px; opacity: 0.7;">"${productTitle}"</div>
          </div>
        </div>
      `

      document.body.appendChild(notification)

      setTimeout(() => {
        if (notification && notification.style) {
          notification.style.transform = "translateX(0)"
        }
      }, 100)

      setTimeout(() => {
        if (notification && notification.style) {
          notification.style.transform = "translateX(400px)"
          setTimeout(() => {
            if (notification && notification.parentNode) {
              document.body.removeChild(notification)
            }
          }, 500)
        }
      }, 3000)
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  // Vista detallada del producto
  if (selectedProduct) {
    return (
      <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
        <PseudoBox
          as="button"
          onClick={() => setSelectedProduct(null)}
          mb={4}
          p={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          _hover={{ bg: "gray.100" }}
        >
          <Flex align="center">
            <Text mr={2}>←</Text>
            <Text>Volver a lista de deseados</Text>
          </Flex>
        </PseudoBox>

        {/* Imagen del producto */}
        <Box position="relative" width="100%" height="300px" bg="gray.100" borderRadius="md" mb={4} overflow="hidden">
          <img
            src={`/images/${selectedProduct.img}`}
            alt={selectedProduct.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "6px",
            }}
            onError={(e) => {
              e.target.src = "/images/productosinimagen.jpg"
            }}
          />

          {/* Badges */}
          <Flex position="absolute" top="10px" left="10px" direction="column" align="flex-start">
            <Text fontSize="xs" bg="blue.100" color="blue.700" px={2} py={1} borderRadius="full" mb={2}>
              {selectedProduct.category}
            </Text>
            {selectedProduct.offerPrice && (
              <Text fontSize="xs" bg="red.100" color="red.700" px={2} py={1} borderRadius="full">
                Promoción
              </Text>
            )}
          </Flex>
        </Box>

        {/* Información del producto */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={2}>
            {selectedProduct.title}
          </Text>

          {selectedProduct.title1 && (
            <Text fontSize="md" color="gray.600" mb={3}>
              {selectedProduct.title1}
            </Text>
          )}

          <Flex align="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {selectedProduct.offerPrice || selectedProduct.price} CUP
            </Text>
            {selectedProduct.offerPrice && (
              <Text ml="3" fontSize="md" as="del" color="gray.400">
                {selectedProduct.price} CUP
              </Text>
            )}
          </Flex>

          {/* Información adicional */}
          <Box bg="gray.50" p={4} borderRadius="md" mb={4}>
            <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={2}>
              Detalles del producto
            </Text>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                ID:
              </Text>
              <Text fontSize="sm" color="gray.800">
                {selectedProduct.id}
              </Text>
            </Flex>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                Categoría:
              </Text>
              <Text fontSize="sm" color="gray.800">
                {selectedProduct.category}
              </Text>
            </Flex>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                Subcategoría:
              </Text>
              <Text fontSize="sm" color="gray.800">
                {selectedProduct.subcategory}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Stock:
              </Text>
              <Text fontSize="sm" color="gray.800">
                {selectedProduct.stock} unidades
              </Text>
            </Flex>
          </Box>

          {/* Descripción */}
          <Box bg="gray.50" p={4} borderRadius="md" mb={4}>
            <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={2}>
              Descripción
            </Text>
            <Text fontSize="sm" color="gray.700" whiteSpace="pre-wrap">
              {productDescription}
            </Text>
          </Box>

          {/* Información de pago */}
          <Box
            bg={selectedProduct.allowBankTransfer !== false ? "green.50" : "red.50"}
            p={4}
            borderRadius="md"
            mb={4}
            border="1px solid"
            borderColor={selectedProduct.allowBankTransfer !== false ? "green.200" : "red.200"}
          >
            <Flex align="center">
              <Text fontSize="lg" mr={2}>
                {selectedProduct.allowBankTransfer !== false ? "✅" : "🚫"}
              </Text>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={selectedProduct.allowBankTransfer !== false ? "green.700" : "red.700"}
                >
                  {selectedProduct.allowBankTransfer !== false ? "Métodos de pago disponibles" : "Restricción de pago"}
                </Text>
                <Text fontSize="xs" color={selectedProduct.allowBankTransfer !== false ? "green.600" : "red.600"}>
                  {selectedProduct.allowBankTransfer !== false
                    ? "Este producto acepta pago en efectivo y transferencia bancaria"
                    : "Este producto solo puede pagarse en efectivo"}
                </Text>
              </Box>
            </Flex>
          </Box>

          {selectedProduct.dateAdded && (
            <Box bg="blue.50" p={4} borderRadius="md" mb={4} border="1px solid" borderColor="blue.200">
              <Flex align="center">
                <Text fontSize="lg" mr={2}>
                  📅
                </Text>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="blue.700">
                    Producto nuevo
                  </Text>
                  <Text fontSize="xs" color="blue.600">
                    Agregado el: {new Date(selectedProduct.dateAdded).toLocaleDateString("es-ES")}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {/* Botones de acción */}
          <Box mb={4}>
            {/* Botón para agregar al carrito */}
            <Box mb={3} w="100%" display="flex" justifyContent="center">
              <Box
                w="100%"
                minH={{ base: "48px", sm: "52px", md: "56px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CounterBtn
                  item={selectedProduct}
                  counter={getCartQuantity(selectedProduct)}
                  size="md"
                  style={{ width: "100%", display: "flex", justifyContent: "center" }}
                />
              </Box>
            </Box>

            {/* Botón para quitar de deseados */}
            <PseudoBox
              as="button"
              onClick={() => {
                removeFromWishlist(selectedProduct.id)
                setSelectedProduct(null) // Volver a la lista después de eliminar
              }}
              p={{ base: 3, sm: 3.5, md: 4 }}
              bg="red.500"
              color="white"
              borderRadius="lg"
              minH={{ base: "48px", sm: "52px", md: "56px" }}
              fontSize={{ base: "14px", sm: "15px", md: "16px" }}
              _hover={{
                bg: "red.600",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(229, 62, 62, 0.3)",
              }}
              _active={{
                transform: "translateY(0px)",
                boxShadow: "0 4px 15px rgba(229, 62, 62, 0.2)",
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              w="100%"
            >
              <Flex align="center" justify="center">
                <Text fontSize={{ base: "16px", sm: "17px", md: "18px" }} mr={2}>
                  🗑️
                </Text>
                <Text fontWeight="semibold">Quitar de Deseados</Text>
              </Flex>
            </PseudoBox>
          </Box>
        </Box>
      </Box>
    )
  }

  // Vista de lista de deseados
  return (
    <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
      <PseudoBox
        as="button"
        onClick={onBack}
        mb={4}
        p={2}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.100" }}
      >
        <Flex align="center">
          <Text mr={2}>←</Text>
          <Text>Volver al menú</Text>
        </Flex>
      </PseudoBox>

      {wishlistProducts.length > 0 ? (
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
            {wishlistProducts.length} producto{wishlistProducts.length !== 1 ? "s" : ""} en tu lista de deseados
          </Text>
          {wishlistProducts.map((product, index) => (
            <Box
              key={product.id}
              p={3}
              mb={3}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              shadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ shadow: "md", transform: "translateY(-1px)" }}
              onClick={() => setSelectedProduct(product)}
            >
              <Flex align="center" justify="space-between">
                <Flex align="center" flex="1">
                  <Text fontSize="sm" fontWeight="bold" color="blue.500" mr={3}>
                    #{index + 1}
                  </Text>
                  <Box w="60px" h="60px" mr={3} bg="gray.100" borderRadius="md" overflow="hidden">
                    <img
                      src={`/images/${product.img}`}
                      alt={product.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/images/productosinimagen.jpg"
                      }}
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="md" fontWeight="bold" color="gray.800" noOfLines={2}>
                      {product.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {product.category}
                    </Text>
                    <Flex align="center" mt={1}>
                      <Text fontSize="md" fontWeight="bold" color="green.500">
                        {product.offerPrice || product.price} CUP
                      </Text>
                      {product.offerPrice && (
                        <Text ml="2" fontSize="sm" as="del" color="gray.400">
                          {product.price} CUP
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </Flex>
                <PseudoBox
                  as="button"
                  onClick={(e) => {
                    e.stopPropagation() // Evitar que se abra el detalle
                    removeFromWishlist(product.id)
                  }}
                  color="red.500"
                  _hover={{ color: "red.600", bg: "red.50" }}
                  p={2}
                  borderRadius="md"
                  fontSize="18px"
                  transition="all 0.2s"
                >
                  ✕
                </PseudoBox>
              </Flex>
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="48px" mb={4}>
            ❤️
          </Text>
          <Text fontSize="lg" color="gray.600" mb={2}>
            Tu lista de deseados está vacía
          </Text>
          <Text fontSize="md" color="gray.500">
            Agrega productos a tu lista de deseados tocando el ❤️ en cualquier producto
          </Text>
        </Box>
      )}
    </Box>
  )
}

// Componente de Selector de Moneda
const CurrencyView = ({ onBack }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("CUP")
  const [enabledCurrencies, setEnabledCurrencies] = useState(["CUP"]) // Solo CUP habilitado por defecto
  const [isLoading, setIsLoading] = useState(false)

  const currencies = [
    {
      code: "CUP",
      name: "Peso Cubano",
      symbol: "$",
      flag: "🇨🇺",
      description: "Moneda oficial de Cuba",
      gradient: "linear-gradient(135deg, #48bb78, #38a169)",
      shadowColor: "rgba(72, 187, 120, 0.3)",
    },
    {
      code: "USD",
      name: "Dólar Estadounidense",
      symbol: "$",
      flag: "🇺🇸",
      description: "Dólar de Estados Unidos",
      gradient: "linear-gradient(135deg, #4299e1, #3182ce)",
      shadowColor: "rgba(66, 153, 225, 0.3)",
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      flag: "🇪🇺",
      description: "Moneda de la Unión Europea",
      gradient: "linear-gradient(135deg, #9f7aea, #805ad5)",
      shadowColor: "rgba(159, 122, 234, 0.3)",
    },
    {
      code: "MLC",
      name: "Moneda Libremente Convertible",
      symbol: "MLC",
      flag: "🏦",
      description: "Moneda digital cubana",
      gradient: "linear-gradient(135deg, #ed8936, #dd6b20)",
      shadowColor: "rgba(237, 137, 54, 0.3)",
    },
  ]

  // Cargar configuración guardada
  useEffect(() => {
    const savedCurrency = localStorage.getItem("yero-currency") || "CUP"
    const savedEnabledCurrencies = JSON.parse(localStorage.getItem("yero-enabled-currencies") || '["CUP"]')
    setSelectedCurrency(savedCurrency)
    setEnabledCurrencies(savedEnabledCurrencies)
  }, [])

  // Cambiar moneda con animación
  const handleCurrencyChange = async (currencyCode) => {
    if (!enabledCurrencies.includes(currencyCode)) return

    setIsLoading(true)

    // Simular un pequeño delay para la animación
    await new Promise((resolve) => setTimeout(resolve, 300))

    setSelectedCurrency(currencyCode)
    localStorage.setItem("yero-currency", currencyCode)

    // Mostrar notificación moderna y animada
    const currency = currencies.find((c) => c.code === currencyCode)
    const notification = document.createElement("div")
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${currency.gradient};
      color: white;
      padding: 20px 28px;
      border-radius: 16px;
      box-shadow: 0 20px 60px ${currency.shadowColor};
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 600;
      transform: translateX(400px) scale(0.8);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      animation: currencyPulse 0.8s ease-out;
    `

    // Agregar animación de pulso
    const pulseKeyframes = `
      @keyframes currencyPulse {
        0% { transform: translateX(400px) scale(0.8); }
        50% { transform: translateX(-10px) scale(1.05); }
        100% { transform: translateX(0) scale(1); }
      }
    `

    if (!document.querySelector("#currency-pulse-animation")) {
      const style = document.createElement("style")
      style.id = "currency-pulse-animation"
      style.textContent = pulseKeyframes
      document.head.appendChild(style)
    }

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="
          font-size: 32px; 
          animation: spin 2s linear infinite;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
        ">${currency.flag}</div>
        <div>
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">
            Moneda cambiada a ${currency.code}
          </div>
          <div style="font-size: 13px; opacity: 0.9;">
            ${currency.name}
          </div>
        </div>
      </div>
    `

    // Agregar animación de rotación para la bandera
    const spinKeyframes = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `

    if (!document.querySelector("#spin-animation")) {
      const style = document.createElement("style")
      style.id = "spin-animation"
      style.textContent = spinKeyframes
      document.head.appendChild(style)
    }

    document.body.appendChild(notification)

    // Animar entrada
    setTimeout(() => {
      if (notification && notification.style) {
        notification.style.transform = "translateX(0) scale(1)"
      }
    }, 100)

    // Animar salida y remover
    setTimeout(() => {
      if (notification && notification.style) {
        notification.style.transform = "translateX(400px) scale(0.8)"
        setTimeout(() => {
          if (notification && notification.parentNode) {
            document.body.removeChild(notification)
          }
        }, 600)
      }
    }, 4000)

    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(
      new CustomEvent("currencyChanged", {
        detail: { currency: currencyCode },
      }),
    )

    setIsLoading(false)
  }

  return (
    <Box p={6} maxH="calc(100vh - 120px)" overflowY="auto">
      <PseudoBox
        as="button"
        onClick={onBack}
        mb={6}
        p={3}
        borderRadius="lg"
        border="2px solid"
        borderColor="gray.300"
        _hover={{
          bg: "gray.100",
          borderColor: "gray.400",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <Flex align="center">
          <Text mr={2} fontSize="18px">
            ←
          </Text>
          <Text fontWeight="semibold">Volver al menú</Text>
        </Flex>
      </PseudoBox>

      {/* Header con animación */}
      <Box textAlign="center" mb={8}>
        <Box
          fontSize="64px"
          mb={4}
          style={{
            animation: "float 3s ease-in-out infinite",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
          }}
        >
          💰
        </Box>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={3}>
          Seleccionar Moneda
        </Text>
        <Text fontSize="md" color="gray.600" maxW="400px" mx="auto">
          Elige la moneda en la que quieres ver los precios. Solo las monedas habilitadas están disponibles.
        </Text>
      </Box>

      {/* Agregar animación float */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Lista de monedas */}
      <Box maxW="500px" mx="auto">
        {currencies.map((currency, index) => {
          const isEnabled = enabledCurrencies.includes(currency.code)
          const isSelected = selectedCurrency === currency.code

          return (
            <PseudoBox
              key={currency.code}
              as="button"
              onClick={() => handleCurrencyChange(currency.code)}
              p={5}
              mb={4}
              borderRadius="xl"
              border="3px solid"
              borderColor={isSelected ? "blue.400" : isEnabled ? "gray.200" : "gray.100"}
              bg={isSelected ? "blue.50" : isEnabled ? "white" : "gray.50"}
              opacity={isEnabled ? 1 : 0.5}
              cursor={isEnabled ? "pointer" : "not-allowed"}
              _hover={
                isEnabled
                  ? {
                      borderColor: isSelected ? "blue.500" : "blue.300",
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: `0 12px 40px ${currency.shadowColor}`,
                      bg: isSelected ? "blue.100" : "blue.50",
                    }
                  : {}
              }
              _active={
                isEnabled
                  ? {
                      transform: "translateY(-2px) scale(1.01)",
                    }
                  : {}
              }
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              w="100%"
              position="relative"
              overflow="hidden"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "slideInUp 0.6s ease-out forwards",
              }}
              _before={
                isSelected
                  ? {
                      content: '""',
                      position: "absolute",
                      top: "0",
                      left: "0",
                      right: "0",
                      bottom: "0",
                      background: currency.gradient,
                      opacity: "0.1",
                      borderRadius: "xl",
                    }
                  : {}
              }
            >
              <Flex align="center" w="100%" justify="space-between" position="relative" zIndex="1">
                <Flex align="center">
                  <Box
                    fontSize="40px"
                    mr={4}
                    style={{
                      animation: isSelected ? "bounce 1s ease-in-out infinite" : "none",
                      filter: isSelected ? "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))" : "none",
                    }}
                  >
                    {currency.flag}
                  </Box>
                  <Box textAlign="left">
                    <Flex align="center" mb={2}>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={isSelected ? "blue.700" : isEnabled ? "gray.800" : "gray.400"}
                        mr={3}
                      >
                        {currency.code}
                      </Text>
                      <Box
                        bg={isSelected ? currency.gradient : isEnabled ? "gray.100" : "gray.50"}
                        color={isSelected ? "white" : isEnabled ? "gray.600" : "gray.400"}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {currency.symbol}
                      </Box>
                    </Flex>
                    <Text
                      fontSize="lg"
                      color={isSelected ? "blue.600" : isEnabled ? "gray.700" : "gray.400"}
                      mb={1}
                      fontWeight="semibold"
                    >
                      {currency.name}
                    </Text>
                    <Text fontSize="sm" color={isSelected ? "blue.500" : isEnabled ? "gray.500" : "gray.400"}>
                      {currency.description}
                    </Text>
                    {!isEnabled && (
                      <Text fontSize="xs" color="red.500" mt={2} fontWeight="semibold">
                        🔒 No disponible - Requiere activación del administrador
                      </Text>
                    )}
                  </Box>
                </Flex>

                <Box>
                  {isSelected && (
                    <Box
                      bg={currency.gradient}
                      color="white"
                      p={3}
                      borderRadius="full"
                      fontSize="24px"
                      style={{
                        animation: "pulse 2s ease-in-out infinite",
                        boxShadow: `0 0 20px ${currency.shadowColor}`,
                      }}
                    >
                      ✓
                    </Box>
                  )}
                  {!isEnabled && isEnabled !== undefined && (
                    <Box bg="gray.300" color="gray.500" p={3} borderRadius="full" fontSize="20px">
                      🔒
                    </Box>
                  )}
                </Box>
              </Flex>
            </PseudoBox>
          )
        })}
      </Box>

      {/* Información adicional */}
      <Box
        mt={8}
        p={6}
        bg="blue.50"
        borderRadius="xl"
        borderLeft="6px solid"
        borderLeftColor="blue.500"
        maxW="500px"
        mx="auto"
      >
        <Flex align="center" mb={3}>
          <Text fontSize="24px" mr={3}>
            💡
          </Text>
          <Text fontSize="lg" color="blue.700" fontWeight="bold">
            Información importante
          </Text>
        </Flex>
        <Text fontSize="sm" color="blue.600" lineHeight="1.6">
          • Los precios se convertirán automáticamente según las tasas de cambio actuales
          <br />• La moneda seleccionada se guardará para futuras visitas
          <br />• Solo el administrador puede habilitar monedas adicionales
          <br />• CUP es la moneda base y siempre está disponible
        </Text>
      </Box>

      {/* Agregar animaciones CSS */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 20px ${currencies.find((c) => c.code === selectedCurrency)?.shadowColor || "rgba(59, 130, 246, 0.3)"};
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 30px ${currencies.find((c) => c.code === selectedCurrency)?.shadowColor || "rgba(59, 130, 246, 0.5)"};
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 20px ${currencies.find((c) => c.code === selectedCurrency)?.shadowColor || "rgba(59, 130, 246, 0.3)"};
          }
        }
      `}</style>

      {isLoading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="9999"
        >
          <Box bg="white" p={6} borderRadius="xl" textAlign="center" boxShadow="0 20px 60px rgba(0,0,0,0.3)">
            <Text fontSize="32px" mb={3} style={{ animation: "spin 1s linear infinite" }}>
              💰
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Cambiando moneda...
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  )
}

// Componente de Selector de Idioma
const LanguageView = ({ onBack }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("es")

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ]

  useEffect(() => {
    const savedLanguage = localStorage.getItem("yero-language") || "es"
    setSelectedLanguage(savedLanguage)
  }, [])

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem("yero-language", languageCode)
  }

  return (
    <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
      <PseudoBox
        as="button"
        onClick={onBack}
        mb={4}
        p={2}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.100" }}
      >
        <Flex align="center">
          <Text mr={2}>←</Text>
          <Text>Volver al menú</Text>
        </Flex>
      </PseudoBox>

      <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
        Seleccionar Idioma
      </Text>

      {languages.map((language) => (
        <PseudoBox
          key={language.code}
          as="button"
          onClick={() => handleLanguageChange(language.code)}
          p={4}
          mb={3}
          bg={selectedLanguage === language.code ? "blue.50" : "white"}
          border="2px solid"
          borderColor={selectedLanguage === language.code ? "blue.500" : "gray.200"}
          borderRadius="lg"
          _hover={{ borderColor: "blue.300" }}
          transition="all 0.2s"
          w="100%"
        >
          <Flex align="center">
            <Text fontSize="2xl" mr={3}>
              {language.flag}
            </Text>
            <Text fontSize="md" fontWeight="bold" color="gray.800">
              {language.name}
            </Text>
          </Flex>
        </PseudoBox>
      ))}
    </Box>
  )
}

// Componente de Panel Administrativo
const AdminLoginView = ({ onBack }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    if (username === "root" && password === "admin") {
      setIsAuthenticated(true)

      // Notificación de éxito moderna
      const notification = document.createElement("div")
      notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(72, 187, 120, 0.3);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 600;
      transform: translateX(400px);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `

      notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 20px;">✅</span>
        <div>
          <div style="font-size: 14px; opacity: 0.9;">Acceso concedido</div>
          <div style="font-size: 12px; opacity: 0.7;">Bienvenido al panel administrativo</div>
        </div>
      </div>
    `

      document.body.appendChild(notification)

      // Animar entrada
      setTimeout(() => {
        if (notification && notification.style) {
          notification.style.transform = "translateX(0)"
        }
      }, 100)

      // Animar salida y remover
      setTimeout(() => {
        if (notification && notification.style) {
          notification.style.transform = "translateX(400px)"
          setTimeout(() => {
            if (notification && notification.parentNode) {
              document.body.removeChild(notification)
            }
          }, 500)
        }
      }, 3000)
    } else {
      // Notificación de error moderna y animada
      const notification = document.createElement("div")
      notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(245, 101, 101, 0.4);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 600;
      transform: translateX(400px) scale(0.8);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: shake 0.5s ease-in-out;
    `

      // Agregar animación de shake
      const shakeKeyframes = `
      @keyframes shake {
        0%, 100% { transform: translateX(0) scale(1); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) scale(1.02); }
        20%, 40%, 60%, 80% { transform: translateX(5px) scale(1.02); }
      }
    `

      if (!document.querySelector("#shake-animation")) {
        const style = document.createElement("style")
        style.id = "shake-animation"
        style.textContent = shakeKeyframes
        document.head.appendChild(style)
      }

      notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 20px; animation: pulse 1s infinite;">🚫</span>
        <div>
          <div style="font-size: 14px; opacity: 0.9;">Acceso denegado</div>
          <div style="font-size: 12px; opacity: 0.7;">Usuario o contraseña incorrectos</div>
        </div>
      </div>
    `

      document.body.appendChild(notification)

      // Animar entrada
      setTimeout(() => {
        if (notification && notification.style) {
          notification.style.transform = "translateX(0) scale(1)"
        }
      }, 100)

      // Animar salida y remover
      setTimeout(() => {
        if (notification && notification.style) {
          notification.style.transform = "translateX(400px) scale(0.8)"
          setTimeout(() => {
            if (notification && notification.parentNode) {
              document.body.removeChild(notification)
            }
          }, 500)
        }
      }, 4000)

      // Limpiar campos después de error
      setTimeout(() => {
        setUsername("")
        setPassword("")
      }, 1000)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
  }

  if (isAuthenticated) {
    return (
      <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
        <PseudoBox
          as="button"
          onClick={onBack}
          mb={4}
          p={2}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          _hover={{ bg: "gray.100" }}
        >
          <Flex align="center">
            <Text mr={2}>←</Text>
            <Text>Volver al menú</Text>
          </Flex>
        </PseudoBox>

        <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
          Panel Administrativo
        </Text>
        <Text color="green.500" fontWeight="bold" mb={4}>
          ✅ Acceso autorizado
        </Text>

        <Box>
          <PseudoBox
            as="button"
            p={3}
            mb={2}
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <Text>Gestión de Productos</Text>
          </PseudoBox>
          <PseudoBox
            as="button"
            p={3}
            mb={2}
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <Text>Gestión de Inventario</Text>
          </PseudoBox>
          <PseudoBox
            as="button"
            p={3}
            mb={2}
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <Text>Pedidos y Ventas</Text>
          </PseudoBox>
          <PseudoBox
            as="button"
            p={3}
            mb={2}
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <Text>Configuración</Text>
          </PseudoBox>
          <PseudoBox
            as="button"
            p={3}
            mb={2}
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <Text>Reportes</Text>
          </PseudoBox>
          <PseudoBox
            as="button"
            p={3}
            mb={4}
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <Text>Usuarios</Text>
          </PseudoBox>
        </Box>

        <PseudoBox
          as="button"
          onClick={handleLogout}
          p={3}
          w="100%"
          bg="red.500"
          color="white"
          borderRadius="md"
          _hover={{ bg: "red.600" }}
        >
          <Text>Cerrar Sesión</Text>
        </PseudoBox>
      </Box>
    )
  }

  return (
    <Box p={4} maxH="calc(100vh - 120px)" overflowY="auto">
      <PseudoBox
        as="button"
        onClick={onBack}
        mb={4}
        p={2}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.100" }}
      >
        <Flex align="center">
          <Text mr={2}>←</Text>
          <Text>Volver al menú</Text>
        </Flex>
      </PseudoBox>

      <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
        Panel Administrativo
      </Text>
      <Text color="orange.500" mb={4}>
        🔒 Acceso restringido
      </Text>

      <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
        <Box mb={3}>
          <Text fontSize="sm" color="gray.800" mb={1}>
            Usuario:
          </Text>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </Box>

        <Box mb={3}>
          <Text fontSize="sm" color="gray.800" mb={1}>
            Contraseña:
          </Text>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </Box>

        <PseudoBox
          as="button"
          onClick={handleLogin}
          p={3}
          w="100%"
          bg={username && password ? "blue.500" : "gray.300"}
          color="white"
          borderRadius="md"
          _hover={{ bg: username && password ? "blue.600" : "gray.300" }}
          cursor={username && password ? "pointer" : "not-allowed"}
        >
          <Text>Iniciar Sesión</Text>
        </PseudoBox>
      </Box>
    </Box>
  )
}
;<PseudoBox
  as="button"
  p={3}
  mb={2}
  w="100%"
  border="1px solid"
  borderColor="gray.300"
  borderRadius="md"
  _hover={{ bg: "gray.100" }}
  onClick={() => {
    // Mostrar modal de gestión de monedas
    const enabledCurrencies = JSON.parse(localStorage.getItem("yero-enabled-currencies") || '["CUP"]')
    const allCurrencies = ["CUP", "USD", "EUR", "MLC"]

    const newEnabledCurrencies = [...enabledCurrencies]

    // Crear modal simple para activar/desactivar monedas
    const modal = document.createElement("div")
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `

    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">Gestión de Monedas</h3>
        <div id="currency-options">
          ${allCurrencies
            .map(
              (currency) => `
            <label style="
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              padding: 10px;
              border: 2px solid ${enabledCurrencies.includes(currency) ? "#3182ce" : "#e2e8f0"};
              border-radius: 8px;
              cursor: pointer;
              background: ${enabledCurrencies.includes(currency) ? "#ebf8ff" : "white"};
            ">
              <input 
                type="checkbox" 
                ${enabledCurrencies.includes(currency) ? "checked" : ""}
                ${currency === "CUP" ? "disabled" : ""}
                data-currency="${currency}"
                style="margin-right: 10px; transform: scale(1.2);"
              />
              <span style="font-weight: 600;">${currency}</span>
              ${currency === "CUP" ? '<span style="margin-left: auto; font-size: 12px; color: #718096;">(Siempre activo)</span>' : ""}
            </label>
          `,
            )
            .join("")}
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="save-currencies" style="
            flex: 1;
            padding: 12px;
            background: #3182ce;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
          ">Guardar</button>
          <button id="cancel-currencies" style="
            flex: 1;
            padding: 12px;
            background: #e2e8f0;
            color: #4a5568;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
          ">Cancelar</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Manejar guardado
    document.getElementById("save-currencies").onclick = () => {
      const checkboxes = modal.querySelectorAll('input[type="checkbox"]')
      const newEnabled = ["CUP"] // CUP siempre habilitado

      checkboxes.forEach((checkbox) => {
        if (checkbox.checked && checkbox.dataset.currency !== "CUP") {
          newEnabled.push(checkbox.dataset.currency)
        }
      })

      localStorage.setItem("yero-enabled-currencies", JSON.stringify(newEnabled))

      // Notificación de éxito
      const notification = document.createElement("div")
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #48bb78, #38a169);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(72, 187, 120, 0.3);
        z-index: 10001;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 600;
        transform: translateX(400px);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      `

      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px;">✅</span>
          <div>
            <div style="font-size: 14px;">Configuración guardada</div>
            <div style="font-size: 12px; opacity: 0.8;">Monedas actualizadas correctamente</div>
          </div>
        </div>
      `

      document.body.appendChild(notification)
      setTimeout(() => (notification.style.transform = "translateX(0)"), 100)
      setTimeout(() => {
        notification.style.transform = "translateX(400px)"
        setTimeout(() => document.body.removeChild(notification), 500)
      }, 3000)

      document.body.removeChild(modal)
    }

    // Manejar cancelación
    document.getElementById("cancel-currencies").onclick = () => {
      document.body.removeChild(modal)
    }

    // Cerrar al hacer clic fuera
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    }
  }}
>
  <Text>💰 Gestión de Monedas</Text>
</PseudoBox>

export default YeroMenu
