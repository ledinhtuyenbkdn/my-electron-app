import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './pages/home/homeSlice';

const store = configureStore({
  reducer: {
    home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
