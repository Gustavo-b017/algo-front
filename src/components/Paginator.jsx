
import React from "react";

function Paginator({ currentPage, setCurrentPage, total, porPagina }) {
  const totalPages = Math.ceil(total / porPagina);

  return (
    <div className="mt-3 d-flex align-items-center gap-2">
      <button className="btn btn-secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
        Anterior
      </button>
      <span>Página {currentPage} de {totalPages}</span>
      <button className="btn btn-secondary" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>
        Próxima
      </button>
    </div>
  );
}

export default Paginator;
