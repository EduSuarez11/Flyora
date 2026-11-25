import express, { Express } from 'express';
import configurationPipeline from './config_pipeline_express/configurationPipeline';
import { IConfig } from '../modules/_shared_/models/interfaces/IConfig';
import { IDbService } from '../modules/_shared_/models/interfaces/IDbService';
import { MongoService } from '../modules/_shared_/controllers/mongo/MongoService';


const configuration:IConfig = {
    port: process.env.PORT || 3000,
    urlMongodb: process.env.URL_MONGODB,
    dbName: process.env.DBNAME,
    jwtSecret: process.env.JWT_SIGNATURE_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h'
}

const server: Express = express();
const dbService = new MongoService({dbName: configuration.dbName, url: configuration.urlMongodb});

configurationPipeline(server, configuration, dbService)


server.listen(configuration.port, (error: Error | undefined) => {
    if (error) {
        console.log('Error al iniciar el servidor:', error);
    } else {
        console.log(`Servidor corriendo en puerto ${configuration.port}`);
    }
})


