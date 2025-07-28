import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';


import shipmentReducer from './reducers/shipmentReducer';

const rootReducer = combineReducers({
  shipment: shipmentReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
