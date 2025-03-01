

export default function Pagination() {
  return (
    <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {pageCount}
              </span>
              <button
                disabled={currentPage === pageCount}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente
              </button>
            </div>
  )
}
