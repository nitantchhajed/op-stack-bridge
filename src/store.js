import { configureStore } from '@reduxjs/toolkit'
import counterSlice from "./redux/reducer/reducer"
import walletSlice from './redux/reducer/disconnectReducer'
export const store = configureStore({
  reducer: {
    address: counterSlice,
    wallet: walletSlice
  },
})