import { ChaincodeInterface, ChaincodeReponse, Stub } from 'fabric-shim';

import { SystemError } from '../errors/system-error';
import { Response } from '../models';
import { Transform } from '../utils/datatransform';
import { Helpers } from '../utils/helpers';
import { ScLogger } from '../utils/sclogger';
import { StubHelper } from '../utils/stubhelper';

import shim = require('fabric-shim');
/**
 * The Chaincode class is a base class containing handlers for the `Invoke()` and `Init()` function which are required
 * by `fabric-shim`. The `Init()` function can be overwritten by just implementing it in your Chaincode implementation
 * class.
 */
export class Chaincode implements ChaincodeInterface {

  public logger: ScLogger;

  /**
   * the name of the current chaincode.
   *
   * @readonly
   * @type {string}
   * @memberof Chaincode
   */
  private get name(): string {
    return this.constructor.name;
  }

  /**
   * The Init method is called when the Smart Contract is instantiated by the blockchain network
   * Best practice is to have any Ledger initialization in separate function -- see initLedger()
   *
   * @param {Stub} stub
   * @returns {Promise<ChaincodeReponse>}
   * @memberof Chaincode
   */
  public async Init(stub: Stub): Promise<ChaincodeReponse> {
    this.initLogger(stub);
    this.logger.debug(`Transaction ID: ${stub.getTxID()}`);
    this.logger.info(`Args: ${stub.getArgs().join(',')}`);
    this.logger.functionName = 'Init';

    const ret = stub.getFunctionAndParameters();

    return this.executeMethod('newAccountRequest', ret.params, stub, true);
  }

  /**
   * The Invoke method is called as a result of an application request to run the Smart Contract.
   * The calling application program has also specified the particular smart contract
   * function to be called, with arguments
   *
   * @param {Stub} stub
   * @returns {Promise<ChaincodeReponse>}
   * @memberof Chaincode
   */
  public async Invoke(stub: Stub): Promise<ChaincodeReponse> {
    const ret = stub.getFunctionAndParameters();
    const paramsObject = JSON.parse(ret.params[0]);
    this.initLogger(stub);
    // referenceId check
    if (paramsObject.referenceId) {
      this.logger.referenceId = paramsObject.referenceId;
    }
    this.logger.functionName = ret.fcn;
    this.logger.debug(`Transaction ID: ${stub.getTxID()}`);
    this.logger.info(`Args: ${ret.params[0]}`);

    this.logger.info('execute invoke()');

    return this.executeMethod(ret.fcn, ret.params, stub);
  }

  /**
   * Handle custom method execution
   *
   * @param {string} fcn
   * @param {string[]} params
   * @param stub
   * @param {boolean} silent
   * @returns {Promise<any>}
   */
  private async executeMethod(fcn: string, params: string[], stub: Stub, silent = false) {
    const method = this[fcn];
    let stateKVs = [];

    if (!method) {
      if (!silent) {
        this.logger.error(`no function of name: ${fcn} found`);
        return shim.error(Transform.serialize(
          new Response('ERROR', '', new SystemError('FUNCTION-NOTFOUND'))));
      } else {
        return shim.success(Transform.serialize(
          new Response('SUCCESS', '', new SystemError(''))));
      }
    }
    let result: any = '';

    try {
      this.logger.info('START');
      const stubHelper = new StubHelper(stub, this.logger, stateKVs);
      const payload = await method.call(this, stubHelper, params[0]);
      if (payload && !Buffer.isBuffer(payload)) {
        result = payload;
      }

      this.logger.info('END');
      await stubHelper.commitState();
      stateKVs = null;
      return shim.success(Transform.serialize(new Response('SUCCESS', result, new SystemError(''))));

    } catch (err) {
      stateKVs = null;
      if (err instanceof SystemError) {
        this.logger.error(`SystemError: ${JSON.stringify(err)}`);
        return shim.success(Transform.serialize(new Response('ERROR', '', err)));
      }

      if (err.name && err.name === 'ValidationError') {
        this.logger.info(`ValidationError: ${JSON.stringify(err)}`);
        return shim.success(Transform.serialize(
          new Response('ERROR', '', new SystemError('VALIDATION-ERROR'))));
      }

      this.logger.error(`chaincode executeMethod catch err: ${Helpers.toOneline(err.stack) || err}`);
      return shim.error(err);
    }
  }

  /**
   * ロガーを初期化する
   *
   * @param {Stub} stub
   */
  private initLogger(stub: Stub) {
    if (!this.logger) {
      this.logger = new ScLogger(stub.getChannelID(), this.name);
    }
  }
}
