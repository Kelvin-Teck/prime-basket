import APIException from ".";

export class BadRequest extends APIException {
  constructor(message = "The data you passed is invalid", details?: any) {
    super(400, message, details);
  }
}
