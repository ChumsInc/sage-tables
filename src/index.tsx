import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './app/App';
import store from './app/configureStore'

window.localStorage.setItem('debug', '*');
const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
