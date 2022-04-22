import {combineReducers} from "redux";
import {
    ActionInterface,
    ActionPayload, fetchJSON,
    filterPage,
    selectCurrentPage,
    selectRowsPerPage,
    selectTableSort
} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {createSelector} from "reselect";
import {API_TABLES} from "../../constants";

export const tableId = 'server-tables';

export interface TablesPayload extends ActionPayload {
    tables?: string[],
    value?: string,
}

export interface TablesAction extends ActionInterface {
    payload?: TablesPayload,
}

export interface TablesThunkAction extends ThunkAction<any, RootState, unknown, TablesAction> {
}

export const tablesServerChanged = 'tables/serverChanged';
export const tablesFilterChanged = 'tables/filterChanged';
export const tablesCompanyChanged = 'tables/companyChanged';

export const tablesLoadListRequested = 'tables/loadListRequested';
export const tablesLoadListSucceeded = 'tables/loadListSucceeded';
export const tablesLoadListFailed = 'tables/loadListFailed';



export const selectServer = (state: RootState) => state.tables.server;
export const selectCompany = (state:RootState) => state.tables.company;
export const selectLoading = (state: RootState) => state.tables.loading;
export const selectFilter = (state: RootState) => state.tables.filter;
export const selectTablesList = (state: RootState) => state.tables.list;
export const selectTablesLength = createSelector(
    [selectTablesList, selectFilter],
    (list, filter) => {
        let re: RegExp = /^/;
        try {
            re = new RegExp(filter);
        } catch (err: unknown) {
            re = /^/;
        }
        return list.filter(table => re.test(table)).length
    }
)

export const selectFilteredTablesList = createSelector(
    [selectTablesList, selectFilter, selectCurrentPage(tableId), selectRowsPerPage(tableId)],
    (list, filter, page, rowsPerPage) => {
        let re: RegExp = /^/;
        try {
            re = new RegExp(filter);
        } catch (err: unknown) {
            re = /^/;
        }
        return list
            .filter(table => re.test(table))
            .filter(filterPage(page, rowsPerPage));
    })


export const serverChangedAction = (value:string) => ({type: tablesServerChanged, payload: {value}});
export const companyChangedAction = (value:string) => ({type: tablesCompanyChanged, payload: {value}});
export const filterChangedAction = (value:string) => ({type: tablesFilterChanged, payload: {value}});
export const loadTablesAction = (): TablesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            const server = selectServer(state);
            dispatch({type: tablesLoadListRequested});

            const url = API_TABLES.replace(':server', encodeURIComponent(server));
            const {tables} = await fetchJSON<{ tables: string[] }>(url);
            dispatch({type: tablesLoadListSucceeded, payload: {tables}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadTablesAction()", error.message);
                return dispatch({type: tablesLoadListFailed, payload: {error, context: tablesLoadListRequested}})
            }
            console.error("loadTablesAction()", error);
        }
    }


const serverReducer = (state: string = 'arches', action: TablesAction): string => {
    const {type, payload} = action;
    switch (type) {
    case tablesServerChanged:
        return payload?.value || 'arches';
    default:
        return state;
    }
}

const companyReducer = (state:string = 'CHI', action: TablesAction):string => {
    const {type, payload} = action;
    switch (type) {
    case tablesCompanyChanged:
        return payload?.value || 'CHI';
    default:
        return state;
    }
}

const listReducer = (state: string[] = [], action: TablesAction): string[] => {
    const {type, payload} = action;
    switch (type) {
    case tablesLoadListSucceeded:
        if (payload?.tables) {
            return payload.tables.sort();
        }
        return [];
    case tablesServerChanged:
    case tablesCompanyChanged:
        return [];
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: TablesAction): boolean => {
    switch (action.type) {
    case tablesLoadListRequested:
        return true;
    case tablesLoadListFailed:
    case tablesLoadListSucceeded:
        return false;
    default:
        return state;
    }
}

const filterReducer = (state: string = '', action: TablesAction): string => {
    const {type, payload} = action;
    switch (type) {
    case tablesFilterChanged:
        return payload?.value || '';
    default:
        return state;
    }
}

export default combineReducers({
    server: serverReducer,
    company: companyReducer,
    list: listReducer,
    loading: loadingReducer,
    filter: filterReducer,
})
