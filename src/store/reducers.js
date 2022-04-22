import { combineReducers } from 'redux';

import accountReducer from './reducers/account';
import notificationReducer from './reducers/notification';
import orderReducer from './reducers/order';
import explorerReducer from './reducers/explorer';

export default combineReducers({
  account: accountReducer,
  notification: notificationReducer,
  order: orderReducer,
  explorer: explorerReducer,
});
