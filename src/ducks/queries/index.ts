import type {ActionStatus, Query, QueryChangeProps} from "../../types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {executeQuery} from "./actions";
import {selectCurrentTab} from "@/ducks/tabs/selectors.ts";
import {defaultSort} from "@/src/utils.ts";
import {dataSorter} from "@/ducks/queries/utils.ts";
import {closeTab} from "@/ducks/tabs/actions.ts";

const adapter = createEntityAdapter<Query, string>({
    selectId: (query) => query.key,
    sortComparer: (a, b) => a.key.localeCompare(b.key),
})

const selectors = adapter.getSelectors();

export interface QueriesState {
    status: ActionStatus;
}

const initialQueriesState: QueriesState = {
    status: "idle",
}

const queriesSlice = createSlice({
    name: 'queries',
    initialState: adapter.getInitialState(initialQueriesState),
    reducers: {
        addQuery: (state, action: PayloadAction<Query>) => {
            adapter.addOne(state, action.payload);
        },
        closeQuery: (state, action: PayloadAction<string>) => {
            adapter.removeOne(state, action.payload);
        },
        updateQuery: (state, action: PayloadAction<QueryChangeProps>) => {
            adapter.updateOne(state, {id: action.payload.key, changes: action.payload});
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(executeQuery.pending, (state, action) => {
                const key = action.meta.arg.key;
                state.status = 'pending';
                adapter.updateOne(state, {
                    id: key,
                    changes: {
                        status: 'pending',
                        error: null,
                        sql: action.meta.arg.sql
                    }
                });
            })
            .addCase(executeQuery.fulfilled, (state, action) => {
                const key = action.meta.arg.key;
                state.status = 'idle';
                adapter.updateOne(state, {
                    id: key,
                    changes: {
                        status: 'idle',
                        error: action.payload?.Error ?? null,
                        response: action.payload,
                        page: 0,
                    }
                });
            })
            .addCase(executeQuery.rejected, (state, action) => {
                const key = action.meta.arg.key;
                state.status = 'rejected';
                adapter.updateOne(state, {
                    id: key,
                    changes: {
                        status: 'rejected',
                        error: action.error.message ?? null
                    }
                })
            })
            .addCase(closeTab, (state, action) => {
                adapter.removeOne(state, action.payload);
            })
    },
    selectors: {
        selectQueryList: (state) => selectors.selectAll(state),
        selectQueryStatus: (state) => state.status,
    }
})
export default queriesSlice;
export const {closeQuery, updateQuery, addQuery} = queriesSlice.actions;
export const {selectQueryList, selectQueryStatus} = queriesSlice.selectors;

export const selectCurrentQuery = createSelector(
    [selectQueryList, selectCurrentTab],
    (list, tab) => {
        const query = list.find(q => q.key === tab);
        return query ?? null;
    }
);

export const selectCurrentQueryDataLength = createSelector(
    [selectCurrentQuery],
    (query) => {
        if (!query || !query.response) {
            return 0;
        }
        return query.response.Data.length;
    }
)

export const selectCurrentQueryPagedData = createSelector(
    [selectCurrentQuery],
    (query) => {
        const data = query?.response?.Data ?? [];
        const sort = query?.sort ?? defaultSort;
        const page = query?.page ?? 0;
        const rowPerPage = query?.rowsPerPage ?? 10;

        return [...data].sort(dataSorter(sort))
            .slice(page * rowPerPage, (page + 1) * rowPerPage);
    }
)

export const selectCurrentQueryData = createSelector(
    [selectCurrentQuery],
    (query) => query?.response?.Data ?? []
)


export const selectCurrentQueryFields = createSelector(
    [selectCurrentQuery],
    (query) => {
        return query?.response?.Fields ?? [];
    }
)

export const selectCurrentQueryDuration  = createSelector(
    [selectCurrentQuery],
    (query) => {
        return query?.response?.timings?.duration ?? 0;
    }
)

export const selectQuerySql = createSelector(
    [selectCurrentQuery],
    (query) => {
        return query?.sql ?? '';
    }
)

export const selectCurrentQuerySort = createSelector(
    [selectCurrentQuery],
    (query) => {
        return query?.sort ?? defaultSort;
    }
)

export const selectCurrentQueryError = createSelector(
    [selectCurrentQuery],
    (query) => query?.response?.Error ?? null
)

export const selectCurrentQueryPaginationProps = createSelector(
    [selectCurrentQuery],
    (query) => {
        return {
            page: query?.page ?? 0,
            rowsPerPage: query?.rowsPerPage ?? 10,
        }
    }
)
