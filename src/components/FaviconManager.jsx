"use client"

import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import { cartState } from "../recoil/state"
import useFavicon from "../hooks/useFavicon"

const FaviconManager = () => {
  const cart = useRecoilValue(cartState)
  const { setFaviconWithBadge, resetFavicon } = useFavicon()

  useEffect(() => {
    if (cart && cart.length > 0) {
      // Calcular total de items en el carrito
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

      // Mostrar badge con el número de items
      setFaviconWithBadge({
        badgeText: totalItems.toString(),
        badgeColor: "#10b981",
        backgroundColor: "#4299e1",
        textColor: "#ffffff",
      })
    } else {
      // Restaurar favicon original si no hay items
      resetFavicon()
    }
  }, [cart, setFaviconWithBadge, resetFavicon])

  return null // Este componente no renderiza nada
}

export default FaviconManager
