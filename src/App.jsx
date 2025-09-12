import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Paginas/Home.jsx';
import Produto from './Paginas/Produto.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Resultados from './Paginas/Resultados.jsx';
import Carrinho from './Paginas/Carrinho.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/produto" element={<Produto />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/carrinho" element={<Carrinho />} />
      </Routes>
    </div>
  );
}

export default App;