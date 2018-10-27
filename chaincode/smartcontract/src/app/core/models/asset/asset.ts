export class DocType {
  public static readonly PAYMENT_TOKEN_ISSUE_REQUEST = 'PaymentTokenIssueRequest';
  public static readonly PAYMENT_TOKEN_EXCHANGE_REQUEST = 'PaymentTokenExchangeRequest';
  public static readonly PAYMENT_TOKEN_BURNUP_REQUEST = 'PaymentTokenBurnupRequest';
  public static readonly PAYMENT_TOKEN = 'PaymentToken';
  public static readonly EXCHANGE_RATE = 'PaymentTokenExchangeRate';
  public static readonly WALLET_ADDRESS_FREEZE_LIST = 'WalletAddressFreezeList';
  public static readonly TRANSACTION_POLICY = 'TransactionPolicy';
}

export class Asset {
  public docType;
  constructor(docType) {
    this.docType = docType;
  }
}
