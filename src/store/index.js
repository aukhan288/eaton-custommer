import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import ReduxThunk from 'redux-thunk';

import ApplicationReducer from './reducers/ApplicationReducer';

import ProductReducer from './reducers/ProductReducer';
import CartReducer from './reducers/CartReducer';
import CouponReducer from './reducers/CouponReducer';
import AuthReducer from './reducers/AuthReducer';
import PaymentReducer from './reducers/PaymentReducer';
import OrderReducer from './reducers/OrderReducer';
import OnBoardingReducer from './reducers/OnBoardingReducer';
import DeliveryDateTimeReducer from './reducers/DeliveryDateTimeReducer';
import OrderSettingReducer from './reducers/OrderSettingReducer';
import FevoriteReducer from './reducers/FevoriteReducer';

const rootReducer = combineReducers({
  ProductReducer: ProductReducer,
  CartReducer: CartReducer,
  CartReducer: CartReducer,
  CouponReducer: CouponReducer,
  AuthReducer: AuthReducer,
  PaymentReducer: PaymentReducer,
  OrderReducer: OrderReducer,
  OnBoardingReducer: OnBoardingReducer,
  DeliveryDateTimeReducer: DeliveryDateTimeReducer,
  OrderSettingReducer: OrderSettingReducer,
  ApplicationReducer:ApplicationReducer,
  FevoriteReducer:FevoriteReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['CartReducer', 'AuthReducer', 'OnBoardingReducer', 'ApplicationReducer', 'FevoriteReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store);


export {store, persistor};
