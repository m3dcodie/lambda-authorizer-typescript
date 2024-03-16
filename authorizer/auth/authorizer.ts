import * as jwt from 'jsonwebtoken';
import * as jwks from "jwks-rsa";

export class Authorizer {
    constructor(
        private issuer: string,
        private jwksUri: string,
        private audience: string) {
    }

    private getToken(token: string) {
        const match = token.match(/^Bearer (.*)$/);
        if (!match || match.length < 2) {
            throw new Error(`Invalid Authorization token - ${token} does not match "Bearer .*"`);
        }
        return match[1];
    }

    public async authorize(token: string): Promise<any> {
        token = this.getToken(token);
        let decoded: any = jwt.decode(token, { complete: true });

        const pubKey = await this.getKey(decoded.header.kid)
        return this.verify(token, pubKey);
    }

    private async getKey(kid: any): Promise<string> {
        const client = new jwks.JwksClient({
            jwksUri: this.jwksUri
        });
        const pubKey = await client.getSigningKey(kid);
        return pubKey.getPublicKey();
    }

    private verify(token: string, cert: string): Promise<{}> {
        const options = {
            audience: this.audience
        };

        return new Promise((resolve, reject) => {
            jwt.verify(token, cert, options, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                if (decoded != null) {
                    resolve(decoded);
                } else {
                    reject('Unauthorized');
                }
            });
        });
    }
}