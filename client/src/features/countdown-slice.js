import Taro from '@tarojs/taro'
import { createSlice } from '@reduxjs/toolkit'
import { fetchAllCountDown, appendNewCountDown, deleteCountDown, updateCountDown } from '../services/countdown'
import { getNotifications, setNotifications, autoAppendAssignments } from '../services/countdown'

const initialState = {
  userCountDown: '', //用户的全部countdown条目
  itemDetail: '',
  notifications: {
    wechat: {enabled: false, attributes: [0, 0, 0]},
    email: {enabled: false, attributes: [0, 0, 0]}
  },
  askSave: false,
  clickedAss: {},
  showDetailSheet: false,
  notifyMenu: false
}

export const countdownSlice = createSlice({
  name: 'countdown',
  initialState,
  //reducer no internet request 
  reducers: {
    setUserCountDown: (state, action) => {
      state.userCountDown = action.payload
    },
    resetAskSave: (state, action) => {
      state.askSave = false
    },
    setAskSave: (state, action) => {
      state.askSave = true
    },
    setClickedAss: (state, action) => {
      state.clickedAss = action.payload
    },
    setDetailSheet: (state, action) => {
      state.showDetailSheet = true
    },
    closeDetailSheet: (state, action) => {
      state.showDetailSheet = false
    },
    setNotifyMenu: (state, action) => {
      state.notifyMenu = action.payload
    }
  },

  // extraReducers deal with the internet request status (success or fail)
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCountDown.fulfilled, (state, action) => {
        state.userCountDown = action.payload.assignments
        console.log('fetch user countdown success', state.userCountDown);
      })
      .addCase(fetchAllCountDown.rejected, () => {
        console.log('fetch user countdown failed')
      })
      .addCase(appendNewCountDown.fulfilled, (state, action) => {
        console.log('append success', action.payload)
        state.userCountDown = action.payload
      })
      .addCase(appendNewCountDown.rejected, () => {
        console.log('append failed')
      })
      .addCase(deleteCountDown.fulfilled, (state, action) => {
        console.log('delete success', action.payload)
        state.userCountDown = action.payload
      })
      .addCase(deleteCountDown.rejected, () => {
        console.log('delete failed')
      })
      .addCase(updateCountDown.fulfilled, (state, action) => {
        console.log('update success', action.payload)
        state.userCountDown = action.payload
      })
      .addCase(updateCountDown.rejected, () => {
        console.log('update failed')
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        console.log('获取提醒设置成功')
        state.notifications = action.payload
      })
      .addCase(setNotifications.fulfilled, () => {
        Taro.showToast({ title: "保存成功", icon: "success" })
      })
      .addCase(autoAppendAssignments.pending, () => {
        Taro.showToast({ title: '保存中', icon: 'loading' })
      })
      .addCase(autoAppendAssignments.fulfilled, (state, action) => {
        console.log(" ::: ", action.payload)
        state.userCountDown.push(...action.payload)
        Taro.showToast({ title: "保存成功", icon: "success" })
        Taro.navigateBack()
      })
  }
})

export const { setUserCountDown, resetAskSave, setAskSave, setClickedAss, setDetailSheet, closeDetailSheet, setNotifyMenu } = countdownSlice.actions
export default countdownSlice.reducer