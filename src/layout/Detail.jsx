import { useEffect, useState } from "react";
import { getDetailProduct } from "../services/productService";
import { useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.data);

  useEffect(() => {
    const fetchProduct = async (id) => {
      try {
        const data = await getDetailProduct(id);
        setProduct(data);
        setIsLoading(false);
      } catch (error) {
        console.log("Failed to fetch product:", error);
        setIsLoading(false);
      }
    };

    fetchProduct(id);
  }, [id]);

  document.title = `TokoKu - ${product.title}`;
  console.log(product);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ id: product.id, qty: 1 }));
    Swal.fire({
      icon: "success",
      title: "Añadido al carrito con éxito!",
      text: "Gracias por comprar con nosotros!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const handleAddToWishlist = (product) => {
    if (isWishlisted(product.id)) {
      dispatch(removeFromWishlist({ id: product.id }));
    } else {
      dispatch(addToWishlist({ id: product.id }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl mt-20 mb-5 lg:mt-14">
        {isLoading ? (
          <div className="flex flex-col lg:flex-row justify-center items-center gap-x-10 w-[90%] mx-auto">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-center items-center gap-x-10 w-[90%] mx-auto">
            <div className="w-full md:w-1/3 mb-10 lg:mb-0">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full max-h-[300px] sm:max-h-[400px] md:max-h-[400px] lg:max-h-[400px] object-contain"
                />
              )}
            </div>
            <div className="w-full md:w-2/3">
              {product.title && (
                <h2 className="text-xl sm:text-xl md:text-2xl lg-text-3xl font-bold">
                  {product.title}
                </h2>
              )}
              {product.category && (
                <p className="text-slate-500 font-medium">
                  {capitalizeFirstLetter(product.category)}
                </p>
              )}

              {product.rating && (
                <div className="flex items-center gap-x-2 mb-4">
                  <Rating
                    defaultValue={product.rating.rate}
                    precision={0.5}
                    size="medium"
                    readOnly
                  />
                  <p className="font-semibold text-base opacity-70">
                    {product.rating.count} Reseñas
                  </p>
                </div>
              )}

              <div className="flex mt-2 gap-x-5 items-center">
                <p className="text-3xl lg:text-4xl font-bold">
                  ${product.price}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="font-semibold bg-green-700 text-white py-2 px-3 text-sm rounded-lg hover:bg-green-800 duration-300 ease-linear"
                >
                  <FontAwesomeIcon icon={faCartPlus} className="me-2" />
                  Añadir al carrito
                </button>
              </div>
              <button
                onClick={() => handleAddToWishlist(product)}
                className="font-semibold mt-2 sm:mt-0 text-red-500 py-2 px-1 text-sm rounded-lg hover:text-red-700 duration-300 ease-linear"
              >
                <FontAwesomeIcon
                  icon={isWishlisted(product.id) ? faHeart : farHeart}
                  className="me-2"
                />
                {isWishlisted(product.id)
                  ? "Eliminar de la lista de deseos"
                  : "Añadir a la lista de deseos"}
              </button>

              <p className="text-sm mt-2">{product.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailProduct;
