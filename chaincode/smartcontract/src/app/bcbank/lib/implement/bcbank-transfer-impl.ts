import * as Yup from 'yup';

import { SystemError } from '../../../core/errors/system-error';
import { QueryBuilder } from '../../../core/models';
import { Helpers } from '../../../core/utils/helpers';
import { BcAccount, SexType } from '../../models/asset/bc-account';
import { BcBankDocType } from '../../models/bc-doctype';
// import { QueryAllAccountParam } from '../../models/transation/bc-account-request';
import { AllAccountRequestModel } from '../../models/transation/bc-account-request.model';
import { BcBankTransfer } from '../bcbank-transfer';

export class BcBankTransferImpl extends BcBankTransfer {

  public async transfer(param1: string, param2: string, bal: number): Promise<any> {
    // #account1 
    const query1: QueryBuilder<BcAccount> = {
      conditions: [
        {docType: BcBankDocType.BC_ACCOUNT},
        param1 ? {user: {$eq: param1}} : null,
      ]
    };
  
    const accounts1: BcAccount[] =
      await (new AllAccountRequestModel())
        .select('queryAllAccount', query1, this.stubHelper) as BcAccount[];

    //#account2
    const query2: QueryBuilder<BcAccount> = {
      conditions: [
        {docType: BcBankDocType.BC_ACCOUNT},
        param2 ? {user: {$eq: param2}} : null,
      ]
    };

    const accounts2: BcAccount[] =
      await (new AllAccountRequestModel())
        .select('queryAllAccount', query2, this.stubHelper) as BcAccount[];

    //# check and transfer
    if(accounts1[0].balance - bal < 0){
      throw new SystemError('NOT_ENOUGH_MONEY');
    }else{
      accounts1[0].balance = accounts1[0].balance - bal;
      accounts2[0].balance = accounts2[0].balance + bal;

      const key1 = Helpers.generateHashCode(JSON.stringify(accounts1));
      await this.stubHelper.putState(key1, accounts1);
      const key2 = Helpers.generateHashCode(JSON.stringify(accounts1));
      await this.stubHelper.putState(key2, accounts2);
    }

    // throw new Error('Method not implemented.');
  }

  public async balance(param: string): Promise<any> {
    const params = await this.checkNewAccountParam(param);

    const account = new BcAccount();
    account.user = params.user;
    account.age = params.age;
    account.sex = params.sex;
    account.phoneNumber = params.phoneNumber;
    account.requestDate = params.requestDate;
    account.balance = params.balance;

    const key = Helpers.generateHashCode(JSON.stringify(account));

    this.logger.debug(`key: ${key}`);
    this.logger.debug(`object: ${await this.stubHelper.getStateAsString(key)}`);
    if (await this.stubHelper.exists(key)) {
      // get account
      const query: QueryBuilder<BcAccount> = {
        conditions: [
          {docType: BcBankDocType.BC_ACCOUNT},
          account.user ? {user: {$eq: account.user}} : null,
        ]
      };
  
      const accounts: BcAccount[] =
        await (new AllAccountRequestModel())
          .select('queryAllAccount', query, this.stubHelper) as BcAccount[];
  
      // 业务处理
      return accounts[0].balance;
    }
    else{
      throw new SystemError('ACCOUNT_NOT_EXIST');
    }
    // throw new Error('Method not implemented.');
  }

  private async checkNewAccountParam(param: string): Promise<BcAccount> {
    return Helpers.checkArgs<BcAccount>(param, Yup.object().shape({
      user: Yup.string().required(),
      sex: Yup.string().required().oneOf([SexType.MALE, SexType.FEMALE]),
      age: Yup.number().required(),
      phoneNumber: Yup.string().required(),
      requestDate: Yup.date().required(),
    }));
  }
}
