import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Paginas/Home.jsx';
import Produto from './Paginas/Produto.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Correção: a rota agora é apenas "/produto" */}
        <Route path="/produto" element={<Produto />} />
      </Routes>
    </div>
  );
}

export default App;