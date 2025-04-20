
import React from "react";

function ResultsTable({ resultados }) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Marca</th>
            <th className="py-2 px-4 border-b">Montadora</th>
            <th className="py-2 px-4 border-b">Carroceria</th>
            <th className="py-2 px-4 border-b">Ano</th>
            <th className="py-2 px-4 border-b">Potência</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b">{item.nome}</td>
              <td className="py-2 px-4 border-b">{item.marca}</td>
              <td className="py-2 px-4 border-b">{item.montadora}</td>
              <td className="py-2 px-4 border-b">{item.carroceria}</td>
              <td className="py-2 px-4 border-b">{item.ano}</td>
              <td className="py-2 px-4 border-b">{item.potencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
