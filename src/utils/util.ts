import ResponseModel from "src/models/response.model";
import { validate } from "validate.js/validate";

type IGeneric<T> = {
  [index in string | number | any]: T;
};

/**
 * Validate values against constraints
 * @param values
 * @param constraints
 * @return {Promise<any>}
 */
export const validateAgainstConstraints = (
  values: IGeneric<string>,
  constraints: IGeneric<Record<string, unknown>>
) => {
  return new Promise<void>((resolve, reject) => {
    const validation = validate(values, constraints);

    console.log(validation);

    if (typeof validation === "undefined") {
      resolve();
    } else {
      reject(
        new ResponseModel({ validation }, 400, "required fields are missing")
      );
    }
  });
};

export function createChunks<T>(data: T[], chunkSize: number) {
  const urlChunks = [];
  let batchIterator = 0;
  while (batchIterator < data.length) {
    urlChunks.push(data.slice(batchIterator, (batchIterator += chunkSize)));
  }
  return urlChunks;
}
