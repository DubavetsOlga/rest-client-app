import { configureStore } from '@reduxjs/toolkit';
import variablesReducer from './reducers/variablesSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      variablesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
