
import React, { useState, useEffect } from "react";

function HeapResults({ produto, marca }) {
  const [modo, setModo] = useState("maior");
  const [criterio, setCriterio] = useState("potencia");
  const [k, setK] = useState(5);
  const [heapResults, setHeapResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!produto || !marca) return;
    setLoading(true);
    const url = `/heap?produto=${encodeURIComponent(produto)}&marca=${encodeURIComponent(marca)}&k=${k}&criterio=${criterio}&modo=${modo}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setHeapResults(data);
        setLoading(false);
      })
      .catch(() => setHeapResults([]));
  }, [produto, marca, k, criterio, modo]);

  return (
    <div className="mt-3">
      <div className="d-flex gap-2 align-items-end">
        <select value={criterio} onChange={e => setCriterio(e.target.value)} className="form-select w-auto">
          <option value="potencia">Potência</option>
          <option value="ano">Ano</option>
        </select>
        <select value={modo} onChange={e => setModo(e.target.value)} className="form-select w-auto">
          <option value="maior">Maiores</option>
          <option value="menor">Menores</option>
        </select>
        <input type="number" min="1" max="50" className="form-control w-auto" value={k} onChange={e => setK(Number(e.target.value))} />
      </div>
      {loading ? <p>Carregando...</p> : (
        <ul className="list-group mt-3">
          {heapResults.map((item, idx) => (
            <li key={idx} className="list-group-item">
              {item.nome} — {criterio === "potencia" ? item.potencia : item.ano}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HeapResults;
