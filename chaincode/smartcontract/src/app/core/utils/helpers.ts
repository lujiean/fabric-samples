import crypto from 'crypto';
import {SystemError} from '../errors/system-error';

export enum Direct {
  ASC = 'asc',
  DESC = 'desc'
}

export class IPropertyOrder {
  [name: string]: Direct;
}

/**
 * helper functions
 */
export class Helpers {

  /**
   * Check first argument
   * try to cast object using yup
   * validate arguments against predefined types using yup
   * return validated object
   *
   * @static
   * @template T
   * @param object
   * @param {*} yupSchema
   * @returns {Promise<T>}
   * @memberof Helpers
   */
  public static checkArgs<T>(object: Object, yupSchema: any): Promise<T> {

    if (!object || !yupSchema) {
      return Promise.reject(new SystemError('VALIDATION-FUNCTION-FAILURE'));
    }

    return yupSchema.validate(object)
      .then((validatedObject: T) => {
        return validatedObject;
      })
      .catch((error: any) => {
        throw error;
      });
  }

  public static clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      const _copy = new Date();
      _copy.setTime(obj.getTime());
      return _copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      const _copy = [];
      for (const iterator of obj) {
        _copy.push(this.clone(iterator));
      }
      return _copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      const _copy = {};
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          _copy[attr] = this.clone(obj[attr]);
        }
      }
      return _copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  /**
   * 指定した文字列よりハッシュ値を生成する。
   * 暗号化ではなくUniqueIDの生成のために用いるので、衝突耐性より速度を優先すべくsha1-base64でハッシュを作る。
   */
  public static generateHashCode(source: string): string {
    return crypto.createHash('sha1').update(source).digest('base64');
  }

  /**
   * 配列データは文字列の転換する
   */
  public static convertArrayToString(elements: string[]): string {
    let result: string = '';
    if (elements && elements.length > 0) {
      for (const e of elements) {
        result += result.length > 0 ? `,\"${e}\"` : `\"${e}\"`;
      }
    }
    return result;
  }

  /**
   * 配列のソースメソッド
   */
  public static SortByProps<T extends object>(item1: T, item2: T, ...props: IPropertyOrder[]) {
    const cps: number[] = [];
    let asc = true;
    if (props.length < 1) {
      for (const p in item1) {
        if (item1[p] > item2[p]) {
          cps.push(1);
          break;
        } else if (item1[p] === item2[p]) {
          cps.push(0);
        } else {
          cps.push(-1);
          break;
        }
      }
    } else {
      for (const prop of props) {
        for (const o in prop) {
          asc = prop[o] === Direct.ASC;
          if (item1[o] > item2[o]) {
            cps.push(asc ? 1 : -1);
            break;
          } else if (item1[o] === item2[o]) {
            cps.push(0);
          } else {
            cps.push(asc ? -1 : 1);
            break;
          }
        }
      }
    }

    for (const cp of cps) {
      if (cp === 1 || cp === -1) {
        return cp;
      }
    }
    return 0;
  }

  /**
   * 文字列から改行を除去する。
   * Kibanaでログを見やすくするために使う。
   *
   * @param string source - 改行を含む文字列
   * @returns {string}
   */
  public static toOneline(source: string): string {
    return source.replace(/\r\n|\r|\n/g, ' ');
  }

  /**
   * クラスの中で定義している定数名を配列で返す。
   *
   * @param c クラス
   * @returns {string[]}
   */
  public static getStaticValueOfParam(c: any): string[] {
    const values: string[] = [];

    for (const key in c) {
      if (c.hasOwnProperty(key)) {
        values.push(c[key]);
      }
    }

    return values;
  }
}
