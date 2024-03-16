export class AWSPolicyGenerator {
    static generate(principalId: string, effect: string, resource: string, context?: any) {
        return {
            policyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }]
            },
            principalId: principalId
        }
    }
}