export class SystemError {
  private code: string;

  constructor(errorCode: string) {
    this.code = errorCode;
  }

  public get errorCode(): string {
    return this.code;
  }
}
