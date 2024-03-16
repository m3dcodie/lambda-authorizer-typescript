import { App } from "aws-cdk-lib";
import { ApiCdkStack } from "../../stacks/api.stack";


const app = new App();
const tags: { [key: string]: string } = app.node.tryGetContext("tags");
const applicationId = tags["ApplicationID"];

//Stacks came here
new ApiCdkStack(app, 'ApiStack', { resourcePrefix: applicationId });

app.synth();