import {createAction} from "@reduxjs/toolkit";
import {TabType} from "../../types";

export const addTab = createAction<{key:string, type:TabType}>('tabs/addTab')
export const closeTab = createAction<string>('tabs/closeTab');

export const setTab = createAction<string>('tabs/setCurrent');
