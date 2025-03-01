import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify"; //librería React-Toastify
import "react-toastify/dist/ReactToastify.css";
import { spiral } from "ldrs"; //spinner, librería midudev
// Registrar el componente spiral
spiral.register();

function useCart() {
  // VARIABLES
  const MAX_ITEMS = 10;
  const MIN_ITEMS = 1;

  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");

    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  // STATES
  // const[data] = useState(db); //state para db, no usado, estoy usando la api de strapi

  const [data, setData] = useState([]); //state para API

  const [cart, setCart] = useState(initialCart); //state para carrito de compras

  const [loading, setLoading] = useState(true); //state para el loader

  // useEffect para consultar API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cms-ecommerce-zr2f.onrender.com/api/products?populate[categories]=*&populate=images"
        ); //URL de la API
        if (!response.ok) throw new Error("Error al cargar los datos");
        const result = await response.json();
        setData(result.data); // guardar los datos de la API en el state
      } catch (error) {
        console.error("Error al obtener los productos: ", error);
      }
    };
    fetchData();
  }, []);
  //console.log(data)

  // guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart)); //guardar en localStorage
  }, [cart]);

  // Use Effect para el loader
  useEffect(() => {
    spiral.register();
  }, []);

  // Simulando carga de datos
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Datos cargados después de 1 segundo
    }, 2000);
  }, []);

  // Funciones

  //función addToCart para agregar al carrito los productos
  function addToCart(item) {
    const itemExists = cart.findIndex((product) => product.id === item.id); //compara el id del artículo que se busca con los ids de los productos ya en el carrito.
    if (itemExists >= 0) {
      //Si el artículo ya existe en el carrito
      if (cart[itemExists].quantity >= MAX_ITEMS) {
        toast.error(
          "Has alcanzado el límite de unidades permitidas para este producto",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        return;
      }
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      //si no existe en el carrito
      item.quantity = 1;
      setCart([...cart, item]); //el artículo se añade al carrito
    }

    toast.success(`${item.name} se agregó al carrito`, {
      position: "top-right",
      autoClose: 2000,
      theme: "light",
    });
  }

  //función eliminar elemento del carrito botón X
  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((product) => product.id !== id));
  }

  //función limpiar carrito entero
  function clearCart() {
    setCart([]);
  }

  //función incrementar cantidades del carrito
  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item, //devuelve el item entero como estaba para que no se modifique el estado entero sino solo esa cantidad
          quantity: item.quantity + 1,
        };
      } else {
        toast.error(
          "Has alcanzado el límite de unidades permitidas para este producto",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
      return item;
    });
    setCart(updatedCart);
  }

  //función decrementar cantidades del carrito
  function decreaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  //states derivados
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    loading,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
}
export default useCart;
