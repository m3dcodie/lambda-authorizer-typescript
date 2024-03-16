
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { AuthorizationType, LambdaIntegration, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

type UserAPIProps = {
    api: RestApi;
    resourcePrefix: string;
    lambdAuth: TokenAuthorizer
};

export class UserAPI extends Construct {
    constructor(scope: Construct, id: string, props: UserAPIProps) {
        super(scope, id);
        const userFunction = new NodejsFunction(this, 'function', {
            functionName: `${props.resourcePrefix}-user`,
            runtime: Runtime.NODEJS_18_X,
        });

        const userLambdaIntegration = new LambdaIntegration(userFunction, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });


        userFunction.addPermission('apigateway', {
            principal: new ServicePrincipal('apigateway.amazonaws.com'),
            sourceArn: props.api.arnForExecuteApi('*')
        });

        props.api.root.addResource('user').addMethod('GET', userLambdaIntegration, { authorizer: props.lambdAuth, authorizationType: AuthorizationType.CUSTOM });

    }
}
