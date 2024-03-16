import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EndpointType, RestApi } from "aws-cdk-lib/aws-apigateway"; // Import the 'apigateway' module
import { UserAPI } from "../../functions/users/user";
import { AnyPrincipal, Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaAuthorizer } from "../../functions/authorizer/lambda-authorizer.cdk"


export interface ApiCdkStackProps extends StackProps {
    resourcePrefix: string;
}

export class ApiCdkStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiCdkStackProps) {
        super(scope, id, props);

        //Start API
        const apiInvokePolicy = new PolicyDocument({
            statements: [new PolicyStatement({
                actions: [
                    'execute-api:Invoke'
                ],
                principals: [new AnyPrincipal()],
                effect: Effect.ALLOW,
                resources: ['execute-api:/*/*/*'],

            })],
        });

        const api = new RestApi(this, 'rest-api', {
            restApiName: `${props.resourcePrefix}-api`,
            description: `This service is for learning`,
            endpointConfiguration: {
                types: [EndpointType.REGIONAL]
            },
            policy: apiInvokePolicy
        });

        const lambdAuth = new LambdaAuthorizer(this, 'lambda-authorizer', {
            resourcePrefix: props.resourcePrefix
        });
        
        //End API 

        //User API resource
        new UserAPI(this, 'user-api', { api, resourcePrefix: props.resourcePrefix, lambdAuth: lambdAuth.lambdaAuthorizer });

    }
}