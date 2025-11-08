// App.jsx
// -----------------------------------------------------------------------------
// Ponto de entrada de rotas do front-end (SPA) com React Router.
// Mantém a navegação entre páginas e aplica o guardião de autenticação
// (RequireAuth) nas rotas que exigem usuário logado.
//
// Diretrizes de manutenção (sem alterar lógica):
// - Comentários claros nos imports e nas rotas para orientar novos devs.
// - Manter as rotas públicas vs. privadas explícitas.
// - Evitar side effects neste arquivo; centralizar lógica em contexts/hooks.
// - SCSS/CSS globais importados aqui por convenção de "root styles".
//
// Observações:
// - useAuth: a leitura de { loginAlert } ajuda a inicializar o contexto de
//   autenticação e pode disparar toasts/banners em outros pontos do app.
// - AuthRequiredToast: importado para uso futuro de notificação global ao
//   tentar acessar rotas privadas. Avaliar renderização no topo do App
//   (ex.: <AuthRequiredToast />) se desejar exibir toasts globais.
//
// Rotas privadas atuais:
// - /carrinho, /perfil (exigem JWT/session via RequireAuth).
//
// Rotas públicas atuais:
// - /, /produto, /resultados, /cadastro, /login, /suporte.
//
// Futuras melhorias sugeridas (não implementadas aqui para preservar o original):
// - Adicionar rota 404 (fallback) para caminhos inexistentes.
// - Criar um layout base (header/footer) para reduzir duplicação entre páginas.
// -----------------------------------------------------------------------------

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Páginas principais
import Home from './Paginas/Home.jsx';
import Produto from './Paginas/Produto.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Resultados from './Paginas/Resultados.jsx';
import Carrinho from './Paginas/Carrinho.jsx';
import Cadastro from './Paginas/Cadastro.jsx';
import Login from './Paginas/Login.jsx';
import Perfil from './Paginas/Perfil.jsx';
import Suporte from './Paginas/Suporte.jsx';

// Guardião de rotas privadas (exige usuário autenticado)
import RequireAuth from "./Componentes/RequireAuth.jsx";

// Estilos globais
import "./index.scss";
import "/public/style/notificacoes.scss";
import "/public/style/starRating.scss";

// Contexto de autenticação (inicializa estado e utilitários de login)
import { useAuth } from './contexts/auth-context'; // Mantido: side effects/estado do auth

// Componente de notificação para tentativas de acesso não autenticadas
import AuthRequiredToast from './Componentes/AuthRequiredToast'; // Mantido para uso futuro

function App() {
  // Acesso ao contexto de autenticação.
  // Nota: loginAlert pode ser utilizado por toasts/banners em outros pontos.
  const { loginAlert } = useAuth();

  return (
    <div>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/suporte" element={<Suporte />} />

        {/* Rotas privadas (protegidas por RequireAuth) */}
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

      {/* Sugestão (não renderizado para preservar o original):
          Montar o componente abaixo para exibir toasts globais de "login requerido".
          <AuthRequiredToast />
      */}
    </div>
  );
}

export default App;
