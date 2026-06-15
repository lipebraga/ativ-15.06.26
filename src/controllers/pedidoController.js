import { Pedido } from '../models/Pedido.js';
import { ItensPedido } from '../models/ItensPedido.js';
import pedidoRepository from '../repositories/pedidoRepository.js';
import produtoRepository from '../repositories/produtoRepository.js';
import { statusPedido } from '../enum/statusPedido.js';

const pedidoController = {
    criar: async (req, res) => {
        try {
            const { itens } = req.body;

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe ao menos um item no pedido' });
            }

            // Verificar estoque de cada produto
            for (const item of itens) {
                const produto = await produtoRepository.selecionarPorId(item.idProduto);
                if (!produto) {
                    return res.status(400).json({ sucesso: false, mensagem: `Produto com id ${item.idProduto} não encontrado` });
                }
                if (item.quantidade > produto.quantidadeEstoque) {
                    return res.status(400).json({ sucesso: false, mensagem: `Estoque insuficiente para o produto ${produto.nome}` });
                }
            }

            const itensPedido = itens.map(item =>
                ItensPedido.criar({ idProduto: item.idProduto, quantidade: item.quantidade, valorUnitario: item.valorUnitario })
            );

            const valorTotal = ItensPedido.calcularValorTotal(itensPedido);
            const pedido = Pedido.criar({ valorTotal, statusPedido: statusPedido.ABERTO });

            const result = await pedidoRepository.criar(pedido, itensPedido);

            res.status(201).json({ sucesso: true, mensagem: 'Pedido criado com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    listar: async (req, res) => {
        try {
            const resultado = await pedidoRepository.selecionar();
            res.status(200).json({ sucesso: true, dados: resultado });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    listarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const resultado = await pedidoRepository.selecionarPorId(id);

            if (!resultado || resultado.length === 0) {
                return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });
            }

            res.status(200).json({ sucesso: true, dados: resultado });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const { id } = req.params;
            const resultado = await pedidoRepository.deletar(id);
            res.status(200).json({ sucesso: true, mensagem: 'Pedido deletado com sucesso', dados: resultado });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    adicionarItem: async (req, res) => {
        try {
            const { pedidoId } = req.params;
            const itemData = req.body;
            // Verificar estoque do produto
            const produto = await produtoRepository.selecionarPorId(itemData.idProduto);
            if (!produto) {
                return res.status(400).json({ sucesso: false, mensagem: `Produto com id ${itemData.idProduto} não encontrado` });
            }
            if (itemData.quantidade > produto.quantidadeEstoque) {
                return res.status(400).json({ sucesso: false, mensagem: `Estoque insuficiente para o produto ${produto.nome}` });
            }
            const item = ItensPedido.criar(itemData);
            const result = await pedidoRepository.adicionarItem(pedidoId, item);
            res.status(201).json({ sucesso: true, mensagem: 'Item adicionado com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    editarItem: async (req, res) => {
        try {
            const { pedidoId, itemId } = req.params;
            const { quantidade } = req.body;
            const result = await pedidoRepository.editarItem(pedidoId, itemId, quantidade);
            res.status(200).json({ sucesso: true, mensagem: 'Item atualizado com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    excluirItem: async (req, res) => {
        try {
            const { pedidoId, itemId } = req.params;
            const result = await pedidoRepository.excluirItem(pedidoId, itemId);
            res.status(200).json({ sucesso: true, mensagem: 'Item removido com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    alterarStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!Object.values(statusPedido).includes(status)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: `Status inválido. Use: ${Object.values(statusPedido).join(', ')}`
                });
            }

            const result = await pedidoRepository.alterarStatus(id, status);
            res.status(200).json({ sucesso: true, mensagem: 'Status atualizado com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }
};

export default pedidoController;