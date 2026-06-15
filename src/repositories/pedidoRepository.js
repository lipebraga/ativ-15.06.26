import { connection } from '../configs/Database.js';
import { ItensPedido } from '../models/ItensPedido.js';

const pedidoRepository = {

    criar: async (pedido, itensPedido) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            for (const item of itensPedido) {
                const [rows] = await conn.execute(
                    'SELECT Estoque FROM produtos WHERE id = ?', [item.idProduto]
                );
                if (rows.length === 0) throw new Error(`Produto ID ${item.idProduto} não encontrado`);
                if (rows[0].quantidadeEstoque < item.quantidade) throw new Error(`Estoque insuficiente para o produto ID ${item.idProduto}`);
            }

            const [rowsPedido] = await conn.execute(
                'INSERT INTO pedidos (valorTotal, statusPedido) VALUES (?, ?)',
                [pedido.valorTotal, pedido.statusPedido]
            );
            const idPedido = rowsPedido.insertId;

            for (const item of itensPedido) {
                await conn.execute(
                    'INSERT INTO itens_pedido (idPedido, idProduto, quantidade, valorUnitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [idPedido, item.idProduto, item.quantidade, item.valorUnitario, item.subtotal]
                );
                await conn.execute(
                    'UPDATE produtos SET quantidadeEstoque = quantidadeEstoque - ? WHERE id = ?',
                    [item.quantidade, item.idProduto]
                );
            }

            await conn.commit();
            return { insertId: idPedido };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionar: async () => {
        const sql = `SELECT * FROM pedidos ORDER BY id DESC`;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = `SELECT * FROM pedidos WHERE id = ?`;
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();
            await conn.execute('DELETE FROM itens_pedido WHERE idPedido = ?', [id]);
            const [rows] = await conn.execute('DELETE FROM pedidos WHERE id = ?', [id]);
            await conn.commit();
            return rows;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    recalcularValorTotal: async (conn, idPedido) => {
        const [itens] = await conn.execute(
            'SELECT quantidade, valorUnitario FROM itens_pedido WHERE idPedido = ?', [idPedido]
        );
        const novoTotal = ItensPedido.calcularValorTotal(
            itens.map(i => ({ quantidade: i.quantidade, valorUnitario: i.valorUnitario }))
        );
        await conn.execute('UPDATE pedidos SET valorTotal = ? WHERE id = ?', [novoTotal, idPedido]);
    },

    adicionarItem: async (idPedido, item) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const [rows] = await conn.execute(
                'SELECT quantidadeEstoque FROM produtos WHERE id = ?', [item.idProduto]
            );
            if (rows.length === 0) throw new Error(`Produto ID ${item.idProduto} não encontrado`);
            if (rows[0].quantidadeEstoque < item.quantidade) throw new Error('Estoque insuficiente');

            await conn.execute(
                'INSERT INTO itens_pedido (idPedido, idProduto, quantidade, valorUnitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [idPedido, item.idProduto, item.quantidade, item.valorUnitario, item.subtotal]
            );
            await conn.execute(
                'UPDATE produtos SET quantidadeEstoque = quantidadeEstoque - ? WHERE id = ?',
                [item.quantidade, item.idProduto]
            );
            await pedidoRepository.recalcularValorTotal(conn, idPedido);
            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editarItem: async (idPedido, itemId, quantidade) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();
            await conn.execute(
                'UPDATE itens_pedido SET quantidade = ?, subtotal = valorUnitario * ? WHERE id = ? AND idPedido = ?',
                [quantidade, quantidade, itemId, idPedido]
            );
            await pedidoRepository.recalcularValorTotal(conn, idPedido);
            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    excluirItem: async (idPedido, itemId) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();
            await conn.execute(
                'DELETE FROM itens_pedido WHERE id = ? AND idPedido = ?', [itemId, idPedido]
            );
            await pedidoRepository.recalcularValorTotal(conn, idPedido);
            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    alterarStatus: async (id, status) => {
        const [result] = await connection.execute(
            'UPDATE pedidos SET statusPedido = ? WHERE id = ?', [status, id]
        );
        return result;
    }
};

export default pedidoRepository;