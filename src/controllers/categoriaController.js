import { Categoria } from '../models/Categoria.js';
import categoriaRepository from '../repositories/categoriaRepository.js';

const categoriaController = {
    criar: async (req, res) => {
        try {
            const { nome, descricao } = req.body;

            if (!nome) {
                return res.status(400).json({ sucesso: false, mensagem: 'O campo nome é obrigatório' });
            }

            const categoria = Categoria.criar({ nome, descricao });
            const result = await categoriaRepository.criar(categoria);

            res.status(201).json({ sucesso: true, mensagem: 'Categoria criada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const { nome, descricao } = req.body;

            if (!id || id <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            const categoria = Categoria.editar({ nome, descricao }, id);
            const result = await categoriaRepository.editar(categoria);

            res.status(200).json({ sucesso: true, mensagem: 'Categoria atualizada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await categoriaRepository.deletar(id);

            res.status(200).json({ sucesso: true, mensagem: 'Categoria deletada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await categoriaRepository.selecionar();
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default categoriaController;