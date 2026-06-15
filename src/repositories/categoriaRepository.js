import { connection } from '../configs/Database.js';

const categoriaRepository = {
    criar: async (categoria) => {
        const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)';
        const [rows] = await connection.execute(sql, [categoria.nome, categoria.descricao]);
        return rows;
    },

    editar: async (categoria) => {
        const sql = 'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?';
        const [rows] = await connection.execute(sql, [categoria.nome, categoria.descricao, categoria.id]);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM categorias';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    deletar: async (id) => {
        const sql = 'DELETE FROM categorias WHERE id = ?';
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    }
};

export default categoriaRepository;