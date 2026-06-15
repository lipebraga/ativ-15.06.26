export class Produto {
    #id;
    #idCategoria;
    #nome;
    #descricao;
    #preco;
    #imagem;
    #quantidadeEstoque;

    constructor(pIdCategoria, pNome, pDescricao, pPreco, pImagem, pQuantidadeEstoque, pId = null) {
        this.idCategoria = pIdCategoria;
        this.nome = pNome;
        this.descricao = pDescricao;
        this.preco = pPreco;
        this.imagem = pImagem;
        this.quantidadeEstoque = pQuantidadeEstoque;
        this.#id = pId;
    }

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get idCategoria() { return this.#idCategoria; }
    set idCategoria(value) {
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }

    get preco() { return this.#preco; }
    set preco(value) {
        this.#validarPreco(value);
        this.#preco = value;
    }

    get imagem() { return this.#imagem; }
    set imagem(value) { this.#imagem = value; }

    get quantidadeEstoque() { return this.#quantidadeEstoque; }
    set quantidadeEstoque(value) {
        this.#validarEstoque(value);
        this.#quantidadeEstoque = value;
    }

    #validarIdCategoria(value) {
        if (!value || value <= 0) throw new Error('Categoria inválida, tente novamente!');
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3) throw new Error('Nome inválido, tente novamente!');
    }

    #validarPreco(value) {
        if (!value || value <= 0) throw new Error('Preço inválido, tente novamente!');
    }

    #validarEstoque(value) {
        if (value === undefined || value === null || value < 0)
            throw new Error('Quantidade em estoque inválida!');
    }

    static criar(dados, imagem) {
        return new Produto(dados.idCategoria, dados.nome, dados.descricao, dados.preco, imagem, dados.quantidadeEstoque);
    }

    static editar(dados, imagem, id) {
        return new Produto(dados.idCategoria, dados.nome, dados.descricao, dados.preco, imagem, dados.quantidadeEstoque, id);
    }
};