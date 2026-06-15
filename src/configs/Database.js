import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


// Singleton para a conexão com o banco de dados
class Database {
    static #instance = null;
    #pool = null;


    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }


    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }
        return Database.#instance;
    }


    getPool() {
        return this.#pool;
    }
}


export const connection = Database.getInstance().getPool();


export async function initializeDatabase() {
    console.log("Inicializando o banco de dados e tabelas...");
    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });


        const dbName = process.env.DB_DATABASE || 'S1_R3_R4_AT5_PBE2';


        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \${dbName}`);
        await tempConnection.query(`USE \${dbName}`);


        await tempConnection.query(`
            CREATE TABLE categorias (
    id INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(250),
    dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_categorias PRIMARY KEY (id)
);
        `);


        await tempConnection.query(`
           CREATE TABLE produtos (
    id INT AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(250),
    quantidadeEstoque INT NOT NULL DEFAULT 0,
    idCategoria INT,
    dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_produtos PRIMARY KEY (id),
    CONSTRAINT fk_produtos_categorias FOREIGN KEY (idCategoria) 
        REFERENCES categorias(id) ON DELETE SET NULL ON UPDATE CASCADE
);
        `);

        await tempConnection.query(`
           CREATE TABLE pedidos (
    id INT AUTO_INCREMENT,
    dataPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valorTotal DECIMAL(10,2) NOT NULL,
    statusPedido VARCHAR(50),
    CONSTRAINT pk_pedidos PRIMARY KEY (id)
);
        `);

        await tempConnection.query(`
           CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT,
    idPedido INT NOT NULL,
    idProduto INT NOT NULL,
    quantidade INT NOT NULL,
    valorUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_itens_pedido PRIMARY KEY (id),
    CONSTRAINT fk_itens_pedidos FOREIGN KEY (idPedido) 
        REFERENCES pedidos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_itens_produtos FOREIGN KEY (idProduto) 
        REFERENCES produtos(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
        `);

        await tempConnection.end();
        console.log("Banco de dados e tabelas verificados/criados com sucesso.");
    } catch (error) {
        console.error("Erro ao criar o banco ou as tabelas:", error);
        throw error;
    }
};