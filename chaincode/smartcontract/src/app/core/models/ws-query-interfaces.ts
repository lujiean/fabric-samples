export interface KV {
  key: string;
  value: any;
}

export interface KeyModificationItem {
  is_delete: boolean;
  value: Object;
  timestamp: number;
  tx_id: string;
}

export type FieldsItem<T> = keyof T;

export type QueryCondition<T> = {
  [P in keyof T]?: string
  | number
  | boolean
  | { '$lte': string | number }
  | { '$lt': string | number }
  | { '$gte': string | number }
  | { '$gt': string | number }
  | { '$eq': string | number | boolean }
  | { '$ne': string | number | boolean }
  | { '$regex': string }
  | { '$size': number }
  | { '$in': Array<string | number> }
  | { '$elemMatch': { '$in': Array<string | number> }
    | { '$eq': string | number | boolean}}
};

export interface QueryBuilder<T> {
  conditions: Array<QueryCondition<T>>;
  fields?: Array<FieldsItem<T>>;
  order?: Array<{[P in keyof T]?: 'asc' | 'desc'}>;
  index?: string;
}

export interface CouchDbQuery<T> {
  selector: {
    '$or'?: Array<{'$and': Array<QueryCondition<T>>}>,
    '$and'?: Array<QueryCondition<T>>
  };
  fields?: Array<FieldsItem<T>>;
  sort?: Array<{[P in keyof T]?: 'asc' | 'desc'}>;
  use_index?: string;
}
