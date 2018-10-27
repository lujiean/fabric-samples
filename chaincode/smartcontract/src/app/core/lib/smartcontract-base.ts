import { ScLogger } from '../utils/sclogger';
import { StubHelper } from '../utils/stubhelper';

/**
 * The SmartContractBase class is a base class of BC-Hub smart contract classes.
 */
export class SmartContractBase {
  protected logger: ScLogger;
  protected stubHelper: StubHelper;

  constructor(stubHelper: StubHelper, logger: ScLogger) {
    this.logger = logger;
    this.stubHelper = stubHelper;
  }
}
