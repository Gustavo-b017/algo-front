# PeçaCerta — Catálogo e Carrinho de Autopeças (Front-end)

Aplicação web em React (Vite) para busca, navegação e compra de autopeças. Integra autenticação com token Bearer, catálogo pesquisável com filtros hierárquicos (montadora → família → subfamília), vitrines de destaque, carrinho com “Quick Add”, página de produto com avaliações e área de perfil do usuário.

**Produção:** [https://algo-front-kohl.vercel.app/](https://algo-front-kohl.vercel.app/)

---

## Integrantes

- **Alunos:** 
  - Gilson Dias Ramos Junior​ -- RM552345
  - Gustavo Bezerra Assumção -- RM553076
  - Jefferson Gabriel de Mendonça -- RM553149

> Caso necessário, complemente com os nomes completos dos membros do time G³.

---

## Sumário

- [PeçaCerta — Catálogo e Carrinho de Autopeças (Front-end)](#peçacerta--catálogo-e-carrinho-de-autopeças-front-end)
  - [Integrantes](#integrantes)
  - [Sumário](#sumário)
  - [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
  - [Requisitos](#requisitos)
  - [Configuração (variáveis de ambiente)](#configuração-variáveis-de-ambiente)
  - [Instalação e Execução](#instalação-e-execução)
  - [Rotas da Aplicação](#rotas-da-aplicação)
  - [Fluxos Principais](#fluxos-principais)
    - [1) Pesquisa e Resultados](#1-pesquisa-e-resultados)
    - [2) Produto (detalhe)](#2-produto-detalhe)
    - [3) Carrinho](#3-carrinho)
    - [4) Autenticação e Perfil](#4-autenticação-e-perfil)
  - [Contrato com o Backend (endpoints)](#contrato-com-o-backend-endpoints)
    - [Saúde e Metadados](#saúde-e-metadados)
    - [Busca e Autocomplete](#busca-e-autocomplete)
    - [Produto](#produto)
    - [Autenticação e Perfil](#autenticação-e-perfil)
    - [Carrinho](#carrinho)
  - [Componentes e Páginas (visão funcional)](#componentes-e-páginas-visão-funcional)
  - [Padrões e Diretrizes do Código](#padrões-e-diretrizes-do-código)
  - [Boas Práticas de Segurança](#boas-práticas-de-segurança)
  - [Build e Deploy](#build-e-deploy)
  - [Licença](#licença)

---

## Arquitetura e Tecnologias

* **Front-end:**

  * React + Vite
  * React Router DOM
  * Axios (instância central com interceptors)
  * SCSS (estilização modular por componente)
  * Bootstrap (carrossel do banner)
* **Autenticação:**

  * Token **Bearer** persistido em `localStorage` (`access_token`)
  * Interceptor 401 → limpeza de token e redirecionamento para `/login`
* **Padrões de UX:**

  * Loaders, *empty states*, toasts (sucesso/ação requerida), *quick add* no carrinho
  * Filtros responsivos (sidebar desktop / off-canvas mobile)

---

## Requisitos

* **Node.js 18+** (recomendado **20+**)
* **npm** ou **pnpm**
* Backend HTTP acessível (vide seção de endpoints) e configurado em `VITE_API_URL`

---

## Configuração (variáveis de ambiente)

Crie um arquivo `.env` na raiz do front:

```env
# URL base da API (sem sufixo /health; barras finais são normalizadas)
VITE_API_URL=https://sua-api.exemplo.com

# Opcional: token de serviço para cenários de desenvolvimento (decorator de dev)
# Em produção, o token do usuário é gerenciado após login.
VITE_API_TOKEN=
```

> A base é normalizada em tempo de execução para evitar erros de rota (ex.: remoção automática de barra final e do sufixo `/health` quando presente).

---

## Instalação e Execução

```bash
# 1) Instalar dependências
npm install

# 2) Executar em desenvolvimento
npm run dev

# 3) Build para produção
npm run build

# 4) Pré-visualização local do build
npm run preview
```

Com o app em execução, acesse conforme indicado no terminal (geralmente `http://localhost:5173`).

---

## Rotas da Aplicação

* `/` — **Home**: banner, categorias, vitrines de destaque, marcas.
* `/resultados` — **Busca** com filtros e paginação.
  Parâmetros aceitos: `termo`, `placa`, `familia_id`, `familia_nome`, `subfamilia_id`, `subfamilia_nome`, `marca`, `ordenar_por`, `ordem`, `pagina`.
* `/produto?id=<ID>&nomeProduto=<opcional>` — **Detalhe do produto** + *Quick Add*.
* `/login` — **Autenticação** (acesso necessário para carrinho/pedido/perfil).
* `/perfil` — **Perfil do usuário** (rota protegida).
* `/carrinho` — **Carrinho** (lista, quantidades, subtotal).
* `/suporte` — **Central de Ajuda** (form e FAQ).

Rotas protegidas utilizam **`RequireAuth`** (redireciona a `/login` preservando `state.from`).

---

## Fluxos Principais

### 1) Pesquisa e Resultados

* **Pesquisa** (`/Componentes/Pesquisa.jsx`):

  * Autocomplete (`/autocomplete?prefix=`) com *debounce* (300ms).
  * Envia o usuário para `/resultados?termo=...&placa=...`.
* **Resultados** (`/Paginas/Resultados.jsx`):

  * Carrega **famílias** e, conforme seleção, **subfamílias**.
  * Busca **facetas** (marcas e subprodutos válidos) para refinar filtros.
  * Chama `/pesquisar` com paginação e ordenação (ver mapeamento abaixo).
  * Renderiza cards de produto com botão **Quick Add** e mensagem contextual (*feedback*).

### 2) Produto (detalhe)

* **Produto** (`/Paginas/Produto.jsx`):

  * Requisita `/produto_detalhes?id=...` (depende do backend).
  * Exibe galeria, preços, informação de vendedor e **Aplicações**.
  * Ação **Adicionar à sacola**: monta o payload e chama `/salvar_produto`.

### 3) Carrinho

* **Quick Add** (em resultados e vitrines) e **Adicionar à sacola** (no produto) disparam:

  * `POST /salvar_produto` com o item completo.
  * Atualizam o **badge** do carrinho no header (contagem via `GET /carrinho`).
  * Mostram **CartNotification** (toast).

### 4) Autenticação e Perfil

* **Login** (`/login`): `POST /auth/login` → token salvo em `localStorage`.
* **Estado global** (`contexts/auth-context`):

  * Mantém `user`, `ready` e `cartItemCount`.
  * `auth/me` ao iniciar, sincroniza contagem do carrinho.
  * Exibe **AuthRequiredToast** ao acionar ações que exigem login.
* **Perfil** (`/perfil`): `GET /auth/me` (carga), `PUT /auth/me` (atualização de dados/senha) + **ProfileSuccessToast**.

---

## Contrato com o Backend (endpoints)

> A instância Axios (em `src/lib/api.js`) centraliza baseURL, interceptors e normalização de parâmetros.

### Saúde e Metadados

* `GET /health` — *ping* da API.
* `GET /familias` — lista de famílias.
* `GET /familias/:id/subfamilias` — lista de subfamílias de uma família.
* `GET /montadoras` — lista de montadoras (quando aplicável).

### Busca e Autocomplete

* `GET /autocomplete?prefix=<texto>` — sugestões de termos.
* `GET /pesquisar` — aceita parâmetros:

  * **Termos e filtros:** `termo`, `placa`, `familia_id`, `familia_nome`, `subfamilia_id`, `subfamilia_nome`, `marca`, `pagina`.
  * **Ordenação:**
    A UI produz valores como `relevancia`, `menor-preco`, `maior-preco`, `melhor-avaliacao`, `nome`.
    O front mapeia para **`ordenar_por`** (`score|preco|avaliacao|nome`) e **`ordem`** (`asc|desc`).
    Por compatibilidade, também envia `sort`/`order`.

### Produto

* `GET /produto_detalhes?id=<ID>[&nomeProduto=...]` — detalhe do produto (dependente do backend).

### Autenticação e Perfil

* `POST /auth/register` — `{ nome, email, senha }`
* `POST /auth/login` — `{ email, senha }` → `{ token, user, success }`
* `GET /auth/me` — retorna `{ user, success }`
* `PUT /auth/me` — atualiza `{ nome, telefone, avatar_url }` e, opcionalmente, `{ senha_atual, nova_senha }`

### Carrinho

* `GET /carrinho` — itens no carrinho (`produtos[]` com `quantidade` e preços)
* `POST /salvar_produto` — **adiciona/salva** item no carrinho (payload completo do produto)
* `POST /carrinho/produto/atualizar-quantidade` — `{ id_api_externa, quantidade }`
* `POST /carrinho/produto/remover` — `{ id_api_externa }`
* `POST /carrinho/limpar`

---

## Componentes e Páginas (visão funcional)

* **Header**: menu lateral (categorias e institucionais), busca (com autocomplete), status de login, badge do carrinho.
* **Banner**: carrossel Bootstrap com imagens estáticas.
* **Categorias / Marcas**: atalhos de navegação por categoria/marca.
* **ProdutoDestaque**: vitrine horizontal com *scroll* e **Quick Add**.
* **Resultados**: filtros (ordenação + família/subfamília/marca), cards paginados, *empty state*.
* **Item (produto)**: página de detalhe + avaliações (layout e dados exemplificativos).
* **Carrinho**: `CardCarrinho` (linhas, +/-/remover) e `ResumoCompra` (totais).
* **Perfil**: dados pessoais, avatar por URL, alteração de senha.
* **Suporte**: formulário ilustrativo + FAQ (accordion).

Toasts:

* **AuthRequiredToast**: solicita login/cadastro quando ação exige autenticação.
* **CartNotification**: confirma inclusão de item.
* **ProfileSuccessToast**: confirma atualização de perfil/senha.

---

## Padrões e Diretrizes do Código

* **Instância única do Axios** (`src/lib/api.js`)

  * **Request interceptor**: injeta `Authorization: Bearer <token>` quando presente.
  * **Response interceptor**: em `401` (fora das rotas de auth), limpa token e redireciona para `/login`.
  * Timeout padrão de **20s**.
* **Normalização de parâmetros**

  * `normalizeParams`: remove vazios e converte numéricos (`"12" → 12`).
  * `withOrdering`: mapeia a ordenação da UI para `{ ordenar_por, ordem }` e mantém `sort/order` por compatibilidade.
* **Estado global de autenticação** (`contexts/auth-context`)

  * `user`, `ready`, `cartItemCount` e *helpers* (`login`, `logout`, `fetchCartCount`, `triggerLoginAlert`).
  * Proteção de rotas com `RequireAuth`.
* **UX consistente**

  * Loaders com `loader-circle`, *empty states* reutilizáveis e textos de feedback padronizados.
  * Botões e ícones acessíveis (`aria-label`, `title`, `aria-expanded`).

---

## Boas Práticas de Segurança

* **Token em `localStorage`** (limpo em `logout` e ao receber `401`).
* **Sem cookies** (`withCredentials: false`); todas as chamadas usam Bearer token.
* **Sem log de credenciais**: logs de request omitem dados sensíveis e limitam tamanho (`slice(0, 12)`).
* **Tratamento de erro padronizado**: mensagens amigáveis no front (e propagação do erro original para análise).

---

## Build e Deploy

* **Build:** `npm run build` gera a pasta `dist/`.
* **Hospedagem:** Vercel (produção em [https://algo-front-kohl.vercel.app/](https://algo-front-kohl.vercel.app/)).
* **Variáveis de ambiente de produção:** configurar `VITE_API_URL` no provedor (Vercel → Project Settings → Environment Variables).
* **Cache/CDN:** recomendado habilitar cache estático no provedor.
* **Integração contínua (opcional):** configurar *preview deploys* por branch e *production deploy* via `main`.

---

## Licença

Uso educacional e interno do projeto. Direitos reservados aos autores. Se desejar adotar uma licença aberta (ex.: MIT), incluir o arquivo `LICENSE` na raiz do repositório.
