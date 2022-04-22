import {combineReducers} from "redux";
import {ActionInterface, ActionPayload} from "chums-ducks";


export interface QueryPayload extends ActionPayload {
    id: string,
    query?:string,
    fields?: unknown[],
    result?: any[],
}
export interface QueryAction extends ActionInterface {

}
export interface QueryList {
    [key:string]: string,
}

export interface ResultList {
    [key: string]: unknown[],
}

export interface ResultErrorList {
    [key:string]: string;
}

const queriesReducer = (state:QueryList = {}, action:)
