// src/lib/api.js
import axios from "axios";

/**
 * Normalização da base:
 * - VITE_API_URL pode vir com / ou até com /health no final.
 * - Removemos sufixos e barras duplicadas para evitar 404/500 e “falso CORS”.
 * - Mantém compatibilidade com qualquer chamada existente no projeto.
 */
const RAW_BASE = import.meta.env.VITE_API_URL?.trim() ?? "";
const BASE_NO_TRAIL = RAW_BASE.replace(/\/+$/, "");
const ROOT_BASE = BASE_NO_TRAIL.replace(/\/health$/i, ""); // raiz (sem /health)

/** Constrói URLs absolutas a partir da raiz normalizada. */
function buildUrl(path = "") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ROOT_BASE}${p}`;
}

// ---- Token helpers (persistência local) ------------------------------------
const TOKEN_KEY = "access_token";

/** Salva ou remove o token do localStorage. */
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/** Lê o token atual (ou string vazia). */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

/** Limpa o token atual. */
export function clearToken() {
  setToken(null);
}

// ---- Instância Axios centralizada ------------------------------------------
export const api = axios.create({
  baseURL: ROOT_BASE,
  timeout: 20000,
  withCredentials: false, // usamos Bearer token; não há cookies
  headers: { "Content-Type": "application/json" },
});

console.info("[API] baseURL normalizada:", ROOT_BASE);

/**
 * Interceptor de request:
 * - injeta Authorization: Bearer <token> quando houver;
 * - log leve dos parâmetros para diagnóstico (sem vazar credenciais).
 */
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;

  const preview = config.params ?? config.data ?? {};
  try {
    const small =
      typeof preview === "object"
        ? Object.fromEntries(Object.entries(preview).slice(0, 12))
        : preview;
    // eslint-disable-next-line no-console
    console.debug(
      "[API]",
      (config.method || "get").toUpperCase(),
      config.url,
      small
    );
  } catch {}
  return config;
});

/**
 * Interceptor de response:
 * - padroniza mensagem em falhas de rede/timeout;
 * - em 401 fora das rotas de auth, limpa token e redireciona para /login.
 */
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (!err?.response) {
      err.message =
        "Erro de rede ou servidor indisponível. Verifique a API/Internet (pré-flight/CORS pode falhar quando o servidor responde 500).";
      return Promise.reject(err);
    }

    const { status, config } = err.response;
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

// ---- Utilitários de parâmetros ---------------------------------------------

/**
 * Remove vazios (""/null/undefined) e converte strings numéricas para número.
 * Mantém booleanos e arrays.
 */
function normalizeParams(obj = {}) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === "" || v == null) continue;
    if (typeof v === "string" && /^\d+$/.test(v)) out[k] = Number(v);
    else out[k] = v;
  }
  return out;
}

/**
 * Mapeia ordenação da UI para parâmetros aceitos pelo backend.
 * Mantém retrocompatibilidade:
 *  - aceita: ordenacao, ordenarPor, orderBy, sort e ordem/order/direction;
 *  - valores: 'menor-preco', 'maior-preco', 'melhor-avaliacao', 'relevancia', 'nome';
 *  - exporta **ambos** pares:
 *      - { ordenar_por, ordem } (preferido pelo backend atual)
 *      - { sort, order }        (compatível com usos legados)
 */
function withOrdering(params = {}) {
  const p = { ...params };

  const rawOrdenacao =
    p.ordenacao ?? p.ordenarPor ?? p.orderBy ?? p.sort ?? null;
  const rawOrdem =
    p.ordem ?? p.order ?? p.direction ?? null;

  const normDir = (x) => {
    if (!x) return undefined;
    const s = String(x).toLowerCase();
    if (["asc", "ascending"].includes(s)) return "asc";
    if (["desc", "descending"].includes(s)) return "desc";
    return undefined;
  };

  const campoMap = {
    "menor-preco": "preco",
    "maior-preco": "preco",
    "melhor-avaliacao": "avaliacao",
    relevancia: "relevancia",
    nome: "nome",
    // sinônimos eventuais
    preco: "preco",
    price: "preco",
    rating: "avaliacao",
  };

  let ordenar_por;
  let ordem;

  if (rawOrdenacao) {
    const key = String(rawOrdenacao).toLowerCase();
    ordenar_por = campoMap[key] || "relevancia";
    ordem = normDir(rawOrdem);

    if (key === "menor-preco") ordem = "asc";
    if (key === "maior-preco") ordem = "desc";
    if (!ordem) {
      // defaults coerentes
      ordem =
        ordenar_por === "nome" ? "asc" : "desc";
    }
  } else {
    // Se veio sort/order diretamente, normaliza direção
    const sortIn = p.sort ? String(p.sort).toLowerCase() : undefined;
    ordenar_por = sortIn ? (campoMap[sortIn] || sortIn) : undefined;
    ordem = normDir(rawOrdem) || (ordenar_por === "nome" ? "asc" : "desc");
  }

  // Aplica apenas se houver alguma ordenação definida
  if (ordenar_por) {
    p.ordenar_por = ordenar_por; // preferido pelo backend
    p.ordem = ordem;
    // Mantém também os campos legados para máxima compatibilidade
    p.sort = ordenar_por;
    p.order = ordem;
  }

  // Remove chaves não padronizadas para não poluir a query
  delete p.ordenacao;
  delete p.ordenarPor;
  delete p.orderBy;
  delete p.direction;

  return p;
}

/** Sempre devolve res.data ou lança Error com mensagem amigável. */
async function unwrap(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      "Falha na requisição. Tente novamente.";
    throw new Error(msg);
  }
}

// ---- Endpoints básicos ------------------------------------------------------
export const ping = () => unwrap(api.get("/health"));

// Catálogo / Metadados
export const getFamilias = () => unwrap(api.get("/familias"));
export const getSubfamilias = (familiaId) =>
  unwrap(api.get(`/familias/${familiaId}/subfamilias`));
export const getMontadoras = () => unwrap(api.get("/montadoras"));

/**
 * pesquisa(params)
 * - normaliza filtros;
 * - mapeia ordenação para { ordenar_por, ordem } (e mantém sort/order por compatibilidade).
 */
export const pesquisar = (params) =>
  unwrap(
    api.get("/pesquisar", {
      params: normalizeParams(withOrdering(params)),
    })
  );

export const autocomplete = (prefix) =>
  unwrap(api.get("/autocomplete", { params: { prefix } }));

// ---- Autenticação -----------------------------------------------------------
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

/** Conveniência: cadastro seguido de login. */
export async function signUpAndLogin({ nome, email, senha }) {
  await authRegister({ nome, email, senha });
  return authLogin({ email, senha });
}

// ---- Carrinho ---------------------------------------------------------------
export const cartGet = () => unwrap(api.get("/carrinho"));

// Usa a rota ORIGINAL para salvar/adicionar item ao carrinho
export const cartAdd = (dadosDoItem) =>
  unwrap(api.post("/salvar_produto", dadosDoItem));

export const cartUpdate = ({ id_api_externa, quantidade }) =>
  unwrap(
    api.post("/carrinho/produto/atualizar-quantidade", {
      id_api_externa,
      quantidade,
    })
  );

export const cartRemove = ({ id_api_externa }) =>
  unwrap(api.post("/carrinho/produto/remover", { id_api_externa }));

export const cartClear = () => unwrap(api.post("/carrinho/limpar"));

/** Conta itens a partir do GET /carrinho (fallback robusto em caso de 401/erro). */
export const cartCount = async () => {
  try {
    const data = await cartGet();
    if (data?.produtos) {
      const count = data.produtos.reduce(
        (acc, item) => acc + (Number(item.quantidade) || 0),
        0
      );
      return { count };
    }
  } catch {
    return { count: 0 };
  }
  return { count: 0 };
};

export const __internal = { buildUrl }; // opcional: útil em testes
