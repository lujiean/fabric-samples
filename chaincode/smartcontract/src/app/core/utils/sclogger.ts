import shim = require('fabric-shim');
import {LoggerStatic} from 'winston';

export class ScLogger {

  private logger: LoggerStatic;
  private refid: string;
  private fnc: string;

  constructor(channelId: string, name: string) {
    this.logger = shim.newLogger(channelId + ' - ' + name);
  }

  public info(msg: string, ...meta: any[]) {
    // ログ領域が枯渇するのを防止するため、最大出力桁数を設ける
    this.log('info', msg.slice(0, 500), meta);
  }

  public error(msg: string, ...meta: any[]) {
    this.log('error', msg, meta);
  }

  public debug(msg: string, ...meta: any[]) {
    // ログ領域が枯渇するのを防止するため、最大出力桁数を設ける
    this.log('debug', msg.slice(0, 500), meta);
  }

  private log(level: string, message: string, ...meta: any[]) {
    let msg = '';
    if (this.refid && this.refid !== '') {
      msg += `[${this.refid}] `;
    }
    if (this.fnc && this.fnc !== '') {
      msg += `${this.fnc}: `;
    }

    msg += message;
    if (level === 'info') {
      if (meta.length > 0 && meta[0].lenthg > 0) {
        this.logger.info(msg, meta);
      } else {
        this.logger.info(msg);
      }
    } else if (level === 'error') {
      if (meta.length > 0 && meta[0].lenthg > 0) {
        this.logger.error(msg, meta);
      } else {
        this.logger.error(msg);
      }
    } else if (level === 'debug') {
      if (meta.length > 0 && meta[0].lenthg > 0) {
        this.logger.debug(msg, meta);
      } else {
        this.logger.debug(msg);
      }
    } else {
      this.logger.warn(`Unsupported logger level(${level}). ${msg}`, meta);
    }
  }

  public set referenceId(referenceId: string) {
    this.refid = referenceId;
  }

  public get referenceId(): string {
    return this.refid;
  }

  public set functionName(fucntionName: string) {
    this.fnc = fucntionName;
  }

  public get functionName(): string {
    return this.fnc;
  }
}
