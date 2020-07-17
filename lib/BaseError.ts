class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export default BaseError;
