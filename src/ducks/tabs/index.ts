import {TabList, TabType} from "../types";
import {createAction, createReducer} from "@reduxjs/toolkit";
import {loadTable} from "../tables";

export interface TabsState {
    list: TabList;
    currentTab: string|null;
}

const initialState:TabsState = {
    list: {},
    currentTab: null,
}

export const addTab = createAction<{key:string, type:TabType}>('tabs/addTab')
export const closeTab = createAction<string>('tabs/closeTab');

export const setTab = createAction<string>('tabs/setCurrent');

const tabsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addTab, (state, action) => {
            state.list[action.payload.key] = action.payload.type;
            state.currentTab = action.payload.key;
        })
        .addCase(closeTab, (state, action) => {
            const keys = Object.keys(state.list);
            delete state.list[action.payload];
            if (state.currentTab === action.payload) {
                const index = keys.indexOf(action.payload);
                if (index < keys.length - 1) {
                    state.currentTab = keys[index + 1] ?? null;
                }
            }
            if (state.currentTab === null && Object.keys(state.list).length) {
                state.currentTab = Object.keys(state.list).pop() ?? null;
            }
        })
        .addCase(setTab, (state, action) => {
            if (Object.keys(state.list).includes(action.payload)) {
                state.currentTab = action.payload;
            }
        })
        .addCase(loadTable.pending, (state, action) => {
            state.list[action.meta.arg.key] = 'table';
        })
});

export default tabsReducer;
