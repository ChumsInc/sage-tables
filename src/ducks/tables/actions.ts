import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CompanyCode, ServerName, TableResponse} from "../../types";
import {RootState} from "../../app/configureStore";
import {fetchTable, fetchTables} from "../../api/tables";
import {selectCompany, selectLoading, selectServer} from "./selectors";

export const setServer = createAction<ServerName>('list/setServer');
export const setCompany = createAction<CompanyCode>('list/setCompany');
export const setFilter = createAction<string>('list/setFilter');
export const setRowsPerPage = createAction<number>('list/setRowsPerPage');
export const setPage = createAction<number>('list/setPage');


export const loadTables = createAsyncThunk<string[]>(
    'list/loadList',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const server = selectServer(state);
        const company = selectCompany(state);
        return await fetchTables({server, company});
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadTable = createAsyncThunk<TableResponse|null, string>(
    'list/loadTable',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const server = selectServer(state);
        const company = selectCompany(state);
        return await fetchTable({server, company}, arg);
    }
)

