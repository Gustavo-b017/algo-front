from flask import Flask, jsonify, request
import requests
import heapq
import time

app = Flask(__name__)

# Cache simples: chave -> resposta; tempo de expiração opcional
cache = {}
CACHE_TTL = 60  # tempo de vida em segundos

def get_cache(key):
    entry = cache.get(key)
    if entry:
        timestamp, data = entry
        if time.time() - timestamp < CACHE_TTL:
            return data
        else:
            del cache[key]
    return None

def set_cache(key, data):
    cache[key] = (time.time(), data)

# Função para obter o token de acesso (para testes, verify=False)
def obter_token():
    url_token = "https://sso-catalogo.redeancora.com.br/connect/token"
    headers_token = {"Content-Type": "application/x-www-form-urlencoded"}
    data_token = {
        "grant_type": "client_credentials",
        "client_id": "65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx",
        "client_secret": "9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn"
    }
    response = requests.post(url_token, headers=headers_token, data=data_token, verify=False)
    if response.status_code == 200:
        return response.json().get('access_token')
    print("Erro ao obter token:", response.text)
    return None

# Função auxiliar para extrair o nome do produto
def get_nome(prod):
    if isinstance(prod, dict):
        if "data" in prod and isinstance(prod["data"], dict):
            return (prod["data"].get("nomeProduto") or "").lower()
        return (prod.get("nomeProduto") or "").lower()
    return ""

# Função auxiliar para extrair um valor numérico de um campo (ex: "hp")
def get_numeric(prod, key):
    try:
        if isinstance(prod, dict):
            if "data" in prod and isinstance(prod["data"], dict):
                return float(prod["data"].get(key) or 0)
            return float(prod.get(key) or 0)
    except (ValueError, TypeError):
        return 0
    return 0

# Implementação do Quick Sort para ordenar produtos por 'nomeProduto'
def quick_sort(produtos, asc=True):
    if len(produtos) <= 1:
        return produtos
    pivot = produtos[len(produtos) // 2]
    pivot_nome = get_nome(pivot)
    left = [p for p in produtos if get_nome(p) < pivot_nome]
    middle = [p for p in produtos if get_nome(p) == pivot_nome]
    right = [p for p in produtos if get_nome(p) > pivot_nome]
    if asc:
        return quick_sort(left, asc) + middle + quick_sort(right, asc)
    else:
        return quick_sort(right, asc) + middle + quick_sort(left, asc)

# Função para buscar produtos com paginação (default 15 itens por página)
def buscar_produtos(access_token, produto, pagina=0, itens_por_pagina=15):
    api_url = "https://api-stg-catalogo.redeancora.com.br/superbusca/api/integracao/catalogo/produtos/query"
    api_headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "produtoFiltro": {"nomeProduto": produto},
        "pagina": pagina,  # zero-indexado
        "itensPorPagina": itens_por_pagina
    }
    response = requests.post(api_url, headers=api_headers, json=payload, verify=False)
    if response.status_code == 200:
        return response.json().get("pageResult", {}).get("data", [])
    print("Erro na busca de produtos:", response.text)
    return []

# Função usando heap para retornar os k maiores ou k menores elementos
def get_k_elements(produtos, k, key, largest=True):
    if largest:
        return heapq.nlargest(k, produtos, key=lambda p: get_numeric(p, key))
    else:
        return heapq.nsmallest(k, produtos, key=lambda p: get_numeric(p, key))

# Implementação da Árvore de Busca Binária (BST) para o autocomplete
class BSTNode:
    def __init__(self, key, data):
        self.key = key  # já em minúsculas para comparação
        self.data = data
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, key, data):
        if self.root is None:
            self.root = BSTNode(key, data)
        else:
            self._insert(self.root, key, data)

    def _insert(self, node, key, data):
        if key == node.key:
            return  # evita duplicatas
        elif key < node.key:
            if node.left is None:
                node.left = BSTNode(key, data)
            else:
                self._insert(node.left, key, data)
        else:
            if node.right is None:
                node.right = BSTNode(key, data)
            else:
                self._insert(node.right, key, data)

    def search_prefix(self, prefix, limit=5):
        results = []
        def in_order(node):
            if not node or len(results) >= limit:
                return
            in_order(node.left)
            if node.key.startswith(prefix):
                results.append(node.key)
            in_order(node.right)
        in_order(self.root)
        return results

# Endpoint principal
@app.route("/")
def index():
    return "Back-end Flask funcionando."

