import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { getUserProfile } from '../services/login'
import { fetchUserInfo, updateClassMode, getCardsInfo, manageCards, updateEmail, updateMobile } from '../services/profile'

// 初始化状态
const initialState = {
  loginStatus: false, // 是否已经登录
  classMode: '',      // 上课模式
  avatarUrl: '',      // 头像
  nickName: '',       // 昵称
  userEmail: '',      // 邮箱
  userMobile: '',     // 手机号
  cardsInfo: {
    newActivities: 1,
    todayClasses: 1,
    recentAssignments: 1
  }       // 自定义卡片显示 
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
        console.log('fetch userInfo ', action.payload);
        state.classMode = action.payload.classMode ?? '';
        state.avatarUrl = action.payload.avatarUrl;
        state.nickName = action.payload.nickName;
        state.userEmail = action.payload.userEmail;
        state.userMobile = action.payload.userMobile;
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
      .addCase(getCardsInfo.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(getCardsInfo.fulfilled, (state, action) => {
        state.cardsInfo = action.payload;
      })
      .addCase(manageCards.rejected, (state, action) => {
        Taro.showToast({ title: '网络错误' })
        console.log(action.error.message);
      })
      .addCase(manageCards.fulfilled, (state, action) => {
        state.cardsInfo = action.payload;
      })
      // 更新邮箱
      .addCase(updateEmail.pending, (state, action) => {
        Taro.showToast({ icon: 'loading' })
      })
      .addCase(updateEmail.rejected, (state, action) => {
        Taro.showToast({ title: '网络错误，请稍后再试' })
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.userEmail = action.payload;
        Taro.navigateBack();
        Taro.showToast({
          title: '邮箱绑定成功',
          icon: 'success',
          duration: 2000
        })
      })
      // 更新手机号
      .addCase(updateMobile.pending, (state, action) => {
        Taro.showToast({ icon: 'loading' })
      })
      .addCase(updateMobile.rejected, (state, action) => {
        Taro.showToast({ title: '网络错误，请稍后再试' })
      })
      .addCase(updateMobile.fulfilled, (state, action) => {
        state.userMobile = action.payload;
        Taro.navigateBack();
      })
})

// Action creators are generated for each case reducer function
export const { setLoginStatus } = userSlice.actions

export default userSlice.reducer