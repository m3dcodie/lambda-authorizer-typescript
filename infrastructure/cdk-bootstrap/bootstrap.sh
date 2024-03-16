#!/bin/bash

# main account
ACCOUNT=180012206345

PROFILE=$1

REGION=ap-southeast-2

# ApplicationID is used as the suffix for the name of CDK bootstrap stacks.
# It should be a unique name. If a name has already been used in an AWS account, bootstrapping would fail.

# The bootstrap qualifier is a string that is added to the names of all resources in a bootstrap stack.
# To use this CDKToolkit, you must specify `@aws-cdk/core:bootstrapQualifier` in cdk.context.json to match the qualifier.

# By default, the lower case of the ApplicationID is used as the qualifier.
# If a bootstrap qualifier is too long, it would result in resource names exceeding the length limit and cause a bootstrapping failure.
# If this happens, you need to shorten the BootstrapQualifier and try again.
# The default bootstrap qualifier used by AWS CDK is 9-character long.
ApplicationID=APIAUTH
BootstrapQualifier=${ApplicationID,,}

set -e
echo "Bootstrapping CDK for ${ApplicationID}"

aws cloudformation deploy --template-file ./cdk.yaml \
    --stack-name CDKInit${ApplicationID} \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides BootstrapQualifier=${BootstrapQualifier}\
    --profile $PROFILE


#REGION=$(echo $i | xargs)
echo "Bootstrapping $REGION"
npx aws-cdk@2.x bootstrap aws://${ACCOUNT}/${REGION} --toolkit-stack-name CDKToolkit${ApplicationID} \
        --cloudformation-execution-policies arn:aws:iam::$ACCOUNT:policy/CDKDeploymentPolicy${BootstrapQualifier} \
        --qualifier ${BootstrapQualifier}\
        --profile $PROFILE

