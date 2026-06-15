import { Router } from 'express';
import produtoController from '../controllers/produtoController.js';
import uploadImage from '../middlewares/uploadImage.middleware.js';

const produtoRoutes = Router();

produtoRoutes.post('/', uploadImage, produtoController.criar);
produtoRoutes.get('/', produtoController.selecionar);
produtoRoutes.get('/:id', produtoController.selecionarPorId);
produtoRoutes.put('/:id', uploadImage, produtoController.atualizar);
produtoRoutes.delete('/:id', produtoController.deletar);

export default produtoRoutes;