import { combineReducers } from 'redux'
import app from './appReducer';
import auth from './authReducer';
import finance from './financeReducer';
import inventoryAdmin from './inventoryAdminReducer';
export default combineReducers({
  app,
  auth,
  finance,
  inventoryAdmin
})
