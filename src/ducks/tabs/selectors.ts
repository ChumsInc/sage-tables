import {RootState} from "../../app/configureStore";

export const selectTabs = (state:RootState) => state.tabs.list;
export const selectCurrentTab = (state:RootState) => state.tabs.currentTab;
