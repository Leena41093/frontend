import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store,  { history , persistor } from './store';
import Routes from './route';
import { PersistGate } from 'redux-persist/integration/react'
import 'sanitize.css/sanitize.css'

const target = document.querySelector('#root')

render(
  <Provider store={store.store}>
    <PersistGate loading={null} persistor={store.persistor}>
    <ConnectedRouter history={history}>
      <div>
        <Routes />
      </div>
    </ConnectedRouter>
    </PersistGate>
  </Provider>,
  target
)
