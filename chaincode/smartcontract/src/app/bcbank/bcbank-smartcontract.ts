import { Chaincode } from '../core/lib/chaincode';
import { StubHelper } from '../core/utils/stubhelper';
import { BcBankAccount } from './lib/bcbank-account';
import { BcBankAccountImpl } from './lib/implement/bcbank-account-impl';

export class BcBankSmartContract extends Chaincode {
  public async newAccountRequest(stubHelper: StubHelper, param: string): Promise<any> {
    const bankAccount: BcBankAccount = new BcBankAccountImpl(stubHelper, this.logger);
    return bankAccount.newAccount(param);
  }

  public async queryAllAccount(stubHelper: StubHelper, param: string): Promise<any> {
    const bankAccount: BcBankAccount = new BcBankAccountImpl(stubHelper, this.logger);
    return bankAccount.queryAllAccount(param);
  }
}
