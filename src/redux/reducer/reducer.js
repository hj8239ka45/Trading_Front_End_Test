/*
    1.創建一個state套件服務的reducer，其本質作為一個函數
    2.reducer函數會接兩個參數
        2.1 之前的狀態(preState)
        2.2 動作對象(action)
    3.defalut用於初始化情況
*/
import { Login, Logout, ChangeProduct, ChangeTimeInterval, DisplayExchange} from '../constant/constant'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const initState = {
    login: false,
    apikey: '', 
    secretkey: '',
    product:'BTCUSDT',
    timeInterval:'1d',
    displayExchange:false,
}

const persistConfig = {
    key: 'persist-key',
    storage,
}

export const stateReducer = (preState = initState, action) => {
    // reducer
    const {type, payload} = action
    switch (type) {
        case Login:
            return { ...preState, login: true,
                apikey: payload.apikey, secretkey: payload.secretkey
            };
        case Logout:
            return {
                ...preState, login: false,
                apikey: "", secretkey: ""
            };
        case ChangeProduct:
            return {
                ...preState, product: payload
            };
        case ChangeTimeInterval:
            return {
                ...preState, timeInterval: payload
            };
        case DisplayExchange:
            return {
                ...preState, displayExchange: payload
            };            
        default:
            return preState;
    }
};

export const persistedReducer = persistReducer(persistConfig, stateReducer)