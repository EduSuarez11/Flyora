import bcrypt from 'bcrypt';

export class PasswordEncryptedService {

    private readonly saltOrRounds: number;

    constructor() {
        this.saltOrRounds = 10;
    }

    hashSyncPassword(password: string): string {
        return bcrypt.hashSync(password, this.saltOrRounds);
    }

    comparePasswords(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

}