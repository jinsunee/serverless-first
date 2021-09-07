const ProvisionedThroughput = {
  ReadCapacityUnits: 1,
  WriteCapacityUnits: 1,
};

export default {
  ListTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Retain",
    Properties: {
      TableName: "list",
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
      ProvisionedThroughput,
    },
  },
  TasksTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Retain",
    Properties: {
      TableName: "tasks",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "listId", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
        { AttributeName: "listId", KeyType: "RANGE" },
      ],
      ProvisionedThroughput,
      GlobalSecondaryIndexes: [
        {
          IndexName: "list_index",
          KeySchema: [{ AttributeName: "listId", KeyType: "HASH" }],
          Projection: {
            // attributes to project into the index
            ProjectionType: "ALL",
          },
          ProvisionedThroughput,
        },
      ],
    },
  },
};
