import { Context, APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import { Authorizer } from '../../authorizer/auth/authorizer';
import { AWSPolicyGenerator } from '../../authorizer/auth/aws-policy-generator';
import { audience, jwksUri, tokenIssuer } from './auth.json';

const AUDIENCE = audience;
const JWKS_URI = jwksUri;
const TOKEN_ISSUER = tokenIssuer;

export const handler = async (event: APIGatewayTokenAuthorizerEvent, context: Context): Promise<APIGatewayAuthorizerResult> => {

    var token = event.authorizationToken == null ? "" : event.authorizationToken;
    try {
        const client = new Authorizer(TOKEN_ISSUER, JWKS_URI, AUDIENCE);
        const decoded = await client.authorize(token);
        return AWSPolicyGenerator.generate(decoded.sub, 'Allow', event.methodArn, decoded);

    } catch (err) {
        return AWSPolicyGenerator.generate('user', 'Deny', event.methodArn);
    }
};
