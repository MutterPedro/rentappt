import * as httpStatus from 'http-status';

export default class ResponseError extends Error {
  readonly status: number;

  constructor(status: number = httpStatus.INTERNAL_SERVER_ERROR, message?: string) {
    //@ts-ignore
    super(message || httpStatus[status]);

    this.name = 'HttpResponseError';
    this.status = status;
  }
}
