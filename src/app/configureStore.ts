import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import tablesReducer from "../ducks/tables";
import tabsReducer from "../ducks/tabs";
import alertsReducer from "../ducks/alerts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import queriesReducer from "../ducks/queries";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    queries: queriesReducer,
    tables: tablesReducer,
    tabs: tabsReducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error', 'meta.arg.signal'],
        }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
