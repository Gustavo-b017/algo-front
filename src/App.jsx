import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Paginas/Home.jsx';
import Produto from './Paginas/Produto.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Resultados from './Paginas/Resultados.jsx';
import Carrinho from './Paginas/Carrinho.jsx';
import Cadastro from './Paginas/Cadastro.jsx';
import Login from './Paginas/Login.jsx';
import Perfil from './Paginas/Perfil.jsx';
import RequireAuth from "./Componentes/RequireAuth.jsx";
import "./index.scss";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        
        {/* Proteja a rota do carrinho */}
        <Route
          path="/carrinho"
          element={
            <RequireAuth>
              <Carrinho />
            </RequireAuth>
          }
        />

        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <Perfil />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;