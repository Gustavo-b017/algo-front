// main.jsx / index.jsx
// -----------------------------------------------------------------------------
// Ponto de boot da aplicação React.
// - Envolve a SPA com BrowserRouter (roteamento no cliente).
// - Injeta o contexto de autenticação via <AuthProvider/> (estado global de auth).
// - Usa React.StrictMode apenas em desenvolvimento para destacar efeitos colaterais.
//   Observação: no modo dev, StrictMode dispara certos efeitos duas vezes de propósito,
//   sem impacto em produção, a fim de revelar problemas de idempotência.
// -----------------------------------------------------------------------------
//
// Diretrizes de manutenção:
// - Não inserir lógicas de negócio aqui. Este arquivo deve apenas montar a árvore
//   raiz e provedores globais (router, contextos, themas).
// - Se precisar configurar "basename" no BrowserRouter (ex.: app em /subpasta),
//   faça-o aqui: <BrowserRouter basename="/minha-base">.
// - Provedores adicionais (ex.: QueryClientProvider, ThemeProvider) devem envolver <App />
//   mantendo a ordem: Router (mais externo) → Providers globais → <App />.
// -----------------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/auth-context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Roteamento de página única (SPA) baseado em History API */}
    <BrowserRouter>
      {/* Contexto global de autenticação (JWT, usuário, guards) */}
      <AuthProvider>
        {/* Árvore principal de páginas/rotas e UI */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
