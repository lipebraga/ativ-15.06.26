import { Router } from 'express';
import imagemController from '../controllers/imagemController.js';

const imagemRoutes = Router();

// Rota para obter imagem por nome de arquivo
 imagemRoutes.get('/:nomeArquivo', imagemController.obterImagem);

export default imagemRoutes;
