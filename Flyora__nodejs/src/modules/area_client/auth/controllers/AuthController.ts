import { Request, Response, NextFunction, RequestHandler } from "express";
import { IDbService } from "../../../_shared_/models/interfaces/IDbService";
import { PasswordEncryptedService } from "./services/PasswordEncryptedService";
import { JwtService } from "./services/JwtService";
import { IAuthConfig } from "../models/IAuthConfig";
import { ObjectId } from "mongoose";
import { ResponseAPI } from "../../../_shared_/models/ResponseAPI";
import { errorMessage } from "../../../_shared_/models/Errors";
import { Client } from "../../_shared_/models/Client";

export class AuthController {

    private readonly dbService: IDbService;
    private readonly passwordService: PasswordEncryptedService;
    private readonly jwtService: JwtService;

    constructor(dbService: IDbService, { jwtSignature, jwtExpiresIn }: IAuthConfig) {
        this.dbService = dbService;
        this.passwordService = new PasswordEncryptedService();
        this.jwtService = new JwtService(jwtSignature, jwtExpiresIn);
    }


    login(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password, tokenRecaptcha } = req.body;

                const clientFound = await this.dbService.selectOne('clientes', { 'cuenta.email': email });

                if (!clientFound) throw new Error(`Ese usuario con ese email no existe.`);

                if (!clientFound.cuenta.cuentaActiva) throw new Error('Debes activar tu cuenta.');

                if (!this.passwordService.comparePasswords(password, clientFound.cuenta.password)) throw new Error('Las contraseñas no coinciden.');

                const token = this.jwtService.generateToken({ _id: clientFound._id, email: clientFound.cuenta.email });
                const response = new ResponseAPI(0, `Has iniciado sesión con éxito`, { token, client: clientFound });

                res.status(200).send(response.toPrimitives());
            } catch (error: unknown) {
                const response = new ResponseAPI(1, `${errorMessage(error)}`, null);
                res.status(200).send(response.toPrimitives());
            }
        }
    }


    register(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { formData, tokenRecaptcha } = req.body;

                const clientFound = await this.dbService.selectOne('clientes', { 'cuenta.email': formData.email });
                if (clientFound) throw new Error(`Ese email ya se encuentra registrado.`);

                const hashPassword = this.passwordService.hashSyncPassword(formData.password);
                const client = new Client(
                    {
                        _id: '',
                        nombre: formData.nombre,
                        apellidos: formData.apellidos,
                        cuenta: {
                            email: formData.email,
                            password: hashPassword,
                            fechaCreacion: Date.now(),
                            tipoCuenta: 'email',
                            esMayorEdad: formData.termsConditions,
                            condicionesTerminos: formData.termsConditions
                        },
                        favoritos: []
                    }
                )

                const result = await this.dbService.insertOne('clientes', client.toPrimitives());
                if (!result._id) throw new Error('No se pudo registrar el usuario.');

                // TODO Enviar email para activar cuenta
            
                res.status(200).send(new ResponseAPI(0, 'Activa la cuenta para completar el registro.', {}).toPrimitives());
            } catch (error: unknown) {
                const response = new ResponseAPI(1, `${errorMessage(error)}`, null);
                res.status(200).send(response.toPrimitives());
            }
        }
    }


}