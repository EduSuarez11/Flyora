import { Document, Filter, WithId, UpdateFilter, DeleteResult, MongoClient, Db, Collection } from 'mongodb';
//import {  } from 'mongoose';
import { IDbService } from '../../models/interfaces/IDbService';

interface IConstructor {
    dbName: string | undefined;
    url: string | undefined;
}

export class MongoService implements IDbService {

    private readonly url: string | undefined;
    private readonly dbName: string | undefined;
    private readonly client: MongoClient;

    constructor({ dbName, url }: IConstructor) {
        this.dbName = dbName;
        this.url = url;
        this.client = new MongoClient(this.url as string)
    }

    async selectOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<WithId<T> | null> {
        try {
            await this.client.connect();
            const db: Db = this.client.db(this.dbName);
            const collection: Collection<T> = db.collection<T>(tableOrCollection);
            return await collection.findOne(query, projection ? { projection } : {});
        } catch (error: unknown) {
            throw new Error('Error en el Servicio de MongoDB (Encontrar)');
        }
    }
    async selectMany<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<any> {
        try {
            await this.client.connect();
            const db: Db = this.client.db(this.dbName);
            const collection: Collection<T> = db.collection<T>(tableOrCollection);
            return await collection.find(query, projection ? { projection } : {}).toArray();
        } catch (error: unknown) {
            throw new Error('Error en el Servicio de MongoDB (Encontrar muchos)');
        }
    }
    async insertOne<T extends Document = Document>(tableOrCollection: string, data: T): Promise<WithId<T>> {
        try {
            await this.client.connect();
            const db: Db = this.client.db(this.dbName);
            const collection: Collection<Document> = db.collection<Document>(tableOrCollection);
            const result = await collection.insertOne(data);

            if (!result.insertedId) throw new Error('No se pudo insertar el documento')

            const findClient = await collection.findOne({ _id: result.insertedId });
            if (!findClient) throw new Error('No se pudo recuperar el documento insertado');
            return findClient as WithId<T>;

        } catch (error: unknown) {
            throw new Error('Error en el Servicio de MongoDB (Agregar)');
        }
    }
    async updateOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, update: UpdateFilter<T>): Promise<UpdateFilter<T> | null> {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection<T>(tableOrCollection);
            const result = await collection.updateOne(query, update);

            if (!result.acknowledged) throw new Error('Fallo al actualizar el documento en la colección');
            return result;

        } catch (error: unknown) {
            throw new Error('Error en el Servicio de MongoDB (Actualizar)');
        }
    }
    async deleteOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>): Promise<DeleteResult> {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection<T>(tableOrCollection);
            const result = await collection.deleteOne(query);

            if (result.deletedCount === 0) throw new Error('Fallo al actualizar el documento en la colección');

            return result;
        } catch (error: unknown) {
            throw new Error('Error en el Servicio de MongoDB (Eliminar)');
        }
    }

}