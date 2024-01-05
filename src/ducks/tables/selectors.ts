import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";

export const selectServer = (state: RootState) => state.tables.server;
export const selectCompany = (state: RootState) => state.tables.company;

export const selectFilter = (state: RootState) => state.tables.filter;
export const selectTables = (state: RootState) => state.tables.list;
export const selectTable = (state: RootState, table: string) => state.tables.tableDetail[table] ?? null;
export const selectLoading = (state: RootState) => state.tables.status === 'pending';
export const selectRowsPerPage = (state: RootState) => state.tables.rowsPerPage;
export const selectPage = (state: RootState) => state.tables.page;

export const selectFilteredTablesList = createSelector(
    [selectFilter, selectTables],
    (filter, tables) => {
        return tables
            .filter(table => table.toLowerCase().includes(filter.toLowerCase()))
            .sort();
    }
)
