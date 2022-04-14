import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchImages } from "../services/cloud-resource";
const initialState = {
  carousel1: '',
  carousel2: '',
  carousel3: '',
  carousel4: '',
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
      // console.log("图片拉取成功")
      console.log(action.payload)
      state.carousel1 = action.payload[0].tempFileURL
      state.carousel2 = action.payload[1].tempFileURL
      state.carousel3 = action.payload[2].tempFileURL
      // const f1 = action.payload[0].tempFileURL
      // const f2 = action.payload[1].tempFileURL
      // const f3 = action.payload[2].tempFileURL
    })
  }
})
export const {setLink1, setLink2, setLink3, setLoading} = resourceSlice.actions
export default resourceSlice.reducer