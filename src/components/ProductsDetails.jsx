
import { useParams, useNavigate  } from "react-router-dom";
import BackButton from "./BackButton";

function ProductsDetails({ data, addToCart }) {
  // Obtener el ID del producto desde la URL
  const { id } = useParams(); // Obtener el ID del producto desde la URL

    // Crear una instancia de navigate
    const navigate = useNavigate();

  // Buscar el producto correspondiente en la lista de productos
  const product = data.find((item) => item.id === parseInt(id));

  // Desestructurar los atributos del producto
  const { name, short_description, description, price, stock, images } = product;

  // Obtener la imagen del producto
  const productImage =
    images?.formats?.medium?.url || "No hay imagen disponible";




  return (
    <>
      <div className="container mt-5">
      <div className="row">
        {/* Imagen del producto */}
        <div className="col-md-6">
          <img src={productImage} alt={name} className="img-fluid" />
        </div>
        {/* Detalles del producto */}
        <div className="col-md-6">
          <h1 className="text-primary fw-bold fs-3">{name}</h1>
          <p>{short_description[0]?.children[0]?.text || "Sin descripción disponible."}</p>
          <p>{description[0]?.children[0]?.text || "Sin descripción disponible."}</p>
          <p className="fw-bold text-primary fs-3 mb-2">{price}€</p>
          {stock ? (
            <>
              <p className="stock fw-bold mb-2">¡Hay unidades disponibles!</p>
              <button
                type="button"
                className="btn btn-dark w-100"
                onClick={() => addToCart(product)}
              >
                Agregar al Carrito
              </button>
            </>
          ) : (
            <p className="agotado fw-bold">Agotado</p>
          )}
        </div>
      </div>

      <BackButton/>
    </div>
    </>
  );
}

export default ProductsDetails;
