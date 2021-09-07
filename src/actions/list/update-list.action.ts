import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/list/update.constraint.json";

export const updateList: APIGatewayProxyHandler = (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let response;

  const requestData = JSON.parse(event.body);
  const databaseService = new DatabaseService();

  const { LIST_TABLE } = process.env;
  const { listId, name } = requestData;

  return Promise.all([
    validateAgainstConstraints(requestData, requestConstraints),
    databaseService.getItem({ key: listId, tableName: LIST_TABLE }),
  ])
    .then(() => {
      const params = {
        TableName: LIST_TABLE,
        Key: {
          id: listId,
        },
        UpdateExpression: "set #naem = :name, updateAt = :timestamp",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": name,
          ":timestamp": new Date().getTime(),
        },
        ReturnValues: "UPDATED_NEW",
      };

      return databaseService.update(params);
    })
    .then((results) => {
      response = new ResponseModel(
        { ...results.Attributes },
        200,
        "To-do list successfully udpated"
      );
    })
    .catch((error) => {
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel({}, 500, "To-do list cannot be updated");
    })
    .then(() => {
      return response.generate();
    });
};
