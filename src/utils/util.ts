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
  constraints: IGeneric<object>
) => {
  return new Promise<void>((resolve, reject) => {
    const validation = validate(values, constraints);

    if (typeof validation == null) {
      resolve();
    } else {
      reject(
        new ResponseModel({ validation }, 400, "required fields are missing")
      );
    }
  });
};
