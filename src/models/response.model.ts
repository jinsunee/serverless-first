// API Responses

import { STATUS_CODES } from "http";
import { Status } from "src/enums/status.enum";

// Interfaces
type ResponseHeader = { [header: string]: string | number | boolean };
interface IResponseBody {
  data: any;
  message: string;
  status?: string;
}

interface IResponse {
  statusCode: number;
  headers: ResponseHeader;
  body: string;
}

const STATUS_MESSAGES = {
  [STATUS_CODES.OK]: Status.SUCCESS,
  [STATUS_CODES.BAD_REQUEST]: Status.BAD_REQUEST,
  [STATUS_CODES.ERROR]: Status.ERROR,
};

const RESPONSE_HEADERS: ResponseHeader = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // CORS
  "Access-Control-Allow-Credentials": true, // HTTPS의 authoriaztion headers, cookies
};

export default class ResponseModel {
  private body: IResponseBody;
  private code: number;

  /**
   * ResponseModel Constructor
   * @param data
   * @param code
   * @param message
   */
  constructor(data = {}, code = 400, message = "") {
    this.body = {
      data,
      message,
      status: STATUS_MESSAGES[code],
    };
    this.code = code;
  }

  /**
   * Add or update a body variable
   * @param variable
   * @param value
   */
  setBodyVariable = (variable: string, value: string): void => {
    this.body[variable] = value;
  };

  /**
   * Set Data
   * @param data
   */
  setData = (data: any): void => {
    this.body.data = data;
  };

  /**
   * Set Status Code
   * @param code
   */
  setCode = (code: number): void => {
    this.code = code;
  };

  /**
   * Get Status Code
   * @return {*}
   */
  getCode = (): number => {
    return this.code;
  };

  /**
   * Set message
   * @param message
   */
  setMessage = (message: string) => {
    this.body.message = message;
  };

  /**
   * Get Message
   * @return {string|*}
   */
  getMessage = (): any => {
    return this.body.message;
  };

  /**
   * Generate a response
   * @returns {IResponse}
   */
  generate = (): IResponse => {
    return {
      statusCode: this.code,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify(this.body),
    };
  };
}
