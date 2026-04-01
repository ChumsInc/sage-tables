import type {ActionStatus, CompanyCode, ServerName, TableResponse} from "../../types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadTable, loadTables} from "./actions";

const adapter = createEntityAdapter<TableResponse, string>({
    selectId: (arg) => arg.tableName,
    sortComparer: (a, b) => a.tableName.localeCompare(b.tableName),
})

const selectors = adapter.getSelectors();

export interface TablesState {
    server: ServerName;
    company: CompanyCode;
    list: string[];
    filter: string;
    status: ActionStatus;
    error: string | null;
}

export const initialTablesState: TablesState = {
    server: 'ARCHES',
    company: 'CHI',
    list: [],
    filter: '',
    status: 'idle',
    error: null,
}

const tablesSlice = createSlice({
    name: 'tables',
    initialState: adapter.getInitialState(initialTablesState),
    reducers: {
        setServer: (state, action:PayloadAction<ServerName>) => {
            state.server = action.payload;
        },
        setCompany: (state, action:PayloadAction<CompanyCode>) => {
            state.company = action.payload;
        },
        setFilter: (state, action:PayloadAction<string>) => {
            state.filter = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadTables.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(loadTables.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.list = action.payload.sort();
                Object.keys(state.entities).forEach(key => {
                    if (!state.list.includes(key)) {
                        adapter.removeOne(state, key);
                    }
                })
            })
            .addCase(loadTables.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message ?? null;
            })
            .addCase(loadTable.pending, (state, action) => {
                if (!state.entities[action.meta.arg]) {
                    adapter.setOne(state, {
                        tableName: action.meta.arg,
                        columns: [],
                        indexes: {},
                        primary_keys: [],
                        raw: [],
                    })
                }
                adapter.updateOne(state, {id: action.meta.arg, changes: {loading: true}})
            })
            .addCase(loadTable.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload)
                }
            })
            .addCase(loadTable.rejected, (state, action) => {
                state.error = action.error.message ?? null;
                adapter.updateOne(state, {id: action.meta.arg, changes: {loading: false}})
            })
    },
    selectors: {
        selectServer: (state) => state.server,
        selectCompany: (state) => state.company,
        selectFilter: (state) => state.filter,
        selectTables: (state) => state.list,
        selectStatus: (state) => state.status,
        selectAll: (state) => selectors.selectAll(state),
        selectTable: (state, id:string) => selectors.selectById(state, id),
    }
});

export default tablesSlice;
export const {setServer, setCompany, setFilter} = tablesSlice.actions;
export const {selectServer, selectCompany, selectFilter, selectTables, selectStatus, selectTable} = tablesSlice.selectors;

export const selectFilteredTablesList = createSelector(
    [selectFilter, selectTables],
    (filter, tables) => {
        return tables
            .filter(table => table.toLowerCase().includes(filter.toLowerCase()))
            .sort();
    }
)
