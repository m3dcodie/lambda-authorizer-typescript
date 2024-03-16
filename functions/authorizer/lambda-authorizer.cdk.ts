import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { IdentitySource, LambdaIntegration, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

type LambdaAuthorizerProps = {
    resourcePrefix: string;
};

export class LambdaAuthorizer extends Construct {
    public lambdaAuthorizer: TokenAuthorizer;
    constructor(scope: Construct, id: string, props: LambdaAuthorizerProps) {
        super(scope, id);
        const authFunction = new NodejsFunction(this, 'function', {
            functionName: `${props.resourcePrefix}-authorizer`,
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: __dirname+'/lambda-authorizer.function.ts',            
        });

        const authorizer = new TokenAuthorizer(this, 'CustomBasicAuthAuthorizer', {
            handler: authFunction,
            identitySource: IdentitySource.header('authorization'),
        });
        this.lambdaAuthorizer = authorizer;
    }
}
