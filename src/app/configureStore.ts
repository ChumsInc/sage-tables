import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import tablesSlice from "@/ducks/tables/tablesSlice.ts";
import tabsReducer from "../ducks/tabs";
import alertsReducer from "../ducks/alerts";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import queriesSlice from "@/ducks/queries/queriesSlice.ts";
import sqlSlice from "@/ducks/queries/sqlSlice.ts";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    [queriesSlice.reducerPath]: queriesSlice.reducer,
    [sqlSlice.reducerPath]: sqlSlice.reducer,
    [tablesSlice.reducerPath]: tablesSlice.reducer,
    tabs: tabsReducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error', 'meta.arg.signal'],
        }
    }),
    devTools: {
        name: 'Chums - Sage Tables'
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
