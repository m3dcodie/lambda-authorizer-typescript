# About The Project

This project is about AWS lambda authorizer. That's mean you can secure your AWS APIGateway API's with custom authorization. You can use Auth0 or any other authorization provider that uses JWT tokens.

This project can be used as base for your next project. Everything has setup, create your REST API, pass on the lambda authorizer, just provide the details in auth.config.

## Built with

This project is based on the following.

- AWS APIGateway
- Lambda authorizer
- NodeJs
- Typescript
- Infrastructure as a code, AWS CDK.

## Getting Started

Install Nodejs 18.X.X or above + & Typescript 5.X.X.
Follow the instructions

Prerequisites

- [NodeJs](https://nodejs.org/en/download)
- [NodeJs with Typescript](https://nodejs.org/en/learn/getting-started/)nodejs-with-typescript
- [Typescript](https://www.typescriptlang.org/download)

  `npm install npm@latest -g`

  `npm install typescript --save-dev`

- [AWS Cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) confgiure as well with your AWS credentials.
- [AWSume (Optional)](https://awsu.me/general/quickstart.html)
- [WSL (Optional)](https://learn.microsoft.com/en-us/windows/wsl/install)

## Installation

1- Clone the repo

`git clone git@github.com:m3dcodie/lambda-authorizer-typescript.git`

2- Install NPM packages

`npm install`

3- [Bootstrap](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)

Bootstrapping is the process of preparing an environment for deployment. Bootstrapping is a one-time action that you must perform for every environment that you deploy resources into.

This file [infrastructure/cdk-bootstrap/cdk.yaml](./infrastructure/cdk-bootstrap/cdk.yaml) contains the permissions neccessary to deploy this project into AWS account.

You can configure AWS account and AWS region to bootstrap in this file [infrastructure/cdk-bootstrap/bootstrap.sh](infrastructure/cdk-bootstrap/bootstrap.sh).

4- Assume the AWS role

`awsume <profile>`

`cd infrastructure/cdk-bootstrap/

./bootstrap.sh [profile]

#set permissions if required

chmod 755 ./bootstrap.sh`

5- Deploy the solution

- `npm run build` compile typescript to js

- `cd infrastructure/app/deploy1/`

- Modify the file
  `vi infrastructure/app/deploy1/cdk.context.json`
  Update with your account and other tag details.

- `npx cdk deploy ApiCdkStack --profile [profile name]`

Confirm the changes with `y`.

### Testing

Once deployed surccessfully, the CDK will output the API gateway endpoint or you can get from AWS APIgateway console.

Once you got Bearer token.

`curl --request GET \
  --url http://path_to_your_api/ \
  --header 'authorization: Bearer <token here>'`

or through AWS Gateway
[AWS APIGateway](/assets/images/APIGateway-test.png)
