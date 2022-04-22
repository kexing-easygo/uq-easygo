import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchImages } from "../services/cloud-resource";
const initialState = {
  carousel1: '',
  carousel2: '',
  carousel3: '',
  carousel4: '',
  activity1: '',
  activity2: '',
  activity3: '',
  loaded: false
}

export const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setLink1: (state, action) => {
      state.carousel1 = action.payload
    },
    setLink2: (state, action) => {
      state.carousel2 = action.payload
    },
    setLink3: (state, action) => {
      state.carousel3 = action.payload
    },
    setLoading: (state, action) => {
      state.loaded = true
      Taro.switchTab({ url: '/pages/index/index' })
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchImages.fulfilled, (state, action) => {
      console.log("图片拉取成功")
      console.log(action.payload)
      state.carousel1 = action.payload[0]
      state.carousel2 = action.payload[1]
      state.carousel3 = action.payload[2]
      state.carousel4 = action.payload[3]
      state.activity1 = action.payload[4]
      state.activity2 = action.payload[5]
      state.activity3 = action.payload[6]
    })
  }
})
export const {setLink1, setLink2, setLink3, setLoading} = resourceSlice.actions
export default resourceSlice.reducer