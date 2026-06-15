import { connection } from '../configs/Database.js';

const produtoRepository = {
    criar: async (produto) => {
        const sql = `INSERT INTO produtos (idCategoria, nome, descricao, preco, imagem, quantidadeEstoque) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [produto.idCategoria, produto.nome, produto.descricao, produto.preco, produto.imagem, produto.quantidadeEstoque];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = `SELECT * FROM produtos`;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = `SELECT * FROM produtos WHERE id = ?`;
        const [rows] = await connection.execute(sql, [id]);
        return rows[0] || null;
    },

    atualizar: async (produto) => {
        const sql = `UPDATE produtos SET idCategoria = ?, nome = ?, descricao = ?, preco = ?, imagem = ?, quantidadeEstoque = ? WHERE id = ?`;
        const values = [produto.idCategoria, produto.nome, produto.descricao, produto.preco, produto.imagem, produto.quantidadeEstoque, produto.id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const sql = `DELETE FROM produtos WHERE id = ?`;
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    }
};

export default produtoRepository;