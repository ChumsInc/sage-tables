import {ActionStatus, QueryList} from "../types";

export interface QueriesState {
    list: QueryList;
    status: ActionStatus;
}

const initialQueriesState:QueriesState = {
    list: {},
    status: "idle",
}

