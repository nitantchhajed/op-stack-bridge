import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    address: null,
}
export const counterSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        storeAddress: (state, action) => {
            state.address = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { storeAddress } = counterSlice.actions

export default counterSlice.reducer