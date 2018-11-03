// import * as Yup from 'yup';

// import { SystemError } from '../../../core/errors/system-error';
// import { QueryBuilder } from '../../../core/models';
// import { Helpers } from '../../../core/utils/helpers';
// import { BcAccount, SexType } from '../../models/asset/bc-account';
// import { BcBankDocType } from '../../models/bc-doctype';
// import { QueryAllAccountParam } from '../../models/transation/bc-account-request';
// import { AllAccountRequestModel } from '../../models/transation/bc-account-request.model';
import { BcBankTransfer } from '../bcbank-transfer';

export class BcBankTransferImpl extends BcBankTransfer {

  public async transfer(param: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async balance(param: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
