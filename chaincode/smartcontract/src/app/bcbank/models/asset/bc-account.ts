import { Asset } from '../../../core/models';
import { BcBankDocType } from '../bc-doctype';

export class SexType {
  public static readonly MALE = 'MALE';
  public static readonly FEMALE = 'FEMALE';
}

export class BcAccount extends Asset {
  public user: string;
  public sex: string;
  public age: number;
  public phoneNumber: string;
  public requestDate: string;
  public balance: number;
  constructor() {
    super(BcBankDocType.BC_ACCOUNT);
    this.user = '';
    this.sex = '';
    this.age = 0;
    this.phoneNumber = '';
    this.requestDate = '';
    this.balance = 0;
  }
}
