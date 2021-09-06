import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";

const serverlessConfiguration: AWS = {
  service: "serverless-first",
  frameworkVersion: "2",
  custom: {
    region: "${opt:region, self:provider.region}",
    stage: "${opt:stage, self: provider.stage}",
    list_table: "${self:service}-list-table-${opt:stage, self:provider.stage}",
    tasks_table:
      "${self:service}-tasks-table-${opt:stage, self:provider.stage}",
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput:
      "${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}",
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
      REGION: "${self:custom.region}",
      STAGE: "${self:custom.stage}",
      LIST_TABLE: "${self:custom.list_table}",
      TASKS_TABLE: "${self:custom.tasks_table}",
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
    Resources: {
      ListTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          TableName: "${self:provider.environment.LIST_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.TABLE_THROUGHPUT}",
            WriteCapacityUnits: "${self:custom.TABLE_THROUGHPUT}",
          },
        },
      },
      TasksTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          TableName: "${self:provider.environment.TASKS_TABLE}",
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "listId", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
            { AttributeName: "listId", KeyType: "RANGE" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.TABLE_THROUGHPUT}",
            WriteCapacityUnits: "${self:custom.TABLE_THROUGHPUT}",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
