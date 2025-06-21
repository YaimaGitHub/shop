"use client"

import { useState } from "react"
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  useColorMode,
  useToast,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/core"
import { BiLock, BiUser, BiArrowBack, BiShow, BiHide } from "react-icons/bi"

const AdminLoginView = ({ onBack }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { colorMode } = useColorMode()
  const toast = useToast()

  // Colores basados en el tema
  const textColor = colorMode === "light" ? "gray.800" : "white"
  const bgColor = colorMode === "light" ? "white" : "gray.800"

  // Credenciales de administrador
  const ADMIN_CREDENTIALS = {
    username: "root",
    password: "admin",
  }

  // Manejar login
  const handleLogin = async () => {
    setIsLoading(true)

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al panel administrativo",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: "Acceso denegado",
        description: "Usuario o contraseña incorrectos",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }

    setIsLoading(false)
  }

  // Manejar logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel administrativo",
      status: "info",
      duration: 2000,
      isClosable: true,
    })
  }

  // Opciones del panel administrativo
  const adminOptions = [
    {
      title: "Gestión de Productos",
      description: "Agregar, editar y eliminar productos",
      action: () => toast({ title: "Función en desarrollo", status: "info" }),
    },
    {
      title: "Gestión de Inventario",
      description: "Control de stock y existencias",
      action: () => toast({ title: "Función en desarrollo", status: "info" }),
    },
    {
      title: "Pedidos y Ventas",
      description: "Ver y gestionar pedidos de clientes",
      action: () => toast({ title: "Función en desarrollo", status: "info" }),
    },
    {
      title: "Configuración de la Tienda",
      description: "Ajustes generales y personalización",
      action: () => toast({ title: "Función en desarrollo", status: "info" }),
    },
    {
      title: "Reportes y Estadísticas",
      description: "Análisis de ventas y rendimiento",
      action: () => toast({ title: "Función en desarrollo", status: "info" }),
    },
    {
      title: "Gestión de Usuarios",
      description: "Administrar cuentas de usuarios",
      action: () => toast({ title: "Función en desarrollo", status: "info" }),
    },
  ]

  if (isAuthenticated) {
    return (
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center" mb={4}>
            <Box as={BiLock} size="48px" color="green.500" mx="auto" mb={3} />
            <Text fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
              Panel Administrativo
            </Text>
            <Text fontSize="md" color="gray.500">
              Bienvenido, administrador
            </Text>
          </Box>

          <Alert status="success" borderRadius="lg">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Acceso autorizado</Text>
              <Text fontSize="sm">Tienes acceso completo al panel administrativo</Text>
            </Box>
          </Alert>

          <VStack spacing={3} align="stretch">
            {adminOptions.map((option, index) => (
              <Button
                key={index}
                onClick={option.action}
                variant="outline"
                justifyContent="flex-start"
                h="auto"
                p={4}
                _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.700" }}
                borderRadius="lg"
                transition="all 0.2s"
              >
                <Box textAlign="left" w="100%">
                  <Text fontSize="md" fontWeight="bold" color={textColor} mb={1}>
                    {option.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {option.description}
                  </Text>
                </Box>
              </Button>
            ))}
          </VStack>

          <VStack spacing={3} mt={6}>
            <Button onClick={handleLogout} variant="outline" variantColor="red" size="lg" w="100%">
              Cerrar Sesión
            </Button>

            <Button onClick={onBack} size="lg" w="100%" variant="outline">
              <BiArrowBack style={{ marginRight: "8px" }} />
              Volver al menú principal
            </Button>
          </VStack>
        </VStack>
      </Box>
    )
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb={4}>
          <Box as={BiLock} size="48px" color="red.500" mx="auto" mb={3} />
          <Text fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
            Panel Administrativo
          </Text>
          <Text fontSize="md" color="gray.500">
            Acceso restringido - Credenciales requeridas
          </Text>
        </Box>

        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Área restringida</Text>
            <Text fontSize="sm">Solo personal autorizado puede acceder</Text>
          </Box>
        </Alert>

        <Box bg={bgColor} p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color={textColor}>Usuario</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg={colorMode === "light" ? "white" : "gray.700"}
                />
                <InputRightElement>
                  <Box as={BiUser} color="gray.400" />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg={colorMode === "light" ? "white" : "gray.700"}
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <BiHide /> : <BiShow />}
                  </IconButton>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              onClick={handleLogin}
              variantColor="blue"
              size="lg"
              w="100%"
              isLoading={isLoading}
              loadingText="Verificando..."
              isDisabled={!username || !password}
            >
              Iniciar Sesión
            </Button>
          </VStack>
        </Box>

        <Box p={4} bg="gray.50" borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.500">
          <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={2}>
            💡 Credenciales de prueba:
          </Text>
          <Text fontSize="sm" color="blue.600">
            <strong>Usuario:</strong> root
            <br />
            <strong>Contraseña:</strong> admin
          </Text>
        </Box>

        <Button onClick={onBack} size="lg" variant="outline">
          <BiArrowBack style={{ marginRight: "8px" }} />
          Volver al menú principal
        </Button>
      </VStack>
    </Box>
  )
}

export default AdminLoginView
