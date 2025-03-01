
import { Link } from "react-router-dom";

function Products({ product, addToCart}) {
  const { id, name, short_description, price, stock, images, categories } = product;

  // Obtener URL de la imagen, con fallback si no existe
  const productImage = images?.formats?.thumbnail?.url || "No existe imagen";

  return (
    <div className="col-md-6 col-lg-4 my-4" id="box">

      <Link to={`/product/${id}`} className="text-decoration-none">
      <div className="d-flex align-items-center p-3 border rounded shadow-sm h-100">
        {/* Imagen del producto */}
        <div className="col-4">
          <img
            className="img-fluid"
            src={productImage}
            alt="imagen producto"
          />
        </div>

        {/* Detalles del producto */}
        <div className="col-8 ps-3">
          <h3 className="text-black fs-5 fw-bold text-uppercase mb-2">{name}</h3>
          <p className="text-muted mb-1">
            {short_description[0]?.children[0]?.text || "Sin descripción"}
          </p>
          <p className="fw-bold text-primary fs-3 mb-2">{price}€</p>

          {/* Mostrar Categorías asociadas al producto */}

          {categories && (
            <div className="category-badge mb-2">
              <span className='category-badge empty'>{categories?.name}</span>
            </div>
          )}

          </div>
      </div>
      </Link>

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
  );
}

export default Products;
