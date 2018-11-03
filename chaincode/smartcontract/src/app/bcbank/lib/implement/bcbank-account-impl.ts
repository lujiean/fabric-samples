import * as Yup from 'yup';

import { SystemError } from '../../../core/errors/system-error';
import { QueryBuilder } from '../../../core/models';
import { Helpers } from '../../../core/utils/helpers';
import { BcAccount, SexType } from '../../models/asset/bc-account';
import { BcBankDocType } from '../../models/bc-doctype';
import { QueryAllAccountParam } from '../../models/transation/bc-account-request';
import { AllAccountRequestModel } from '../../models/transation/bc-account-request.model';
import { BcBankAccount } from '../bcbank-account';

export class BcBankAccountImpl extends BcBankAccount {

  /**
   * 创建新的账户
   * 账户Key的生成方式以hash-key实现
   *
   * @param param
   */
  public async newAccount(param: string): Promise<any> {
    // 使用Yup来做Validation check
    const params = await this.checkNewAccountParam(param);

    const account = new BcAccount();
    account.user = params.user;
    account.age = params.age;
    account.sex = params.sex;
    account.phoneNumber = params.phoneNumber;
    account.requestDate = params.requestDate;

    const key = Helpers.generateHashCode(JSON.stringify(account));

    // 检查账户是否已经存在，如果存在这报错
    this.logger.debug(`key: ${key}`);
    this.logger.debug(`object: ${await this.stubHelper.getStateAsString(key)}`);
    if (await this.stubHelper.exists(key)) {
      throw new SystemError('ACCOUNT_EXIST');
    }

    // 如果不存在，则创建
    await this.stubHelper.putState(key, account);

    // 返回创建成功的response
    return {account: key};
  }

  public async updateAccount(param: string): Promise<any> {
    const params = await this.checkNewAccountParam(param);

    const account = new BcAccount();
    account.user = params.user;
    account.age = params.age;
    account.sex = params.sex;
    account.phoneNumber = params.phoneNumber;
    account.requestDate = params.requestDate;

    const key = Helpers.generateHashCode(JSON.stringify(account));

    this.logger.debug(`key: ${key}`);
    this.logger.debug(`object: ${await this.stubHelper.getStateAsString(key)}`);
    if (await this.stubHelper.exists(key)) {
      // update account
      await this.stubHelper.putState(key, account);
    }
    else{
      throw new SystemError('ACCOUNT_NOT_EXIST');
    }

    // throw new Error('Method not implemented.');
  }

  public async deleteAccount(param: string): Promise<any> {
    const params = await this.checkNewAccountParam(param);

    const account = new BcAccount();
    account.user = params.user;
    account.age = params.age;
    account.sex = params.sex;
    account.phoneNumber = params.phoneNumber;
    account.requestDate = params.requestDate;

    const key = Helpers.generateHashCode(JSON.stringify(account));

    this.logger.debug(`key: ${key}`);
    this.logger.debug(`object: ${await this.stubHelper.getStateAsString(key)}`);
    if (await this.stubHelper.exists(key)) {
      // update account
      await this.stubHelper.deleteState(key);
    }
    else{
      throw new SystemError('ACCOUNT_NOT_EXIST');
    }

    // throw new Error('Method not implemented.');
  }

  public async getAccount(param: string): Promise<any> {
    const params = await this.checkNewAccountParam(param);

    const account = new BcAccount();
    account.user = params.user;
    account.age = params.age;
    account.sex = params.sex;
    account.phoneNumber = params.phoneNumber;
    account.requestDate = params.requestDate;

    const key = Helpers.generateHashCode(JSON.stringify(account));

    this.logger.debug(`key: ${key}`);
    this.logger.debug(`object: ${await this.stubHelper.getStateAsString(key)}`);
    if (await this.stubHelper.exists(key)) {
      // get account
      // const accounts: BcAccount[] =
      // await (new AllAccountRequestModel())
      //   .select('queryAllAccount', query, this.stubHelper) as BcAccount[];

    // 业务处理
    // return accounts;
    }
    else{
      throw new SystemError('ACCOUNT_NOT_EXIST');
    }

    // throw new Error('Method not implemented.');
  }

  public async queryAllAccount(param: string): Promise<any> {
    const params = await this.checkQueryAllAccountParam(param);
    // validation check 略
    const query: QueryBuilder<BcAccount> = {
      conditions: [
        {docType: BcBankDocType.BC_ACCOUNT},
        params.dateFrom ? {requestDate: {$gte: params.dateFrom}} : null,
        params.dateEnd ? {requestDate: {$lte: params.dateEnd}} : null,
      ]
    };

    const accounts: BcAccount[] =
      await (new AllAccountRequestModel())
        .select('queryAllAccount', query, this.stubHelper) as BcAccount[];

    // 业务处理
    return accounts;
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

  private async checkQueryAllAccountParam(param: string): Promise<QueryAllAccountParam> {
    return Helpers.checkArgs<QueryAllAccountParam>(param, Yup.object().shape({
      dateFrom: Yup.date(),
      dateEnd: Yup.date(),
    }));
  }
}
