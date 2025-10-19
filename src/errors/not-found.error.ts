import APIException from ".";

export default class NotFoundError extends APIException {
  constructor(error = "") {
    super(404, error || "Resource does not exist", error);
  }
}
