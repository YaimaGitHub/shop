import { useRecoilValue } from "recoil"
import { wishlistState } from "../recoil/state"

export default function useIsInWishlist(item) {
  const wishlist = useRecoilValue(wishlistState)
  return wishlist.some((wishItem) => wishItem.id === item.id)
}
