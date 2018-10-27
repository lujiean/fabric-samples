import { SmartContractBase } from '../../core/lib/smartcontract-base';

export abstract class BcBankAccount extends SmartContractBase {

  constructor(stubHelper: any, logger: any) {
    super(stubHelper, logger);
  }

  public abstract async newAccount(param: string): Promise<any>;

  public abstract async updateAccount(param: string): Promise<any>;

  public abstract async deleteAccount(param: string): Promise<any>;

  public abstract async getAccount(param: string): Promise<any>;

  public abstract async queryAllAccount(param: string): Promise<any>;
}
