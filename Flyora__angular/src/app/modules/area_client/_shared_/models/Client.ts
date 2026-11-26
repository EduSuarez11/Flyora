import { ObjectId } from "mongodb";
import { Account } from "../../auth/models/Account";
import { IClient } from "../../../_shared_/models/IClient";


export class Client {
    _id: string;
    nombre: string;
    apellidos: string;
    cuenta: Account;
    ticketsComprados: unknown[];
    opiniones: unknown[];
    favoritos: unknown[];

    constructor(datosCliente: IClient) {
        const { nombre, apellidos, cuenta, _id, ticketsComprados = [], opiniones = [], favoritos } = datosCliente;
        this._id = _id || new ObjectId().toString();
        this.nombre = String(nombre || '').trim();
        this.apellidos = String(apellidos || '').trim();
        this.cuenta = new Account(cuenta);
        this.ticketsComprados = ticketsComprados || [];
        this.opiniones = opiniones || [];
        this.favoritos = favoritos || [];
    }

    static fromPrimitives(datosCliente: IClient): Client {
        return new Client(datosCliente);
    }

    toPrimitives() {
        return {
            _id: this._id,
            nombre: this.nombre,
            apellidos: this.apellidos,
            cuenta: this.cuenta.toPrimitives(),
            ticketsComprados: this.ticketsComprados,
            opiniones: this.opiniones,
            favoritos: this.favoritos
        };
    }
}
