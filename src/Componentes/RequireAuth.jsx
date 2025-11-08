// src/Componentes/RequireAuth.jsx
// ============================================================================
// Componente: RequireAuth
// ----------------------------------------------------------------------------
// Objetivo
// - Proteger rotas que exigem usuário autenticado. Caso não haja sessão válida,
//   redireciona para /login preservando a rota de origem para retorno pós-login.
//
// Diretrizes arquiteturais (em linha com o back)
// - Responsabilidade única (SRP): apenas guarda de rota (nenhuma chamada de API).
// - Contrato claro: depende do AuthContext (`user` e `ready`) para decidir acesso.
// - UX previsível: evita “piscar” de conteúdo com o flag `ready` antes de renderizar.
// - Segurança: reforçar no servidor as mesmas restrições; este guard é apenas na UI.
// - Extensibilidade: pode evoluir para checar “roles/claims” sem quebrar rotas.
// - Observabilidade: comportamento determinístico (sem logs/efeitos colaterais).
//
// Fluxo
// 1) Enquanto o estado de autenticação ainda está carregando (`ready === false`),
//    renderiza `null` para evitar mostrar conteúdo indevido por milissegundos.
// 2) Com `ready === true`:
//    - Se `user` existir, permite o acesso renderizando `children`.
//    - Caso contrário, faz `<Navigate to="/login">`, incluindo `state.from` com a
//      localização atual, permitindo redirecionar de volta após autenticar.
//
// Contratos de integração
// - AuthProvider deve expor `user` (objeto do usuário ou null) e `ready` (boolean).
// - A página /login deve ler `location.state?.from` e, após sucesso, redirecionar
//   para `from` ou fallback (ex.: /perfil).
//
// Boas práticas e testes
// - Teste cenários: (a) sem token, (b) com token inválido (401), (c) com token válido.
// - Em testes de UI, simule `ready`/`user` via mock do contexto.
// - Se necessário skeleton, substitua `return null` por um placeholder/skeleton,
//   mantendo a verificação `!ready`.
//
// Observação
// - Não altera a URL original antes do login; `replace` evita sujar o histórico.
// ============================================================================

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();

  if (!ready) return null;                   // Evita “flash” antes de saber o estado real
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;

  return children;                           // Autenticado: libera o conteúdo protegido
}
