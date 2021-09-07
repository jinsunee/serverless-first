import type { AWS } from "@serverless/typescript";

import dynamoDbTables from "./resources/dynamodb-tables";

import functions from "./resources/functions";

const { REGION, STAGE, LIST_TABLE, TASKS_TABLE } = process.env;
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
    list_table: LIST_TABLE,
    tasks_table: TASKS_TABLE,
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
      endPoint: "http://localhost:3000",
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
      LIST_TABLE: LIST_TABLE,
      TASKS_TABLE: TASKS_TABLE,
      INVOKE_ENDPOINT: "http://localhost:4001",
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
  functions,
  resources: {
    Resources: dynamoDbTables,
  },
  useDotenv: true,
};

module.exports = serverlessConfiguration;
