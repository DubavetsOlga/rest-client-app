import { configureStore } from '@reduxjs/toolkit';
import variablesReducer from './reducers/variablesSlice';
import restClientReducer from '@/shared/store/reducers/restClientSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      variablesReducer,
      restClientReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
