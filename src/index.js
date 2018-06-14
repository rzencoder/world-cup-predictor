import React from 'react';
import ReactDOM from 'react-dom';
import './sass/index.css';
import App from './components/App';
import registerServiceWorker from './js/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
