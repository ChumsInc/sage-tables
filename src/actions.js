import {
    API_QUERY,
    API_TABLE,
    API_TABLES,
    CLOSE_TAB,
    COMPANIES,
    DISMISS_ALERT,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_QUERY,
    FETCH_SUCCESS,
    FETCH_TABLE,
    FETCH_TABLES,
    SERVERS,
    SET_ALERT,
    SET_QUERY,
    SET_TAB,
    SET_TAB_NAME
} from "./constants";
import {onErrorAction} from 'chums-ducks';
import {buildPath, fetchGET, fetchPOST} from "./fetch";
import {now} from './utils';

const nonce = document.getElementById('app').dataset.nonce;

export const setAlert = ({type = 'warning', title = 'Oops!', message = 'There was an error'}) => ({
    type: SET_ALERT,
    alert: {type, title, message}
});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});


export const setTab = (tab) => ({type: SET_TAB, tab});
export const setQuery = (tab, props) => ({type: SET_QUERY, tab, props});
export const setTabName = ({tab, name}) => ({type: SET_TAB_NAME, tab, name});

export const addNewTab = ({
                              query = '',
                              company = COMPANIES[0],
                              server = SERVERS[0],
                              limit = 100,
                              offset = 0
                          } = {}) => (dispatch, getState) => {
    const tab = now().toString(36);
    dispatch({type: SET_TAB, tab});
    dispatch({type: SET_QUERY, tab, props: {query, server, company, limit, offset}});
    const [, tabName] = /from ([\S]+)/i.exec(query) || [];
    if (tabName) {
        dispatch(setTabName({tab, name: `${company}/${tabName}`}));
    }
};

export const closeTab = (tab) => (dispatch, getState) => {
    const {tabs} = getState();
    const tabIndex = tabs.indexOf(tab);
    const nextTab = tabIndex > 0 ? tabs[tabIndex - 1] : tabs[tabIndex + 1] || null;
    dispatch({type: CLOSE_TAB, tab});
    if (nextTab) {
        dispatch(setTab(nextTab));
    } else {
        dispatch(addNewTab({}));
    }
}

export const fetchTables = (server) => (dispatch, getState) => {
    const {tables} = getState();
    const [currentServer] = tables.filter(t => t.server === server);
    if (currentServer && currentServer.loading) {
        return;
    }

    const url = buildPath(API_TABLES, {server});
    dispatch({type: FETCH_TABLES, status: FETCH_INIT, server});
    fetchGET(url)
        .then(res => {
            const list = (res.tables || []).map(table => ({table}));
            dispatch({type: FETCH_TABLES, status: FETCH_SUCCESS, server, list})
        })
        .catch(err => {
            dispatch(onErrorAction(err, FETCH_TABLES));
            dispatch({type: FETCH_TABLES, status: FETCH_FAILURE, err});
        });
};

export const fetchTable = (server, table) => (dispatch, getState) => {
    const tab = `${server}:${table}`;
    const url = buildPath(API_TABLE, {server, table});
    dispatch({type: FETCH_TABLE, tab, status: FETCH_INIT, props: {server, table}});
    fetchGET(url)
        .then(({columns, primary_keys, indexes}) => {
            dispatch({
                type: FETCH_TABLE,
                tab,
                status: FETCH_SUCCESS,
                props: {server, table, columns, primary_keys, indexes}
            });
        })
        .catch(err => {
            dispatch({type: FETCH_TABLE, status: FETCH_FAILURE, tab});
        });
};

export const fetchQuery = (tab) => (dispatch, getState) => {
    const {queries, results} = getState();
    const {query, server, company, limit, offset} = queries[tab] || {};
    const {loading = false} = results[tab] || {};
    if (loading) {
        return;
    }
    const [, tabName] = /from ([\S]+)/i.exec(query) || [];
    if (tabName) {
        dispatch(setTabName({tab, name: `${company}/${tabName}`}));
    }
    const url = buildPath(API_QUERY, {company, limit, offset});
    dispatch({type: FETCH_QUERY, status: FETCH_INIT, tab});
    fetchPOST(url, {query, company, limit, offset})
        .then(({Fields, Data, timings, Error: queryError}) => {
            const rows = Data.length;
            Data.forEach((row, index) => row.__index = index);
            dispatch({
                type: FETCH_QUERY,
                status: FETCH_SUCCESS,
                tab,
                columns: Fields,
                data: Data,
                rows,
                timings,
                error: queryError
            });
        })
        .catch(err => {
            console.log(err.message);
            dispatch({type: FETCH_QUERY, status: FETCH_FAILURE, tab, err});
        });
};


/*
select ItemCode, ItemCodeDesc from CI_Item where ItemType = '1'
 */
