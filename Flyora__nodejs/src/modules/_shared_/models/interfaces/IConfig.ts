export interface IConfig {
    port: string | number;
    urlMongodb: string | undefined;
    dbName: string | undefined;
    jwtSecret: string |undefined;
    jwtExpiresIn: string | undefined;
}