import { StubHelper } from '../utils/stubhelper';
import { CouchDbQuery, KV, QueryBuilder } from './';

export class BaseModel<T> {
  public select(title: string, conditions: QueryBuilder<T>, stubHelper: StubHelper, keyValue = false): Promise<object[] | KV[]> {

    const query: CouchDbQuery<T> = {
      selector: {
        $and: conditions.conditions.filter((val) => {
          return val != null;
        })
      }
    };
    if (conditions.order) {
      query.sort = conditions.order;
    }
    if (conditions.fields) {
      query.fields = conditions.fields;
    }
    if (conditions.index) {
      query.use_index = conditions.index;
    }

    return stubHelper.getQueryResultAsList(title, query, keyValue);
  }

  public selectOnOr(title: string, andConditions: Array<QueryBuilder<T>>, stubHelper: StubHelper, keyValue = false):
    Promise<object[] | KV[]> {

    const query: CouchDbQuery<T> = {
      selector: {}
    };

    query.selector.$or = [];
    for (const andCondition of andConditions) {
      query.selector.$or.push(
        {
          $and: andCondition.conditions.filter((val) => {
            return val != null;
          })
        }
      );
    }

    return stubHelper.getQueryResultAsList(title, query, keyValue);
  }
}
