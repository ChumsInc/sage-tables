import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducer from './ducks';
import App from './App';
import {composeWithDevTools} from 'redux-devtools-extension'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('app')
);
