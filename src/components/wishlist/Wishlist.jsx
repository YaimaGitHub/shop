"use client"

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  Flex,
  Image,
  Button,
  IconButton,
  Divider,
} from "@chakra-ui/core"
import { BiTrash, BiShoppingBag } from "react-icons/bi"
import { useRecoilState } from "recoil"
import { wishlistState, cartState } from "../../recoil/state"

export default function Wishlist({ showWishlist, setWishlist }) {
  const [wishlist, setWishlistState] = useRecoilState(wishlistState)
  const [cart, setCart] = useRecoilState(cartState)

  const removeFromWishlist = (itemId) => {
    setWishlistState(wishlist.filter((item) => item.id !== itemId))
  }

  const moveToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
    removeFromWishlist(item.id)
  }

  return (
    <Drawer isOpen={showWishlist} placement="right" onClose={() => setWishlist(false)} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Text fontSize="xl" fontWeight="bold">
            Lista de Deseos
          </Text>
          <Text fontSize="sm" color="gray.500">
            {wishlist.length} productos
          </Text>
        </DrawerHeader>

        <DrawerBody p="0">
          {wishlist.length === 0 ? (
            <Flex direction="column" align="center" justify="center" h="100%" p="8">
              <Text fontSize="lg" color="gray.500" mb="2">
                Tu lista de deseos está vacía
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Agrega productos que te gusten para encontrarlos fácilmente más tarde
              </Text>
            </Flex>
          ) : (
            <Box>
              {wishlist.map((item, index) => (
                <Box key={item.id}>
                  <Flex p="4" align="center">
                    <Image
                      src={`/images/${item.img}`}
                      fallbackSrc="/images/productosinimagen.jpg"
                      alt={item.title}
                      w="60px"
                      h="60px"
                      objectFit="cover"
                      borderRadius="md"
                      mr="3"
                    />

                    <Box flex="1" mr="3">
                      <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                        {item.title}
                      </Text>
                      <Text fontSize="sm" color="blue.500" fontWeight="bold">
                        {item.offerPrice || item.price} CUP
                      </Text>
                      {item.offerPrice && (
                        <Text fontSize="xs" as="del" color="gray.400">
                          {item.price} CUP
                        </Text>
                      )}
                    </Box>

                    <Flex direction="column" gap="2">
                      <IconButton
                        icon={BiShoppingBag}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => moveToCart(item)}
                        aria-label="Mover al carrito"
                      />
                      <IconButton
                        icon={BiTrash}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeFromWishlist(item.id)}
                        aria-label="Eliminar de lista de deseos"
                      />
                    </Flex>
                  </Flex>
                  {index < wishlist.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          )}
        </DrawerBody>

        {wishlist.length > 0 && (
          <DrawerFooter borderTopWidth="1px">
            <Button
              colorScheme="blue"
              w="100%"
              onClick={() => {
                wishlist.forEach((item) => moveToCart(item))
              }}
            >
              Mover todo al carrito
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
