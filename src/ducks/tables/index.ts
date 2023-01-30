import {ActionStatus, ServerName, TableResponse} from "../types";
import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchTable, fetchTables} from "../../api/tables";
import {RootState} from "../../app/configureStore";

export const tableId = 'server-list';

export interface TablesState {
    server: ServerName;
    company: string;
    list: string[];
    filter: string;
    tableDetail: {
        [key: string]: TableResponse;
    };
    status: ActionStatus;
    page: number,
    rowsPerPage: number;
}

export const initialTablesState: TablesState = {
    server: 'ARCHES',
    company: 'CHI',
    list: [],
    filter: '',
    tableDetail: {},
    status: 'idle',
    page: 0,
    rowsPerPage: 25,
}

export const selectServer = (state:RootState) => state.tables.server;
export const selectCompany = (state:RootState) => state.tables.company;
export const selectFilter = (state:RootState) => state.tables.filter;
export const selectTables = (state:RootState) => state.tables.list;
export const selectTable = (state:RootState, table: string) => state.tables.tableDetail[table] ?? null;
export const selectLoading = (state:RootState) => state.tables.status === 'pending';
export const selectRowsPerPage = (state:RootState) => state.tables.rowsPerPage;
export const selectPage = (state:RootState) => state.tables.page;


export const setServer = createAction<ServerName>('list/setServer');
export const setCompany = createAction<string>('list/setCompany');

export const setFilter = createAction<string>('list/setFilter');

export const loadTables = createAsyncThunk<string[], ServerName>(
    'list/loadList',
    async (arg) => {
        return await fetchTables(arg);
    },
)

export const loadTable = createAsyncThunk<TableResponse, string>(
    'list/loadTable',
    async (arg) => {
        return await fetchTable('CHI', arg);
    }
)

export const setRowsPerPage = createAction<number>('list/setRowsPerPage');

export const setPage = createAction<number>('list/setPage');


const tablesReducer = createReducer(initialTablesState, (builder) => {
    builder
        .addCase(setServer, (state, action) => {
            state.server = action.payload;
        })
        .addCase(setCompany, (state, action) => {
            state.company = action.payload;
        })
        .addCase(setFilter, (state, action) => {
            state.filter = action.payload;
        })
        .addCase(loadTables.pending, (state, action) => {
            state.server = action.meta.arg;
            state.status = 'pending';
        })
        .addCase(loadTables.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.list = action.payload;
            Object.keys(state.tableDetail).forEach(table => {
                if (!state.list.includes(table)) {
                    delete state.tableDetail[table];
                }
            })
        })
        .addCase(loadTables.rejected, (state) => {
            state.status = 'rejected';
        })
        .addCase(loadTable.pending, (state, action) => {
            if (!state.tableDetail[(action.meta.arg)]) {
                state.tableDetail[(action.meta.arg)] = {columns: [], indexes: {}, raw: [], primary_keys: []}
            }
            state.tableDetail[(action.meta.arg)].loading = true;
        })
        .addCase(loadTable.fulfilled, (state, action) => {
            state.tableDetail[(action.meta.arg)] = action.payload;
        })
        .addCase(loadTable.rejected, (state, action) => {
            if (!state.tableDetail[(action.meta.arg)]) {
                state.tableDetail[(action.meta.arg)] = {columns: [], indexes: {}, raw: [], primary_keys: []}
            }
            state.tableDetail[(action.meta.arg)].loading = false;
        })
})

export default tablesReducer;
