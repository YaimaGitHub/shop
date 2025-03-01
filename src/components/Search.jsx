import { useState, useEffect} from "react";


export default function Search({ setFilter, filter }) {
  
  // State para almacenar las categorias obtenidas de la API
  const[categories, setCategories] = useState([]);

  // useEffect para llamar a la API y obtener categorias
useEffect(() => {
  const fetchCategories = async () => {
    try{
      const response = await fetch("https://cms-ecommerce-zr2f.onrender.com/api/categories");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
        setCategories(result.data); // guardar los datos de la API en el state
      } catch (error){
      console.error("Error fetching categories:", error)
    }
  };
  fetchCategories()
}, []);



    // Actualizamos el estado del filtro en el componente principal
    const handleFilterChange = (e) => {
        setFilter(e.target.value); // Llamamos a la función que nos pasa App
      };

  
  return (
    <div className="custom-select-wrapper">
      <select
        onChange={handleFilterChange}
        value={filter}
        className="custom-select"
        aria-label="Filter Products By Category"
      >
        <option value="All">Filter By Category</option>
        {categories.map((category) => (
          <option 
          key={category.id} 
          value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <span className="focus"></span>
    </div>
  );
}
