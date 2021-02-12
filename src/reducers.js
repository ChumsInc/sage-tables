import {combineReducers} from 'redux';
import {
    ADD_TAB,
    CLOSE_TAB,
    DISMISS_ALERT,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_QUERY,
    FETCH_SUCCESS,
    FETCH_TABLE,
    FETCH_TABLES,
    SET_ALERT,
    SET_QUERY,
    SET_TAB,
    SET_TAB_NAME
} from "./constants";
import {now} from './utils';

const errorAlert = (err, tab) => ({type: 'danger', title: err.name, message: err.message, id: now(), tab});

const alerts = (state = [], action) => {
    const {type, alert, id, status, err, error, tab} = action;
    switch (type) {
    case SET_ALERT:
        return [...state, {...alert, id: now()}];
    case DISMISS_ALERT:
        return [...state.filter(alert => alert.id !== id)];
    case FETCH_TABLES:
    case FETCH_QUERY:
        if (status === FETCH_SUCCESS) {
            if (error) {
                return [...state, errorAlert(new Error(error), tab)];
            }
        }
        return status === FETCH_FAILURE ? [...state, errorAlert(err, tab)] : state;
    default:
        return state;
    }
};

const tab = (state = '', action) => {
    const {type, tab} = action;
    switch (type) {
    case FETCH_TABLE:
    case ADD_TAB:
    case SET_TAB:
        return tab;
    case CLOSE_TAB:
        return '';
    default:
        return state;
    }
};

const tabs = (state = [], action) => {
    const {type, tab} = action;
    switch (type) {
    case SET_TAB:
    case ADD_TAB:
    case FETCH_TABLE:
        if (state.includes(tab)) {
            return state;
        }
        return [
            ...state,
            tab,
        ];
    case CLOSE_TAB:
        if (!state.includes(tab)) {
            return state;
        }
        return state.filter(_tab => _tab !== tab);
    default:
        return state;
    }
};

const tabNames = (state = {}, action) => {
    const {type, tab, name} = action;
    const tabs = {...state};
    switch (type) {
    case CLOSE_TAB:
        delete tabs[tab];
        return {...tabs};
    case SET_TAB_NAME:
        tabs[tab] = name;
        return {...tabs};
    default:
        return state;
    }
}

const queries = (state = {}, action) => {
    const {type, tab, props} = action;
    switch (type) {
    case SET_QUERY:
        return {
            ...state,
            [tab]: {...state[tab], ...props},
        };
    case CLOSE_TAB:
        if (state[tab]) {
            const tabs = {...state};
            delete tabs[tab];
            return {...tabs};
        }
        return state;
    case ADD_TAB:
        return {
            ...state,
            [tab]: {...props},
        };
    default:
        return state;
    }
};

const results = (state = {}, action) => {
    const {type, tab, status, columns, rows, data, timings} = action;
    switch (type) {
    case FETCH_QUERY:
        return {
            ...state,
            [tab]: {
                ...state[tab],
                loading: status === FETCH_INIT,
                columns: status === FETCH_SUCCESS ? [...columns] : (state[tab].columns || []),
                rows: status === FETCH_SUCCESS ? rows : (state[tab].rows || 0),
                data: status === FETCH_SUCCESS ? [...data] : (state[tab].data || []),
                timings: status === FETCH_SUCCESS ? {...timings} : (state[tab].timings || {}),
                dirty: status === FETCH_SUCCESS ? false : (state[tab].dirty || false),
            }
        };
    case SET_QUERY:
        return {
            ...state,
            [tab]: {...state[tab], dirty: (state[tab] !== undefined)},
        };
    case CLOSE_TAB:
        if (state[tab]) {
            const tabs = {...state};
            delete tabs[tab];
            return {...tabs};
        }
        return state;
    case ADD_TAB:
        return {
            ...state,
            [tab]: {rows: 0, columns: [], data: [], timings: {}},
        };
    default:
        return state;
    }
};

const tables = (state = [], action) => {
    const {type, status, server, list} = action;
    if (type === FETCH_TABLES) {
        const [tables = {list: []}] = state.filter(t => t.server === server);
        return [
            ...state.filter(t => t.server !== server),
            {list: list || tables.list, server, loading: status === FETCH_INIT}
        ];
    }
    return state;
};

const tableDetails = (state = {}, action) => {
    const {type, status, tab, props} = action;
    switch (type) {
    case FETCH_TABLE:
        if (status === FETCH_SUCCESS) {
            return {
                ...state,
                [tab]: {...state[tab], ...props},
            }
        }
        return state;
    case CLOSE_TAB:
        if (state[tab]) {
            const tabs = {...state};
            delete tabs[tab];
            return {...tabs};
        }
        return state;
    case ADD_TAB:
        return {
            ...state,
            [tab]: {...props},
        };
    default:
        return state;
    }
};


export default combineReducers({
    alerts,
    tab,
    tabs,
    tabNames,
    queries,
    tables,
    tableDetails,
    results,
});
