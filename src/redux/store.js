//https://github.com/rt2zz/redux-persist
import { createStore, applyMiddleware} from 'redux';
import { loginReducer, persistedReducer} from './reducer/reducer';
import logger from 'redux-logger';
import { persistStore} from 'redux-persist'

// store
export const store = createStore(persistedReducer, applyMiddleware(logger));
export const persistor = persistStore(store);
