import APIException from ".";

export default class AlreadyExists extends APIException {
  constructor(error = "") {
    super(409, error || "This data already exists", error);
  }
}
