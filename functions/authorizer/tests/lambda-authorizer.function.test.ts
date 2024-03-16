import { APIGatewayTokenAuthorizerEvent, Context } from 'aws-lambda';
import { handler } from '../lambda-authorizer.function'; // Import the handler function
import { Authorizer } from '../../../authorizer/auth/authorizer';
import { AWSPolicyGenerator } from '../../../authorizer/auth/aws-policy-generator';

const MockedAuthorizer = Authorizer as jest.MockedClass<typeof Authorizer>;

const event: APIGatewayTokenAuthorizerEvent = { type: "TOKEN", methodArn: "arn:123", authorizationToken: "Bearer 123" };
const context: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: "test",
    functionVersion: "1",
    invokedFunctionArn: "arn",
    memoryLimitInMB: "128",
    awsRequestId: "123",
    logGroupName: "/log/group/name",
    logStreamName: "23434",
    getRemainingTimeInMillis: () => { return 3 },
    done: () => { },
    fail: () => { },
    succeed: () => { }// Add 'async' keyword to the test function succeed
}

describe('Authorization token validation  tests', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        jest.clearAllMocks(); // Clear all mocks before each test
    });

    test('authorization token is valid', async () => { // Add 'async' keyword to the test function

        MockedAuthorizer.prototype.authorize = jest.fn().mockResolvedValueOnce({ sub: "123" });
        const resp = await handler(event, context);
        expect(MockedAuthorizer.prototype.authorize).toHaveBeenCalledTimes(1);
        const expectedResp = AWSPolicyGenerator.generate('123', 'Allow', "arn:123");
        expect(resp).toEqual(expectedResp);
    });

    test('authorization token is not valid', async () => {
        jest.mock('../../../authorizer/auth/authorizer', () => {
            return {
                Authorizer: jest.fn().mockRejectedValueOnce(() => {
                    return {
                        authorize: () => { new Error('Invalid token') },
                    }
                })
            };
        });

        MockedAuthorizer.prototype.authorize = jest.fn().mockRejectedValue(new Error('Invalid token'));
        const resp = await handler(event, context);
        expect(MockedAuthorizer.prototype.authorize).toHaveBeenCalledTimes(1);
        const expectedResp = AWSPolicyGenerator.generate('user', 'Deny', "arn:123");

        expect(resp).toEqual(expectedResp);
    });
});

