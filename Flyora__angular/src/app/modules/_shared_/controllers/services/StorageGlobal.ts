import { Injectable, signal, WritableSignal } from '@angular/core';
import { IClient } from '../../models/IClient';

interface IStorageObject {
    client: IClient | null;
    isLogged: boolean,
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

@Injectable({
    providedIn: 'root',
})

export class StorageGlobal {
    private _storageObject: WritableSignal<IStorageObject> = signal({ client: null, isLogged: false, tokens: { accessToken: '', refreshToken: '' } });

    GetDataClient(): WritableSignal<IClient | null> {
        if (!this._storageObject().client) {
            const storedData = sessionStorage.getItem('flyoraStore');
            if (storedData) {
                const parsedData: IStorageObject = JSON.parse(storedData);
                this._storageObject.set(parsedData);
            }
        }
        return signal(this._storageObject().client);
    }

    SetDataClient(newDataClient: IClient) {
        this._storageObject.update((oldData: IStorageObject) => (
            { ...oldData, client: { ...oldData.client, ...newDataClient } }
        ));

        sessionStorage.setItem('flyoraStore', JSON.stringify(this._storageObject()));
    }


    GetTokens(): WritableSignal<{ accessToken: string, refreshToken: string }> {
        if (!this._storageObject().tokens.accessToken || !this._storageObject().tokens.refreshToken) {
            const storedData = sessionStorage.getItem('flyoraStore');
            if (storedData) {
                const parsedData: IStorageObject = JSON.parse(storedData);
                this._storageObject.set(parsedData);
            }
        }
        return signal(this._storageObject().tokens);
    }

    SetTokens(newTokens: { accessToken: string, refreshToken: string }) {
        this._storageObject.update((oldData: IStorageObject) => ({ ...oldData, tokens: { ...oldData.tokens, ...newTokens } }));
        sessionStorage.setItem('flyoraStore', JSON.stringify(this._storageObject()));
    }    

    GetLoginSession(): boolean {
        return this._storageObject().isLogged;
    }

    LoginSession(isLogged: boolean) {
        this._storageObject.update((oldData: IStorageObject) => ({...oldData, isLogged}))
    }

    CloseSession() {
        this._storageObject.set({ client: null, isLogged: false, tokens: { accessToken: '', refreshToken: '' } });
        sessionStorage.removeItem('flyoraStore');
    }

}
