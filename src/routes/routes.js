import { Router } from "express";
const routes = Router();

import categoriaRoutes from "./categoriaRoutes.js";
import produtoRoutes from "./produtoRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";
import imagemRoutes from "./imagemRoutes.js";

routes.use('/categorias', categoriaRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/pedidos', pedidoRoutes);
routes.use('/imagens', imagemRoutes);

export default routes;