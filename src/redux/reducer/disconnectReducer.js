import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    disconnect: false,
}
export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        disconnectWallet: (state) => {
            state.disconnect = !state.disconnect
        }
    },
})
export const { disconnectWallet } = walletSlice.actions

export default walletSlice.reducer