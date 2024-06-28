import {ActionStatus, CompanyCode, ServerName, TableResponse} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {loadTable, loadTables, setCompany, setFilter, setPage, setRowsPerPage, setServer} from "./actions";

export interface TablesState {
    server: ServerName;
    company: CompanyCode;
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
            state.page = 0;
        })
        .addCase(loadTables.pending, (state, action) => {
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
                state.tableDetail[(action.meta.arg)] = {
                    tableName: action.meta.arg,
                    columns: [],
                    indexes: {},
                    raw: [],
                    primary_keys: []
                }
            }
            state.tableDetail[(action.meta.arg)].loading = true;
        })
        .addCase(loadTable.fulfilled, (state, action) => {
            if (action.payload) {
                state.tableDetail[(action.meta.arg)] = action.payload;
            }
        })
        .addCase(loadTable.rejected, (state, action) => {
            if (!state.tableDetail[(action.meta.arg)]) {
                state.tableDetail[(action.meta.arg)] = {
                    tableName: action.meta.arg,
                    columns: [],
                    indexes: {},
                    raw: [],
                    primary_keys: []
                }
            }
            state.tableDetail[(action.meta.arg)].loading = false;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.page = 0;
            state.rowsPerPage = action.payload;
        })
})

export default tablesReducer;
