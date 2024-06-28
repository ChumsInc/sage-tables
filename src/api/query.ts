import {Query, QueryResponse} from "../types";
import {fetchJSON} from "chums-components";

export async function execQuery(arg:Query):Promise<QueryResponse|null> {
    try {
        const url = '/node-sage/api/:company/query/:limit/:offset'
            .replace(':company', encodeURIComponent(arg.company))
            .replace(':limit', encodeURIComponent(arg.limit))
            .replace(':offset', encodeURIComponent(arg.offset));
        const res = await fetchJSON<QueryResponse>(url, {
            method: 'POST',
            body: JSON.stringify({
                query: arg.sql,
                company: arg.company,
                limit: arg.limit,
                offset: arg.offset,
            })
        });
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
