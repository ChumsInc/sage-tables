import {ActionStatus, DataRow, Query, QueryChangeProps, QueryList, QueryResponse} from "../../types";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {defaultSort, emptyQuery, getQueryKey} from "../../utils";
import {RootState} from "../../app/configureStore";
import {closeTab} from "../tabs/actions";
import {execQuery} from "../../api/query";
import {SortProps} from "chums-components";
import {selectCurrentTab} from "../tabs/selectors";

export interface QueriesState {
    list: QueryList;
    status: ActionStatus;
}


const initialQueriesState: QueriesState = {
    list: {},
    status: "idle",
}

export const selectQueryList = (state:RootState) => state.queries.list;
export const selectQuery = (state: RootState, key: string) => state.queries.list[key];
export const selectQuerySort = (state: RootState, key: string) => state.queries.list[key].sort;
export const selectQueryLoading = (state: RootState, key: string) => state.queries.list[key].status === 'pending';
export const selectQueryResponse = (state: RootState, key: string) => state.queries.list[key].response;
export const selectQueryResponseFields = (state: RootState, key: string) => state.queries.list[key].response?.Fields ?? [];
export const selectQueryResponseData = (state: RootState, key: string) => state.queries.list[key].response?.Data ?? [];
export const selectQueryResponseQuery = (state: RootState, key: string) => state.queries.list[key].response?.Query ?? '';
export const selectQueryResponseError = (state: RootState, key: string) => state.queries.list[key].response?.Error ?? '';
export const selectQueryResponseTimings = (state: RootState, key: string) => state.queries.list[key].response?.timings ?? null;
export const selectQueryResponseCompany = (state: RootState, key: string) => state.queries.list[key].response?.Company ?? '';

export const selectCurrentQuery = createSelector(
    [selectQueryList, selectCurrentTab],
    (list, tab) => {
        if (!tab) {
            return null;
        }
        return list[tab] ?? null;
    }
)

const dataSorter = (sort:SortProps<DataRow>) => (a:DataRow, b:DataRow) => {
    const aVal = a[sort.field as string] ?? '';
    const bVal = b[sort.field as string] ?? '';
    return (aVal === bVal
            ? (a._id > b._id ? 1 : -1)
            : (aVal > bVal ? 1 : -1)
    ) * (sort.ascending ? 1 : -1)
}
export const selectSortedQueryResponse = createSelector(
    [selectQuerySort, selectQueryResponseFields, selectQueryResponseData,
        selectQueryResponseQuery, selectQueryResponseError, selectQueryResponseTimings, selectQueryResponseCompany],
    (sort, Fields, Data,
     Query, Error, timings, Company) => {
        const sorted = [...Data].sort(dataSorter(sort));
        return {
            Query, Fields, Error, timings, Company,
            Data: sorted,
        }
})

export const updateQuery = createAction<QueryChangeProps>('queries/setQuery');
export const setQuerySort = createAction<QueryChangeProps>('queries/setSort');

export const addQuery = createAction<Query>('queries/addQuery');
export const executeQuery = createAsyncThunk<QueryResponse, Query>(
    'queries/execute',
    async (arg) => {
        return await execQuery(arg)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const query = selectQuery(state, arg.key);
            return !!query.sql && query.status !== 'pending';
        }
    }
)

const queriesReducer = createReducer(initialQueriesState, (builder) => {
    builder
        .addCase(addQuery, (state, action) => {
            if (!state.list[action.payload.key]) {
                state.list[action.payload.key] = action.payload;
            }
        })
        .addCase(updateQuery, (state, action) => {
            const {key, ...props} = action.payload;
            if (state.list[key].status !== 'pending') {
                state.list[key] = {...state.list[key], ...props, changed: true};
            }
        })
        .addCase(closeTab, (state, action) => {
            delete state.list[action.payload];
        })
        .addCase(executeQuery.pending, (state, action) => {
            state.list[action.meta.arg.key].status = 'pending';
        })
        .addCase(executeQuery.fulfilled, (state, action) => {
            const {key} = action.meta.arg;
            if (state.list[key]) {
                state.list[key].status = 'fulfilled';
                state.list[key].response = action.payload;
            }
        })
        .addCase(executeQuery.rejected, (state, action) => {
            state.list[action.meta.arg.key].status = 'rejected';
        })
        .addCase(setQuerySort, (state, action) => {
            state.list[action.payload.key].sort = action.payload.sort ?? {...defaultSort};
        })
});

export default queriesReducer;
