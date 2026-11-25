import jwt, { SignOptions, JwtPayload, Secret } from 'jsonwebtoken';

export class JwtService {

    private readonly expiration: NonNullable<SignOptions['expiresIn']>;
    private readonly jwtSignature: Secret;

    constructor(jwtSignature: string, expiration: string) {
        this.jwtSignature = jwtSignature as Secret;
        this.expiration = expiration as NonNullable<SignOptions['expiresIn']>;
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.jwtSignature, { expiresIn: this.expiration })
    }

    verifyToken(token: string): JwtPayload | string {
        return jwt.verify(token, this.jwtSignature);
    }

}