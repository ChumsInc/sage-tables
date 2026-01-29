import {createAsyncThunk} from "@reduxjs/toolkit";
import type {Query, QueryResponse, SavedQuery} from "../../types";
import {execQuery} from "@/api/query";
import type {RootState} from "@/app/configureStore";
import {saveAs} from "file-saver";
import {selectQueryStatus} from "@/ducks/queries/index.ts";

export const executeQuery = createAsyncThunk<QueryResponse | null, Query, { state: RootState }>(
    'queries/execute',
    async (arg) => {
        return await execQuery(arg)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return arg.sql.length > 10 && selectQueryStatus(state) === 'idle';
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

