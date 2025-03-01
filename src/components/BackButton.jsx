
import React from "react";
import { useParams, useNavigate  } from "react-router-dom";

function BackButton({ data, addToCart }) {
    // Crear una instancia de navigate
    const navigate = useNavigate();




  return (
    <>
      <div className="mt-4">
          <button
            type="button"
            className="btn backButton"
            onClick={() => navigate(-1)} // Navegar hacia atrás
          >
            ← Back
          </button>
        </div>
       
    </>
  );
}

export default BackButton;

