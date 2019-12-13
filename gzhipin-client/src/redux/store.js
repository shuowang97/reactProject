/*
core module to manage objects for redux
 */
// fixed code  这里都是固定代码
import{createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

