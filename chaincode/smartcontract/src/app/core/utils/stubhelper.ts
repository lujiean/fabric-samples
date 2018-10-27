import {ClientIdentity, Stub} from 'fabric-shim';
import * as _ from 'lodash';
import {KV} from '../models/ws-query-interfaces';
import {Transform} from './datatransform';
import {Helpers} from './helpers';
import {ScLogger} from './sclogger';

/**
 *  The StubHelper is a wrapper around the `fabric-shim` Stub. Its a helper to automatically serialize and
 *  deserialize data being saved/retreived.
 */
export class StubHelper {

  private logger: ScLogger;
  private kvs: KV[];

  /**
   * @param {"fabric-shim".Stub} stub
   */
  constructor(private stub: Stub, logger: ScLogger, stateKVs: KV[]) {
    this.stub = stub;
    this.logger = logger;
    this.kvs = stateKVs;
  }

  /**
   * @returns {"fabric-shim".Stub}
   */
  public getStub(): Stub {
    return this.stub;
  }

  /**
   * Return the Client Identity
   *
   * @returns {"fabric-shim".ClientIdentity}
   */
  public getClientIdentity(): ClientIdentity {
    return new ClientIdentity(this.stub);
  }

  /**
   * Query the state and return a list of results.
   *
   * @param {string | Object} query - CouchDB query
   * @param keyValue - If the function should return an array with {KV} or just values
   * @returns {Promise<any>}
   */
  public async getQueryResultAsList(title: string, query: string | object, keyValue?: boolean): Promise<object[] | KV[]> {
    let queryString: string;
    queryString = _.isObject(query) ? JSON.stringify(query) : query as string;
    this.logger.debug(`Title: ${title} Query: ${Helpers.toOneline(queryString)}`);
    const iterator = await this.stub.getQueryResult(queryString);
    const result = keyValue ? await Transform.iteratorToKVList(iterator) : await Transform.iteratorToList(iterator);
    return result;
  }

  /**
   * Query the state by range
   *
   * @returns {Promise<any>}
   * @param startKey
   * @param endKey
   */
  public async getStateByRangeAsList(startKey: string, endKey: string): Promise<KV[]> {
    const iterator = await this.stub.getStateByRange(startKey, endKey);
    return Transform.iteratorToList(iterator);
  }

  /**
   * Fetch a history for a specific key and return a list of results.
   *
   * @returns {Promise<any>}
   * @param key
   */
  public async getHistoryForKeyAsList(key: string): Promise<object[]> {
    const iterator = await this.stub.getHistoryForKey(key);
    return Transform.iteratorToHistoryList(iterator);
  }

  /**
   *   Deletes all objects returned by the query
   *   @param {Object} query the query
   */
  public async deleteAllReturnedByQuery(query: string | object): Promise<KV[]> {
    const allResults = (await this.getQueryResultAsList('deleteAllReturnedByQuery', query, true)) as KV[];
    return Promise.all(allResults.map((record: KV) => this.deleteState(record.key)));
  }

  /**
   * Delete the asset by the key.
   */
  public deleteState(key: string): any {
    this.putState(key, null);
  }

  /**
   * Serializes the value and store it on the state db.
   *
   * @param {String} key
   * @param value
   */
  public putState(key: string, value: any): any {
    const item: KV = {key: '', value: {}};
    item.key = key;
    item.value = value;
    this.kvs.push(item);
  }

  /**
   * 配列に記入したデータはLedgerに書き込む。
   */
  public async commitState(): Promise<void> {
    if (this.kvs) {
      for (const item of this.kvs) {
        if (item.value) {
          await this.stub.putState(item.key, Transform.serialize(item.value));
        } else {
          await this.stub.deleteState(item.key);
        }
      }
    }
    this.kvs = null;
  }

  /**
   * @param {String} key
   *
   * @return the state for the given key parsed as an Object
   */
  public async getStateAsObject(key: string): Promise<Object> {
    const valueAsBytes = await this.stub.getState(key);
    if (!valueAsBytes || valueAsBytes.toString().length <= 0) {
      return null;
    }

    return Transform.bufferToObject(valueAsBytes);
  }

  /**
   * @param {String} key
   *
   * @return the state for the given key parsed as a String
   */
  public async getStateAsString(key: string): Promise<string> {

    const valueAsBytes = await this.stub.getState(key);

    if (!valueAsBytes || valueAsBytes.toString().length <= 0) {
      return null;
    }

    return Transform.bufferToString(valueAsBytes);
  }

  /**
   * @param {String} key
   *
   * @return the state for the given key parsed as a Date
   */
  public async getStateAsDate(key: string): Promise<Date> {

    const valueAsBytes = await this.stub.getState(key);

    if (!valueAsBytes || valueAsBytes.toString().length <= 0) {
      return null;
    }

    return Transform.bufferToDate(valueAsBytes);
  }

  /**
   * @return the Transaction date as a Javascript Date Object.
   */
  public getTxDate(): Date {
    return this.stub.getTxTimestamp().toDate();
  }

  /**
   * Publish an event to the Blockchain
   *
   * @param {String} name
   * @param {Object} payload
   */
  public setEvent(name: string, payload: object) {
    let bufferedPayload;
    bufferedPayload = Buffer.isBuffer(payload) ? payload : Buffer.from(JSON.stringify(payload));
    this.stub.setEvent(name, bufferedPayload);
  }

  public async exists(key: string): Promise<boolean> {
    const asset = await this.getStateAsString(key);
    return asset !== null;
  }
}
