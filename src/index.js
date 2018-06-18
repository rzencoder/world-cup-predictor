import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import './sass/index.css';
import App from './components/App';
import registerServiceWorker from './js/registerServiceWorker';

import configureStore from './store/configureStore';
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

registerServiceWorker();
