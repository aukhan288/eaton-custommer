import React from 'react';
import { LogBox } from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigator from './navigation';
import {store, persistor} from './store';

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigator />
      </PersistGate>
    </Provider>
  );
};

export default App;