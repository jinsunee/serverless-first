import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";

// DynamoDB
import dynamoDbTables from "./resources/dynamodb-tables";

const { REGION, STAGE } = process.env;
const service = "serverless-first";
const table_throughputs = {
  prod: 5,
  default: 1,
};

const serverlessConfiguration: AWS = {
  service,
  frameworkVersion: "2",
  custom: {
    region: REGION,
    stage: STAGE,
    list_table: "list",
    tasks_table: "tasks",
    table_throughputs,
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8008,
        isMemory: true,
        heapInitial: "200m",
        heapMax: "1g",
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        // noStart: true,
      },
    },
    ["serverless-offline"]: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"],
      },
    },
  },
  plugins: [
    "serverless-bundle",
    "serverless-offline",
    "serverless-dynamodb-local",
    "serverless-dotenv-plugin",
  ],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      REGION: REGION,
      STAGE: STAGE,
      LIST_TABLE: "list",
      TASKS_TABLE: "tasks",
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource: [
          { "Fn::GetAtt": ["ListTable", "Arn"] },
          { "Fn::GetAtt": ["TasksTable", "Arn"] },
        ],
      },
    ],
  },
  // import the function via paths
  functions: { hello },
  resources: {
    Resources: dynamoDbTables,
  },
};

module.exports = serverlessConfiguration;
