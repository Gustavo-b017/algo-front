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
        <Route path="/produto/:codigo" element={<Produto />} />
      </Routes>
    </div>
  );
}

export default App;