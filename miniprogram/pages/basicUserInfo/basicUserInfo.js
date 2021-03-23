// pages/basicUserInfo/basicUserInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    hasUserInfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (app.globalData.hasUserInfo) {
      that.setData({
        hasUserInfo: true,
        nickName: app.globalData.userInfo.nickName
      })
    } else {
      wx.showToast({
          title: '你还没有登录哦',
          icon: 'none',
          duration: 2000
      })
    }
  }
})