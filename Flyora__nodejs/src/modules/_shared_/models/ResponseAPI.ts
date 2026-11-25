export interface IResponseAPI {
    code: number;
    message: string;
    data?: any;
}

export class ResponseAPI {
    private readonly code:number;
    private readonly message: string;
    private readonly data?: any;
    
    constructor(code: number, message: string, data?: any) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    toPrimitives(): IResponseAPI {
        return {
            code: this.code,
            message: this.message,
            data: this.data
        };
    }
}