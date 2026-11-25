import type { Document, Filter, UpdateFilter, WithId } from 'mongodb';
import { DeleteResult } from 'mongoose';

export interface IDbService {
    selectOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<WithId<T> | null>;
    selectMany<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<any>;
    insertOne<T extends Document = Document>(tableOrCollection: string, data: T): Promise<WithId<T>>;
    updateOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, update: UpdateFilter<T>): Promise<UpdateFilter<T> | null>;
    deleteOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>): Promise<DeleteResult>;
}