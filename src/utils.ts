import {CompanyCode, DataRow, Query, TableResponse} from "./types";
import {SortProps} from "chums-components";

export const noop = () => {};
export const now = () => new Date().valueOf();

export const getQueryKey = () => now().toString(36);

export const defaultSort:SortProps<DataRow> = {field: "_id", ascending: true};

export const emptyQuery = (company:CompanyCode):Query => ({
    key: '',
    company,
    limit: 100,
    offset: 0,
    sql: '',
    timestamp: null,
    response: null,
    dirty: false,
    status: 'idle',
    sort: {...defaultSort},
    page: 0,
    rowsPerPage: 10,
});


export function isQuery(value: Query|TableResponse):value is Query {
    return (value as Query).sql !== undefined;
}

export function isTableResponse(value:Query|TableResponse):value is TableResponse {
    return (value as TableResponse).tableName !== undefined;
}
