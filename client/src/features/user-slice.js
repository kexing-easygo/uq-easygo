import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { getUserProfile } from '../services/login'
import { fetchUserInfo, updateClassMode } from '../services/profile'

// 初始化状态
const initialState = {
  loginStatus: false, // 是否已经登录
  classMode: '',      // 上课模式
  avatarUrl: '',      // 头像
  nickName: ''        // 昵称
}

// 创建action
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload
    },
  },
  extraReducers: (builer) =>
    builer
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.classMode = action.payload.classMode ?? '';
        state.avatarUrl = action.payload.userInfo.avatarUrl;
        state.nickName = action.payload.nickName;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loginStatus = true;
        state.avatarUrl = action.payload.avatarUrl;
        state.nickName = action.payload.nickName;
      })
      .addCase(updateClassMode.pending, () => {
        Taro.showToast({ icon: 'loading' })
      })
      .addCase(updateClassMode.rejected, () => {
        Taro.showToast({ title: '失败啦' })
      })
      .addCase(updateClassMode.fulfilled, (state, action) => {
        state.classMode = action.payload;
      })
})

// Action creators are generated for each case reducer function
export const { setLoginStatus } = userSlice.actions

export default userSlice.reducer