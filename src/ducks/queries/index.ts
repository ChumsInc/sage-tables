import {
    ActionStatus,
    DataRow,
    Query,
    QueryChangeProps,
    QueryList,
    QueryPageProps,
    QueryResponse,
    QueryRowsPerPageProps
} from "../../types";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {defaultSort, emptyQuery, getQueryKey} from "../../utils";
import {RootState} from "../../app/configureStore";
import {closeTab} from "../tabs/actions";
import {execQuery} from "../../api/query";
import {SortProps} from "chums-components";
import {selectCurrentTab} from "../tabs/selectors";
import {
    addQuery,
    executeQuery, loadQuery,
    saveQuery,
    setQueryPage,
    setQueryRowsPerPage,
    setQuerySort,
    updateQuery
} from "./actions";

export interface QueriesState {
    list: QueryList;
    status: ActionStatus;
}


const initialQueriesState: QueriesState = {
    list: {},
    status: "idle",
}

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
            state.list[action.meta.arg].status = 'pending';
        })
        .addCase(executeQuery.fulfilled, (state, action) => {
            const key = action.meta.arg;
            if (state.list[key]) {
                state.list[key].status = 'fulfilled';
                state.list[key].response = action.payload;
                state.list[key].page = 0;
            }
        })
        .addCase(executeQuery.rejected, (state, action) => {
            state.list[action.meta.arg].status = 'rejected';
        })
        .addCase(setQuerySort, (state, action) => {
            state.list[action.payload.key].sort = action.payload.sort ?? {...defaultSort};
        })
        .addCase(setQueryPage, (state, action) => {
            state.list[action.payload.key].page = action.payload.page;
        })
        .addCase(setQueryRowsPerPage, (state, action) => {
            const {key, rowsPerPage} = action.payload;
            if (rowsPerPage === 0) {
                return;
            }
            const firstRowIndex = state.list[key].page * state.list[key].rowsPerPage;
            state.list[key].page = Math.floor(firstRowIndex / rowsPerPage);
            state.list[key].rowsPerPage = rowsPerPage;
        })
        .addCase(saveQuery.fulfilled, (state, action) => {
            const {key} = action.meta.arg;
            state.list[key].changed = false;
        })
        .addCase(loadQuery, (state, action) => {
            if (action.payload) {
                const {key} = action.payload;
                state.list[key] = action.payload;
            }
        })
});

export default queriesReducer;
