import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import ProductsDetails from "./components/ProductsDetails";
import Header from "./components/Header";
import Products from "./components/Products";
import Search from "./components/Search";
import useCart from "./hooks/useCart"; // mi hook useCart
import usePagination from "./hooks/usePagination"; // mi hook usePagination

import { ToastContainer } from "react-toastify"; //librería React-Toastify
import "react-toastify/dist/ReactToastify.css";




function App() {
  const {
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
  } = useCart();

  // State para el filtro
  const [filter, setFilter] = useState("All");


  // Filtramos los productos según la categoría seleccionada
  const filteredProducts =
    filter === "All"
      ? data // si el filtro es All mostramos todos los productos
      : data.filter((item) => 
        item.categories.name  === filter); // Filtramos según la categoría

// Usamos el hook usePagination con los productos filtrados
const pageSize = 6;
const { currentPage, pageCount, paginate, handlePageChange } = usePagination(filteredProducts, pageSize);

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        isEmpty={isEmpty}
        cartTotal={cartTotal}
      />
     
      <main className="container-xl mt-5">
        <h3 className="text-center">Nuestra Colección</h3>
        <div className="row g-3">
          <Search 
          setFilter={setFilter} 
          filter={filter}/> {/* Pasamos la función setFilter */}
          <Routes>
            {/* Ruta para el listado de productos */}
            <Route
              path="/"
              element={
                loading ? (
                  <div className="d-flex justify-content-center my-5">
                    <l-spiral size="40" speed="0.9" color="#22A39F"></l-spiral>
                  </div>
                ) : (
                  <>
              {/* Mostrar los productos filtrados y paginados */}
              {paginate.map((item) => (
                <Products className="col" key={item.id} product={item} addToCart={addToCart} />
              ))}
              {/* Paginación */}
              
              <div className="pagination mt-5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
                <span>
                  Pág {currentPage} de {pageCount}
                </span>
                <button
                  disabled={currentPage === pageCount}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            </>
                  )
              }
            />
            
            {/* Ruta para los detalles del producto */}
            <Route
              path="/product/:id"
              element={<ProductsDetails data={data} addToCart={addToCart} />}
            />
          </Routes>
          <ToastContainer />

      
        </div>
      </main>
      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            Todos los derechos reservados © Laura Castaño
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
