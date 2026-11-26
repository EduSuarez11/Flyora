import { HttpClient, httpResource } from "@angular/common/http";
import { IResponseAPI } from "../../../../_shared_/models/IResponseAPI";
import { inject } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";

export class AuthService {

    private readonly http = inject(HttpClient);

    async requestToAuth(action: string, body: any): Promise<IResponseAPI> {
        return await firstValueFrom(this.http.post(`http://localhost:3000/api/Client/${action}`, body, { responseType: 'json' })) as Promise<IResponseAPI>;
    }
}