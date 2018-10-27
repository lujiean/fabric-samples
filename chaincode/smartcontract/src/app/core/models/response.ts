import { SystemError } from '../errors/system-error';

export class Response {
  public status: string;
  public result: any;
  public errors: SystemError;

  public constructor(status: string, result: any, errors: SystemError) {
    this.status = status;
    this.errors = errors;
    this.result = result === undefined || result === null ? '' : result;
  }
}
