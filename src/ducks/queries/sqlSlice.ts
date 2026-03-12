import type {Query} from "@/src/types.ts";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {executeQuery} from "@/ducks/queries/actions.ts";
import {addTab, closeTab} from "@/ducks/tabs/actions.ts";
import {selectCurrentTab} from "@/ducks/tabs/selectors.ts";

export type QuerySQL = Pick<Query, 'key'|'sql'>;

const adapter = createEntityAdapter<QuerySQL, string>({
    selectId: (query) => query.key,
    sortComparer: (a, b) => a.key.localeCompare(b.key),
});
const selectors = adapter.getSelectors();

const sqlSlice = createSlice({
    name: 'querySQL',
    initialState: adapter.getInitialState(),
    reducers: {
        updateSQL: (state, action:PayloadAction<QuerySQL>) => {
            adapter.upsertOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(executeQuery.fulfilled, (state, action) => {
                const key = action.meta.arg.key;
                const sql = action.meta.arg.sql;
                adapter.upsertOne(state, {key, sql})
            })
            .addCase(addTab, (state, action) => {
                if (action.payload.type === 'query') {
                    const key = action.payload.key;
                    adapter.addOne(state, {key, sql: ''})
                }
            })
            .addCase(closeTab, (state, action) => {
                adapter.removeOne(state, action.payload);
            })
    },
    selectors: {
        selectSQLList: (state) => selectors.selectAll(state),
        selectSQLById: (state, key:string) => selectors.selectById(state, key),
    }
});

export default sqlSlice;
export const {updateSQL} = sqlSlice.actions;
export const {selectSQLList, selectSQLById} = sqlSlice.selectors;
export const selectCurrentSQL = createSelector(
    [selectSQLList, selectCurrentTab],
    (list, id) => {
        const el = list.find(q => q.key === id) ?? null
        return el?.sql ?? '';
    }
)