# Endpoint de busca com paginação, filtro de marca e cache
@app.route("/buscar", methods=["GET"])
def buscar():
    try:
        produto = request.args.get("produto", "").strip()
        if not produto:
            return jsonify({"error": "Nome do produto não informado"}), 400

        try:
            pagina_ui = int(request.args.get("pagina", "1"))
        except ValueError:
            pagina_ui = 1
        pagina = pagina_ui - 1  # convertendo para zero-indexado

        try:
            itens_por_pagina = int(request.args.get("itensPorPagina", "15"))
        except ValueError:
            itens_por_pagina = 15

        ordem = request.args.get("ordem", "asc").strip().lower()
        asc = ordem == "asc"

        # Define a chave de cache
        cache_key = f"{produto}_{ordem}_{pagina}_{itens_por_pagina}"
        cached = get_cache(cache_key)
        if cached is not None:
            print("Usando cache para", cache_key)
            return jsonify(cached)

        token = obter_token()
        if not token:
            return jsonify({"error": "Erro ao obter token"}), 500

        produtos = buscar_produtos(token, produto, pagina, itens_por_pagina)
        if not produtos:
            response_data = {"results": [], "brands": []}
            set_cache(cache_key, response_data)
            return jsonify(response_data)

        produtos = [p for p in produtos if p is not None]
        produtos_ordenados = quick_sort(produtos, asc) if len(produtos) >= 2 else produtos

        # Extrair marcas distintas dos produtos
        brands_set = set()
        for p in produtos_ordenados:
            marca = None
            if isinstance(p, dict):
                if "data" in p and isinstance(p["data"], dict):
                    marca = p["data"].get("marca")
                else:
                    marca = p.get("marca")
            if marca:
                brands_set.add(marca)
        brands = list(brands_set)

        print("Produto pesquisado:", produto)
        print("Página (zero-indexada):", pagina)
        print("Total de produtos retornados:", len(produtos_ordenados))
        for p in produtos_ordenados:
            print(get_nome(p))

        response_data = {"results": produtos_ordenados, "brands": brands}
        set_cache(cache_key, response_data)
        return jsonify(response_data)
    except Exception as e:
        print("Erro no endpoint /buscar:", str(e))
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

# Endpoint de autocomplete utilizando BST
@app.route("/autocomplete", methods=["GET"])
def autocomplete():
    try:
        produto = request.args.get("produto", "").strip()
        prefix = request.args.get("prefix", "").strip().lower()
        if not produto:
            return jsonify({"error": "Nome do produto não informado"}), 400
        if not prefix:
            return jsonify([])

        token = obter_token()
        if not token:
            return jsonify({"error": "Erro ao obter token"}), 500

        # Busca ampla para o autocomplete (até 1000 itens)
        produtos = buscar_produtos(token, produto, 0, 1000)
        if not produtos:
            return jsonify([])

        produtos = [p for p in produtos if p is not None]
        produtos_ordenados = quick_sort(produtos, asc=True)

        bst = BST()
        for p in produtos_ordenados:
            nome = get_nome(p)
            if nome:
                bst.insert(nome, p)

        suggestions = bst.search_prefix(prefix, limit=5)
        return jsonify(suggestions)
    except Exception as e:
        print("Erro no endpoint /autocomplete:", str(e))
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

# Endpoint para retorno dos k elementos via heap
@app.route("/heap", methods=["GET"])
def heap_endpoint():
    try:
        produto = request.args.get("produto", "").strip()
        if not produto:
            return jsonify({"error": "Nome do produto não informado"}), 400

        try:
            k = int(request.args.get("k", "5"))
        except ValueError:
            k = 5

        largest = request.args.get("largest", "true").lower() == "true"
        key_field = request.args.get("key", "hp").strip()

        token = obter_token()
        if not token:
            return jsonify({"error": "Erro ao obter token"}), 500

        produtos = buscar_produtos(token, produto)
        if not produtos:
            return jsonify([])
        produtos = [p for p in produtos if p is not None]

        k_elements = get_k_elements(produtos, k, key_field, largest)
        print(f"Endpoint /heap: Produto pesquisado: {produto}")
        print(f"Retornando {k} {'maiores' if largest else 'menores'} elementos com base no campo '{key_field}':")
        for p in k_elements:
            print(get_numeric(p, key_field))

        return jsonify(k_elements)
    except Exception as e:
        print("Erro no endpoint /heap:", str(e))
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
