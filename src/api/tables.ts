import {fetchJSON} from "chums-components";
import {QueryResponse, TableResponse} from "../ducks/types";

export async function fetchTables(company:string):Promise<string[]> {
    try {
        const url = `/arches/api/sage-tables.php`;
        const {tables} = await fetchJSON<{tables: string[] }>(url, {credentials: 'same-origin'});
        return tables;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchTables()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTables()", err);
        return Promise.reject(new Error('Error in fetchTables()'));
    }
}

export async function fetchTable(company:string, table:string):Promise<TableResponse> {
    try {
        const url = `/arches/api/sage-tables.php`;
        const query = new URLSearchParams();
        query.set('table', table);
        return await fetchJSON<TableResponse>(`${url}?${query.toString()}`, {credentials: 'same-origin'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchTable()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTable()", err);
        return Promise.reject(new Error('Error in fetchTable()'));
    }
}

export async function fetchResult(company:string, sql:string, limit: number, offset: number):Promise<QueryResponse> {
    try {
        const url = `/node-sage/api/CHI/query/${encodeURIComponent(limit)}/${encodeURIComponent(offset)}`;
        const body = JSON.stringify({company, limit, offset, query: sql});
        return await fetchJSON<QueryResponse>(url, {credentials: 'same-origin', method: 'POST', body});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchResult()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchResult()", err);
        return Promise.reject(new Error('Error in fetchResult()'));
    }
}
