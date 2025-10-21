// src/lib/api.js
import axios from "axios";

/**
 * Normalização da base:
 * - VITE_API_URL pode vir com / ou até com /health no final.
 * - Removemos sufixos e barras duplicadas para evitar 404/500 e "falso CORS".
 */
const RAW_BASE = import.meta.env.VITE_API_URL?.trim() ?? "";
const BASE_NO_TRAIL = RAW_BASE.replace(/\/+$/, "");
const ROOT_BASE = BASE_NO_TRAIL.replace(/\/health$/i, ""); // raiz (sem /health)

function buildUrl(path = "") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ROOT_BASE}${p}`;
}

// ---- token helpers ---------------------------------------------------------
const TOKEN_KEY = "access_token";

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function clearToken() {
  setToken(null);
}

// ---- axios instance ---------------------------------------------------------
export const api = axios.create({
  baseURL: ROOT_BASE,
  timeout: 20000,
  withCredentials: false, // usamos Bearer token; não há cookies
  headers: { "Content-Type": "application/json" },
});

console.info("[API] baseURL normalizada:", ROOT_BASE);

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Se não veio response, é erro de rede/timeout/CORS sintomático.
    if (!err?.response) {
      err.message =
        "Erro de rede ou servidor indisponível. Verifique a API/Internet (pré-flight/CORS pode falhar quando o servidor responde 500).";
      return Promise.reject(err);
    }

    const { status, config } = err.response;

    // Evita redirecionar no fluxo de auth
    const isAuthRoute =
      config?.url?.includes("/auth/login") || config?.url?.includes("/auth/register");

    if (status === 401 && !isAuthRoute) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);

// ---- utilitário para sempre devolver .data ou lançar erro claro ------------
async function unwrap(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    // padroniza mensagem para UI
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      "Falha na requisição. Tente novamente.";
    throw new Error(msg);
  }
}

// ---- endpoints básicos ------------------------------------------------------
export const ping = () => unwrap(api.get("/health"));

// Busca/catálogo
export const getFamilias = () => unwrap(api.get("/familias"));
export const getSubfamilias = (familiaId) =>
  unwrap(api.get(`/familias/${familiaId}/subfamilias`));
export const getMontadoras = () => unwrap(api.get("/montadoras"));
export const pesquisar = (params) => unwrap(api.get("/pesquisar", { params }));
export const autocomplete = (prefix) =>
  unwrap(api.get("/autocomplete", { params: { prefix } }));

// ---- autenticação -----------------------------------------------------------
// O back espera: { nome, email, senha }
export async function authRegister({ nome, email, senha }) {
  return unwrap(api.post("/auth/register", { nome, email, senha }));
}

export async function authLogin({ email, senha }) {
  const data = await unwrap(api.post("/auth/login", { email, senha }));
  if (data?.token) setToken(data.token);
  return data;
}

export function authLogout() {
  clearToken();
}

export const authMe = () => unwrap(api.get("/auth/me"));
export const authUpdateMe = (payload) => unwrap(api.put("/auth/me", payload));

/**
 * Conveniência: cadastro -> login automático.
 * Útil para a tela de registro.
 */
export async function signUpAndLogin({ nome, email, senha }) {
  await authRegister({ nome, email, senha });
  return authLogin({ email, senha });
}

// ---- carrinho ---------------------------------------------------------------
// Ajuste os paths abaixo se suas rotas forem diferentes no back.
export const cartGet = () => unwrap(api.get("/carrinho"));
// export const cartAdd = ({ id_api_externa, quantidade = 1 }) =>
//   unwrap(api.post("/carrinho/produto/adicionar", { id_api_externa, quantidade }));
export const cartUpdate = ({ id_api_externa, quantidade }) =>
  unwrap(api.post("/carrinho/produto/atualizar-quantidade", { id_api_externa, quantidade }));
export const cartRemove = ({ id_api_externa }) =>
  unwrap(api.post("/carrinho/produto/remover", { id_api_externa }));
export const cartClear = () => unwrap(api.post("/carrinho/limpar"));
//export const cartCount = () => unwrap(api.get("/carrinho/count"));

// CORRIGIDO: Usa a rota ORIGINAL do projeto para salvar/adicionar produto
export const cartAdd = (dadosDoItem) => 
  unwrap(api.post("/salvar_produto", dadosDoItem)); //

// NOVO: Calcula a contagem no frontend (Compatível com GET /carrinho)
export const cartCount = async () => {
    try {
        const data = await cartGet();
        if (data?.produtos) {
            // Soma a quantidade de todos os produtos no carrinho
            const count = data.produtos.reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0);
            return { count };
        }
    } catch (e) {
        // Retorna 0 em caso de erro (ex: 401 Unauthenticated)
        return { count: 0 }; 
    }
    return { count: 0 };
};