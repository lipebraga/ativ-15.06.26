import { Router } from 'express';
import pedidoController from '../controllers/pedidoController.js';

const pedidoRoutes = Router();

pedidoRoutes.post('/', pedidoController.criar);
pedidoRoutes.get('/', pedidoController.listar);
pedidoRoutes.get('/:id', pedidoController.listarPorId);
pedidoRoutes.delete('/:id', pedidoController.deletar);
pedidoRoutes.put('/:id/status', pedidoController.alterarStatus);
pedidoRoutes.post('/:pedidoId/itens', pedidoController.adicionarItem);
pedidoRoutes.put('/:pedidoId/itens/:itemId', pedidoController.editarItem);
pedidoRoutes.delete('/:pedidoId/itens/:itemId', pedidoController.excluirItem);

export default pedidoRoutes;