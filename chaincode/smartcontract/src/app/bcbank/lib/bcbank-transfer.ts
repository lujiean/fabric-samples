import { SmartContractBase } from '../../core/lib/smartcontract-base';

export abstract class BcBankTransfer extends SmartContractBase {

  constructor(stubHelper: any, logger: any) {
    super(stubHelper, logger);
  }

  public abstract async transfer(param1: string, param2: string, bal: number): Promise<any>;

  public abstract async balance(param: string): Promise<any>;
}
