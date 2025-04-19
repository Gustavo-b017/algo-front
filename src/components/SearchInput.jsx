
import React from "react";

function SearchInput({ searchTerm, setSearchTerm, showSuggestions, setShowSuggestions, suggestions, loadingSuggestions, wrapperRef, highlightMatch }) {
  return (
    <div className="col-md-6 position-relative" ref={wrapperRef}>
      <label className="form-label">Produto:</label>
      <div className="position-relative">
        <input
          type="text"
          className="form-control pe-5"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Digite para pesquisar..."
          onFocus={() => setShowSuggestions(true)}
        />
        <button
          className="btn btn-sm btn-light position-absolute top-0 end-0 mt-1 me-1"
          onClick={() => setShowSuggestions(prev => !prev)}
          title={showSuggestions ? 'Fechar sugestões' : 'Abrir sugestões'}
        >
          {showSuggestions ? '✕' : '☰'}
        </button>
      </div>

      {(showSuggestions && (searchTerm.trim() !== '' || suggestions.length > 0)) && (
        <div
          className="border position-absolute w-100 bg-white shadow-sm mt-1"
          style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1050 }}
        >
          {loadingSuggestions ? (
            <div className="p-2">Pesquisando...</div>
          ) : (
            <ul className="list-unstyled mb-0">
              {suggestions[0] === "Pesquisando..." ? (
                <li className="p-2 text-muted">{suggestions[0]}</li>
              ) : (
                suggestions.map((sug, i) => {
                  const label = sug.data?.nomeProduto || sug.nome || sug;
                  return (
                    <li
                      key={i}
                      className="autocomplete-item px-3 py-2 border-bottom"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSearchTerm(label);
                        setShowSuggestions(false);
                      }}
                      dangerouslySetInnerHTML={{ __html: highlightMatch(label, searchTerm) }}
                    />
                  );
                })
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
