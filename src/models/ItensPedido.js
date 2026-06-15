export class ItensPedido {
    #id;
    #idPedido;
    #idProduto;
    #quantidade;
    #valorUnitario;
    #subtotal;

    constructor(pIdProduto, pQuantidade, pValorUnitario, pIdPedido = null, pId = null) {
        this.idProduto = pIdProduto;
        this.quantidade = pQuantidade;
        this.valorUnitario = pValorUnitario;
        this.idPedido = pIdPedido;
        this.#id = pId;
        this.#subtotal = pQuantidade * pValorUnitario;
    }

    get id() { return this.#id; }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get idPedido() { return this.#idPedido; }
    set idPedido(value) { this.#idPedido = value; }

    get idProduto() { return this.#idProduto; }
    set idProduto(value) {
        this.#validarIdProduto(value);
        this.#idProduto = value;
    }

    get quantidade() { return this.#quantidade; }
    set quantidade(value) {
        this.#validarQuantidade(value);
        this.#quantidade = value;
    }

    get valorUnitario() { return this.#valorUnitario; }
    set valorUnitario(value) {
        this.#validarValorUnitario(value);
        this.#valorUnitario = value;
    }

    get subtotal() { return this.#subtotal; }

    #validarId(value) {
        if (value && value <= 0) throw new Error('Verifique o ID informado');
    }

    #validarIdProduto(value) {
        if (!value || value <= 0) throw new Error('Verifique o ID do produto informado');
    }

    #validarQuantidade(value) {
        if (!value || value <= 0) throw new Error('Quantidade inválida');
    }

    #validarValorUnitario(value) {
        if (!value || value <= 0) throw new Error('Valor unitário inválido');
    }

    static calcularValorTotal(itens) {
        return itens.reduce((total, item) => total + item.valorUnitario * item.quantidade, 0);
    }

    static criar(dados) {
        return new ItensPedido(dados.idProduto, dados.quantidade, dados.valorUnitario, dados.idPedido || null, null);
    }

    static editar(dados, id) {
        return new ItensPedido(dados.idProduto, dados.quantidade, dados.valorUnitario, dados.idPedido || null, id);
    }
};