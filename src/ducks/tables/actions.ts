import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {CompanyCode, ServerName, TableResponse} from "../../types";
import type {RootState} from "../../app/configureStore";
import {fetchTable, fetchTables} from "../../api/tables";
import {selectLoading} from "./selectors";

export const setServer = createAction<ServerName>('list/setServer');
export const setCompany = createAction<CompanyCode>('list/setCompany');
export const setFilter = createAction<string>('list/setFilter');
export const setRowsPerPage = createAction<number>('list/setRowsPerPage');
export const setPage = createAction<number>('list/setPage');


export const loadTables = createAsyncThunk<string[]>(
    'list/loadList',
    async () => {
        return await fetchTables();
    },
    {
        condition(_, {getState}) {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadTable = createAsyncThunk<TableResponse | null, string>(
    'list/loadTable',
    async (arg) => {
        return await fetchTable(arg);
    }
)

