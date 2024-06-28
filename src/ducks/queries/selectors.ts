import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {selectCurrentTab} from "../tabs/selectors";
import {dataSorter} from "./utils";
import {Query} from "../../types";
import {Root} from "react-dom/client";
import {Editable} from "chums-types";

export const selectQueryList = (state:RootState) => state.queries.list;
export const selectQuery = (state: RootState, key: string):(Query & Editable)|null => state.queries.list[key] ?? null;
// export const selectQueryKey = (state:Root, key:string) => key;
export const selectQuerySort = (state: RootState, key: string) => state.queries.list[key].sort;
export const selectQueryLoading = (state: RootState, key: string) => state.queries.list[key].status === 'pending';
export const selectQueryResponse = (state: RootState, key: string) => state.queries.list[key].response;
export const selectQueryPage = (state:RootState, key:string) => state.queries.list[key].page;
export const selectQueryRowsPerPage = (state:RootState, key:string) => state.queries.list[key].rowsPerPage;
export const selectQueryResponseFields = (state: RootState, key: string) => state.queries.list[key].response?.Fields ?? [];
export const selectQueryResponseData = (state: RootState, key: string) => state.queries.list[key].response?.Data ?? [];
export const selectQueryResponseQuery = (state: RootState, key: string) => state.queries.list[key].response?.Query ?? '';
export const selectQueryResponseError = (state: RootState, key: string) => state.queries.list[key].error ?? '';
export const selectQueryResponseTimings = (state: RootState, key: string) => state.queries.list[key].response?.timings ?? null;
export const selectQueryResponseCompany = (state: RootState, key: string) => state.queries.list[key].response?.Company ?? '';

// export const selectQuery = createSelector(
//     [selectQueryList, selectQueryResponseQuery],
//     (list, key) => list[key] ?? null
// )
export const selectCurrentQuery = createSelector(
    [selectQueryList, selectCurrentTab],
    (list, tab) => {
        if (!tab) {
            return null;
        }
        return list[tab] ?? null;
    }
)
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

