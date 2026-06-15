export class Categoria {
    #id;
    #nome;
    #descricao;

    constructor(pNome, pDescricao, pId) {
        this.nome = pNome;
        this.descricao = pDescricao;
        this.#id = pId;
    }

    get id() { return this.#id; }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get descricao() { return this.#descricao; }
    set descricao(value) {
        this.#validarDescricao(value);
        this.#descricao = value;
    }

    #validarId(value) {
        if (value && value <= 0) throw new Error('O valor do ID não corresponde ao esperado');
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 45)
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 45 caracteres');
    }

    #validarDescricao(value) {
        if (value && (value.trim().length < 5 || value.trim().length > 255))
            throw new Error('O campo deve ter entre 5 e 255 caracteres');
    }

    static criar(dados) {
        return new Categoria(dados.nome, dados.descricao, null);
    }

    static editar(dados, id) {
        return new Categoria(dados.nome, dados.descricao, id);
    }
};