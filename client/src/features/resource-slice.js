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
  carousel1_url: '',
  carousel2_url: '',
  carousel3_url: '',
  carousel4_url: '',
  activity1_url: '',
  activity2_url: '',
  activity3_url: '',
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
      // console.log(action.payload)
      const { files, articles } = action.payload
      // 轮播图 + 最新活动
      state.carousel1 = files[0]
      state.carousel2 = files[1]
      state.carousel3 = files[2]
      state.carousel4 = files[3]
      state.activity1 = files[4]
      state.activity2 = files[5]
      state.activity3 = files[6]
      // 推文链接
      state.carousel1_url = articles[0]
      state.carousel2_url = articles[1]
      state.carousel3_url = articles[2]
      state.carousel4_url = articles[3]
      state.activity1_url = articles[4]
      state.activity2_url = articles[5]
      state.activity3_url = articles[6]

    })
  }
})
export const {setLink1, setLink2, setLink3, setLoading} = resourceSlice.actions
export default resourceSlice.reducer