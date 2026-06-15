import fs from 'fs';
import path from 'path';

const imagemController = {
    obterImagem: (req, res) => {
        try {
            const { nomeArquivo } = req.params;
            
            // Sanitizar o nome do arquivo para evitar ataques de path traversal
            const arquivoSeguro = path.basename(nomeArquivo);
            const caminhoImagem = path.join(
                path.resolve(process.cwd()),
                'uploads',
                'images',
                arquivoSeguro
            );

            // Verificar se o arquivo existe
            if (!fs.existsSync(caminhoImagem)) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Imagem não encontrada'
                });
            }

            // Enviar arquivo
            res.sendFile(caminhoImagem);
        } catch (error) {
            console.error('Erro ao buscar imagem:', error);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar imagem',
                errorMessage: error.message
            });
        }
    }
};

export default imagemController;
