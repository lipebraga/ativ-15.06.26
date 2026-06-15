export class Pedido {
    #id;
    #valorTotal;
    #statusPedido;

    constructor(pValorTotal, pStatusPedido, pId = null) {
        this.valorTotal = pValorTotal;
        this.statusPedido = pStatusPedido;
        this.#id = pId;
    }

    get id() { return this.#id; }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get valorTotal() { return this.#valorTotal; }
    set valorTotal(value) {
        this.#validarValorTotal(value);
        this.#valorTotal = value;
    }

    get statusPedido() { return this.#statusPedido; }
    set statusPedido(value) { this.#statusPedido = value; }

    #validarId(value) {
        if (value && value <= 0) throw new Error('Verifique o ID informado');
    }

    #validarValorTotal(value) {
        if (value === undefined || value === null || value < 0) throw new Error('Valor total inválido');
    }

    static criar(dados) {
        return new Pedido(dados.valorTotal, dados.statusPedido, null);
    }

    static editar(dados, id) {
        return new Pedido(dados.valorTotal, dados.statusPedido, id);
    }
};