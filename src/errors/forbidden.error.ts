import APIException from ".";

export default class ForbiddenError extends APIException {
  constructor(error = "") {
    super(403, error || "You are not authorized to perform this action", error);
  }
}
