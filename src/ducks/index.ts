import {combineReducers} from 'redux'
import {alertsReducer, pagesReducer, sortableTablesReducer} from 'chums-ducks';
import {default as tablesReducer} from './tables';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    pages: pagesReducer,
    tables: tablesReducer,
    sortableTables: sortableTablesReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
