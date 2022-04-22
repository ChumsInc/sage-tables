import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../ducks";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {composeWithDevTools} from 'redux-devtools-extension';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState:any) {
    const store = createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(thunk, createLogger())
        )
    )
}
