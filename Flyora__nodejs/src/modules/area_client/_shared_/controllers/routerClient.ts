import express, { Express, Router } from 'express';
import { IConfig } from '../../../_shared_/models/interfaces/IConfig';
import { AuthController } from '../../auth/controllers/AuthController';
import { MongoService } from '../../../_shared_/controllers/mongo/MongoService';

export function routerClient(config: IConfig, dbService: MongoService)  {
    const router: Router = express.Router();

    const authController = new AuthController(dbService, 
        {
            jwtSignature: config.jwtSecret as string, 
            jwtExpiresIn: config.jwtExpiresIn as string, 
        }
    )


    router.post('/Register', authController.register());
    router.post('/Login', authController.login());

    return router;
}