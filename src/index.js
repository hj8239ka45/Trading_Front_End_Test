import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { store, persistor} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

// main code, open app
ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  ,
    document.getElementById('root')
  );
reportWebVitals();

// 由於redux只記錄狀態，不會有state附帶之re-render特性
// 因此需要檢測redux中狀態是否發生變化，只要變化，就調用render
store.subscribe(()=>{
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
  </Provider >,
   document.getElementById('root'))
  })
