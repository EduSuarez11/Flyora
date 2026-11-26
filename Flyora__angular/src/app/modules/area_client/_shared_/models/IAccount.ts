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