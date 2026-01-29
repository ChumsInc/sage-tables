import type {Query, QueryResponse} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function execQuery(arg:Query):Promise<QueryResponse|null> {
    try {
        const params = new URLSearchParams();
        params.set('limit', `${arg.limit}`);
        params.set('offset', `${arg.offset}`)
        const url = '/node-sage/api/:company/query.json'
            .replace(':company', encodeURIComponent(arg.company));
        const res = await fetchJSON<QueryResponse>(url, {
            method: 'POST',
            body: JSON.stringify({
                query: arg.sql,
                company: arg.company,
                limit: arg.limit,
                offset: arg.offset,
            })
        });
        if (res) {
            res.timestamp = new Date().toISOString();
        }
        if (res?.Data) {
            res.Data = res.Data.map((row, index) => ({...row, _id: index}));
        }
        return res ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("execQuery()", err.message);
            return Promise.reject(err);
        }
        console.debug("execQuery()", err);
        return Promise.reject(new Error('Error in execQuery()'));
    }
}
