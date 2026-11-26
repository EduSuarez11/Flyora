import { IAccount } from "../../area_client/_shared_/models/IAccount";

export interface IClient {
    _id?: string | undefined;
    nombre?: string | undefined;
    apellidos?: string | undefined;
    cuenta: IAccount;
    ticketsComprados?: unknown[] | undefined;
    opiniones?: unknown[] | undefined;
    favoritos?: unknown[] | undefined;
}
