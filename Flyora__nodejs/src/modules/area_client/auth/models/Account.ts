import { PasswordEncryptedService } from "../controllers/services/PasswordEncryptedService";

export interface IAccount {
    email: string;
    password: string | null;
    fechaCreacion?: number | undefined;
    avatar?: string | undefined;
    telefono?: string | undefined;
    tipoCuenta: string;
    cuentaActivada?: boolean | undefined;
    puntos?: number | undefined;
    esMayorEdad: boolean;
    condicionesTerminos: boolean;
}

export class Account {
    email: string;
    password: string | null;
    fechaCreacion: number;
    cuentaActivada: boolean;
    avatar: string;
    telefono: string;
    tipoCuenta: string;
    puntos: number;
    esMayorEdad: boolean;
    condicionesTerminos: boolean;

    constructor({ email, password, fechaCreacion, avatar = '', telefono = '', tipoCuenta, cuentaActivada = false, puntos = 0, esMayorEdad, condicionesTerminos }: IAccount) {
        this.email = email;//new Email(email).value;
        this.password = password;
        this.fechaCreacion = fechaCreacion || Date.now();
        this.cuentaActivada = cuentaActivada
        this.avatar = String(avatar ?? '').trim();
        this.telefono = String(telefono ?? '').trim();
        this.tipoCuenta = tipoCuenta?.toLowerCase();
        this.puntos = puntos;
        this.esMayorEdad = esMayorEdad;
        this.condicionesTerminos = condicionesTerminos;
    }
    //hay q diferenciar entre la devolucion de la cuenta con passwrod o sin ella hasehada
    static fromPrimitives({ email, password, fechaCreacion, avatar, telefono, tipoCuenta, cuentaActivada, puntos, esMayorEdad, condicionesTerminos }: IAccount): Account {
        return new Account({ email, password, fechaCreacion, avatar, telefono, tipoCuenta, cuentaActivada, puntos, esMayorEdad, condicionesTerminos });
    }

    toPrimitives(): Required<IAccount> {
        return {
            email: this.email,
            password: this.password,
            fechaCreacion: this.fechaCreacion,
            avatar: this.avatar,
            telefono: this.telefono,
            tipoCuenta: this.tipoCuenta,
            cuentaActivada: this.cuentaActivada,
            puntos: this.puntos,
            esMayorEdad: this.esMayorEdad,
            condicionesTerminos: this.condicionesTerminos
        };
    }
}
