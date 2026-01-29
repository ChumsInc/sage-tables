import {fetchJSON} from "@chumsinc/ui-utils";
import type {TableResponse} from "../types";

export async function fetchTables(): Promise<string[]> {
    try {
        const url = `/sage/api/sage-tables.php`;
        const res = await fetchJSON<{ tables: string[] }>(url, {credentials: 'same-origin'});
        return res?.tables ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchTables()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTables()", err);
        return Promise.reject(new Error('Error in fetchTables()'));
    }
}

export async function fetchTable(table: string): Promise<TableResponse | null> {
    try {
        const url = `/sage/api/sage-tables.php`;
        const query = new URLSearchParams();
        query.set('table', table);
        return await fetchJSON<TableResponse>(`${url}?${query.toString()}`, {credentials: 'same-origin'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchTable()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTable()", err);
        return Promise.reject(new Error('Error in fetchTable()'));
    }
}
