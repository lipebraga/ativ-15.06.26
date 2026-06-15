# E-Commerce API

API REST de e-commerce desenvolvida com Node.js, Express e MySQL. Projetada para ser integrada a um front-end, expõe recursos de categorias, produtos e pedidos com upload de imagens e controle de estoque automático.

## Tecnologias

| Pacote | Finalidade |
|--------|-----------|
| `express` | Framework HTTP para roteamento e middlewares |
| `mysql2` | Driver MySQL com suporte a Promises e pool de conexões |
| `multer` | Upload de imagens via `multipart/form-data` |
| `cors` | Habilita requisições cross-origin do front-end |
| `dotenv` | Carrega variáveis de ambiente a partir do `.env` |


## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
SERVER_PORT=8080

DB_HOST=localhost
DB_DATABASE=S1_R3_R4_AT5_PBE2
DB_USER=root
DB_PASSWORD=1234
DB_PORT=3306
```

### 3. Criar o banco de dados

Execute o arquivo `docs/banco.sql` no **MySQL Workbench** antes de iniciar o servidor.

### 4. Iniciar o servidor

```Iniciar o servidor
nodemon src\server.js
```

> Servidor disponível em `http://localhost:8080`

## Estrutura de pastas

```
src/
├── configs/
│   ├── Database.js               # Singleton — pool de conexão com o banco
│   └── produto.multer.js         # Configuração do Multer para produtos
│
├── controllers/
│   ├── categoriaController.js    # Lógica de negócio e respostas HTTP — categorias
│   ├── produtoController.js      # Lógica de negócio e respostas HTTP — produtos
│   └── pedidoController.js       # Lógica de negócio e respostas HTTP — pedidos
│
├── enum/
│   └── statusPedido.js           # Valores válidos para status de pedido
│
├── middlewares/
│   └── uploadImage.middleware.js # Validação e processamento do upload de imagem
│
├── models/
│   ├── Categoria.js              # Factory — Categoria.criar()
│   ├── Produto.js                # Factory — Produto.criar()
│   ├── Pedido.js                 # Factory — Pedido.criar()
│   └── ItensPedido.js            # Factory — ItensPedido.criar()
│
├── repositories/
│   ├── categoriaRepository.js    # Queries SQL — categorias
│   ├── produtoRepository.js      # Queries SQL — produtos
│   └── pedidoRepository.js       # Queries SQL — pedidos e itens
│
├── routes/
│   ├── categoriaRoutes.js        # Rotas de /categorias
│   ├── produtoRoutes.js          # Rotas de /produtos
│   ├── pedidoRoutes.js           # Rotas de /pedidos
│   └── routes.js                 # Agregador de todas as rotas
│
└── server.js                     # Ponto de entrada da aplicação
```

## 📡 Endpoints

### Categorias — `/categorias`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/categorias` | Lista todas as categorias |
| `POST` | `/categorias` | Cria uma nova categoria |
| `PUT` | `/categorias/:id` | Atualiza uma categoria pelo ID |
| `DELETE` | `/categorias/:id` | Remove uma categoria pelo ID |

**Body — `POST` e `PUT`** (`application/json`):

```json
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral"
}
```

---

### Produtos — `/produtos`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/produtos` | Lista todos os produtos |
| `GET` | `/produtos/:id` | Busca um produto pelo ID |
| `POST` | `/produtos` | Cria um novo produto com imagem |
| `PUT` | `/produtos/:id` | Atualiza um produto pelo ID |
| `DELETE` | `/produtos/:id` | Remove um produto pelo ID |

**Body — `POST` e `PUT`** (`multipart/form-data`):

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `idCategoria` | number | ID da categoria do produto |
| `nome` | string | Nome do produto |
| `descricao` | string | Descrição do produto |
| `preco` | number | Preço unitário |
| `quantidadeEstoque` | number | Quantidade disponível em estoque |
| `imagem` | file | Arquivo de imagem (`.jpg` ou `.png`) |

---

### Pedidos — `/pedidos`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/pedidos` | Lista todos os pedidos |
| `GET` | `/pedidos/:id` | Busca um pedido pelo ID com seus itens |
| `POST` | `/pedidos` | Cria um pedido — valida e desconta estoque |
| `PUT` | `/pedidos/:id/status` | Altera o status do pedido |
| `DELETE` | `/pedidos/:id` | Remove um pedido pelo ID |
| `POST` | `/pedidos/:pedidoId/itens` | Adiciona um item a um pedido existente |
| `PUT` | `/pedidos/:pedidoId/itens/:itemId` | Edita a quantidade de um item |
| `DELETE` | `/pedidos/:pedidoId/itens/:itemId` | Remove um item do pedido |

**Body — `POST /pedidos`** (`application/json`):

```json
{
  "itens": [
    {
      "idProduto": 1,
      "quantidade": 2,
      "valorUnitario": 4999.99
    }
  ]
}
```

**Body — `PUT /pedidos/:id/status`** (`application/json`):

```json
{
  "status": "Finalizado"
}
```

> **Status disponíveis:** `Aberto` · `Pendente` · `Finalizado`
>
> Todo pedido é criado com status `Aberto` por padrão.

**Body — `POST /pedidos/:pedidoId/itens`** (`application/json`):

```json
{
  "idProduto": 2,
  "quantidade": 1,
  "valorUnitario": 299.99
}
```

**Body — `PUT /pedidos/:pedidoId/itens/:itemId`** (`application/json`):

```json
{
  "quantidade": 3
}
```

---

## Regras de negócio

- O `valorTotal` do pedido é calculado automaticamente com base nos itens.
- O estoque é validado antes de criar o pedido — se insuficiente, retorna erro `400`.
- O estoque é decrementado automaticamente ao criar o pedido.
- Ao editar ou remover itens, o `valorTotal` é recalculado automaticamente.
- Todo pedido é criado com status `Aberto` por padrão.
- Formatos de imagem aceitos: `.jpg` e `.png`.

---

## Padrão de erros

Todos os erros retornam o mesmo envelope JSON:

```json
{
  "sucesso": false,
  "mensagem": "Descrição do erro"
}
```

| Status | Situação |
|--------|----------|
| `400` | Campos obrigatórios ausentes ou payload inválido |
| `404` | Recurso não encontrado |
| `500` | Erro interno no servidor |

---

## 🏗️ Padrões de projeto

| Padrão | Onde é aplicado | Por quê |
|--------|----------------|---------|
| **Singleton** | `Database.js` | Garante uma única instância do pool de conexão durante toda a execução |
| **Factory** | `Categoria.criar()`, `Produto.criar()`, etc. | Encapsula a construção dos objetos de domínio em um único lugar |
| **Repository** | `categoriaRepository`, `produtoRepository`, `pedidoRepository` | Isola todas as queries SQL, mantendo os controllers livres de lógica de banco de dados |
