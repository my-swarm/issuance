export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export class MetamaskNotReadyError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, MetamaskNotReadyError.prototype);
  }
}

export class InvalidStateError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, InvalidStateError.prototype);
  }
}
