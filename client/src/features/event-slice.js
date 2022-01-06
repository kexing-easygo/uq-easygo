import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchMainEvents } from "../services/main-events";
const initialState = {
  registeredEvents: [],
  clickedIndex: 0,
  showEventModal: false,
}

export const eventSlice = createSlice({
  name: 'mainEvent',
  initialState,
  reducers: {
    setClickedIndex: (state, action) => {
      state.clickedIndex = action.payload
    },
    setShowEventModal: (state, action) => {
      state.showEventModal = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMainEvents.fulfilled, (state, action) => {
        state.registeredEvents = action.payload
      })
      // .addCase(fetchMainEvents.pending, () => {
      //   Taro.showToast({ title: '搜索中', icon: 'loading' })
      // })
  }
})

export const { setClickedIndex, setShowEventModal } = eventSlice.actions
export default eventSlice.reducer