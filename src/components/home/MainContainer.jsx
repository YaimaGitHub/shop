import { Box, Flex, Text, Button } from "@chakra-ui/core"
import Banner from "./Banner"
import ItemsGrid from "./ItemsGrid"
import OBreadcrumb from "../others/OBreadcrumb"
import Sort from "../others/Sort"
import SubcategoryMenu from "./SubcategoryMenu"
import SubcategoryCarousel from "./SubcategoryCarousel"
import { BiTime } from "react-icons/bi"
import RecentProductsModal from "../others/RecentProductsModal"

function MainContainer({ showSidebar, recentCount }) {
  return (
    <Box
      as="main"
      ml={showSidebar ? ["auto", "auto", "280px"] : ["auto", "auto", "0"]}
      mr={["auto", "auto", "0"]}
      w={showSidebar ? ["90%", "90%", "calc(100% - 280px)"] : ["90%", "85%", "100%"]}
      bg="gray.100"
      minHeight="calc(100vh - 99px)"
      p={["3", "5"]}
      transition="all .3s ease"
    >
      <Banner />

      {recentCount > 0 && (
        <Box bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="md" p={3} mt={4} position="relative">
          <Flex align="center" justify="space-between">
            <Flex align="center">
              <Box as={BiTime} size="16px" color="blue.500" mr={2} />
              <Text fontSize="sm" color="blue.700">
                {recentCount} productos agregados recientemente
              </Text>
            </Flex>
            <RecentProductsModal recentCount={recentCount}>
              <Button size="sm" variant="outline" colorScheme="blue">
                Ver todos
              </Button>
            </RecentProductsModal>
          </Flex>
        </Box>
      )}

      <Flex justify="space-between" align="center" w="100%" mt="8">
        <OBreadcrumb />
        <Sort />
      </Flex>

      {/* Desktop subcategory menu */}
      <Box display={{ base: "none", md: "block" }}>
        <SubcategoryMenu />
      </Box>

      {/* Mobile/tablet subcategory carousel */}
      <SubcategoryCarousel />

      <ItemsGrid />
    </Box>
  )
}

export default MainContainer
