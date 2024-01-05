import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Query, QueryChangeProps, QueryPageProps, QueryResponse, QueryRowsPerPageProps, SavedQuery} from "../../types";
import {execQuery} from "../../api/query";
import {RootState} from "../../app/configureStore";
import {selectQuery} from "./selectors";
import {saveAs} from "file-saver";

export const updateQuery = createAction<QueryChangeProps>('queries/setQuery');
export const setQuerySort = createAction<QueryChangeProps>('queries/setSort');
export const setQueryPage = createAction<QueryPageProps>('queries/setPage');
export const setQueryRowsPerPage = createAction<QueryRowsPerPageProps>('queries/setRowPerPage');


export const addQuery = createAction<Query>('queries/addQuery');
export const executeQuery = createAsyncThunk<QueryResponse, string>(
    'queries/execute',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const query = selectQuery(state, arg);
        return await execQuery(query)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const query = selectQuery(state, arg);
            return !!query.sql && query.status !== 'pending';
        }
    }
)

export const saveQuery = createAsyncThunk<void, Query>(
    'queries/saveQuery',
    async (arg) => {
        const query: SavedQuery = {
            company: arg.company,
            sql: arg.sql
        }
        const file = new Blob([JSON.stringify(query)]);
        saveAs(file, `${arg.filename}.sql.json`);
    },
    {
        condition: (arg) => {
            return !!arg.filename && !!arg.sql;
        }
    }
)

export const loadQuery = createAction<Query>('queries/loadQuery')
