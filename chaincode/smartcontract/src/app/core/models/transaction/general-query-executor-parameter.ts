export class QuerySortDirect {
  public static readonly ASC = 'ASC';
  public static readonly DESC = 'DESC';
}

export class QueryOperator {
  public static readonly EQ = 'eq';
  public static readonly NE = 'ne';
  public static readonly GT = 'gt';
  public static readonly GTE = 'gte';
  public static readonly LT = 'lt';
  public static readonly LTE = 'lte';
  public static readonly IN = 'in';
  public static readonly SIZE = 'size';
}

export class GeneralQueryExecutorParameter {
  public model: string;
  public fields: QueryField[];
  public where: QueryConditionItem[];
  public sort: QueryFieldSort[];
  public index: string;
}

export class QueryConditionItem {
  public field: string;
  public operator: string;
  public value: string;
}

export class QueryFieldSort {
  public field: string;
  public direct: string;
}

export class QueryField {
  public field: string;
}
