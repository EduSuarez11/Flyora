import express, { Express } from 'express';
import cors from 'cors';
import { IConfig } from '../../modules/_shared_/models/interfaces/IConfig';
import { routerClient } from '../../modules/area_client/_shared_/controllers/routerClient';
import { MongoService } from '../../modules/_shared_/controllers/mongo/MongoService';

export default function configPipeline(server: Express, config: IConfig, dbService: MongoService) {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cors({
        exposedHeaders: ['x-access-token'],
        allowedHeaders: ['Content-Type','Authorization','x-refresh-token'],
        credentials: true
    }));

    server.use('/api/Portal')
    server.use('/api/Client', routerClient(config, dbService))
}