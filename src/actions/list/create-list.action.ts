import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import ListModel from "../../models/list.model";
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/list/create.constraint.json";

export const createList: APIGatewayProxyHandler = (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(async () => {
      const databaseService = new DatabaseService();

      const listModel = new ListModel(requestData);
      const data = listModel.getEntityMappings();

      console.log(process.env.LIST_TABLE);

      const params = {
        TableName: process.env.LIST_TABLE,
        Item: {
          id: data.id,
          name: data.name,
          createdAt: data.timestamp,
          updateAt: data.timestamp,
        },
      };

      await databaseService.create(params);
      return data.id;
    })
    .then((listId) => {
      response = new ResponseModel(
        { listId },
        200,
        "To-do list successfully created"
      );
    })
    .catch((error) => {
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel({}, 500, "To-do list cannot be created");
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
