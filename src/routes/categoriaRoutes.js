import { Router } from 'express';
import categoriaController from '../controllers/categoriaController.js';

const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar);
categoriaRoutes.put('/:id', categoriaController.atualizar);
categoriaRoutes.delete('/:id', categoriaController.deletar);
categoriaRoutes.get('/', categoriaController.selecionar);

export default categoriaRoutes;