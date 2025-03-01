// src/hooks/usePagination.js
import { useState, useMemo } from "react";

const usePagination = (data, pageSize) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular el número total de páginas
  const pageCount = useMemo(() => Math.ceil(data.length / pageSize), [data, pageSize]);

  // Función que obtiene los productos para la página actual
  const paginate = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  // Cambiar la página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    pageCount,
    paginate,
    handlePageChange,
  };
};

export default usePagination;
