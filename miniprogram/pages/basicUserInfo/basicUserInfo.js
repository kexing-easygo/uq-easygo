// pages/basicUserInfo/basicUserInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    easygoNickname: null,
    userGender: null,
    hasAccountAllocated: false,
    account: null,
    easygoAccount: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = {}
    var gender = ''
    let that = this
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: async (res) => {
              userInfo = res.userInfo
              if (userInfo.gender == 1) {
                gender = "男"
              } else if (userInfo.gender == 2) {
                gender = "女"
              } else {
                gender = "未知"
              }
              that.setData( {
                userInfo: res.userInfo,
                hasUserInfo: true,
                userGender: gender
              })
            }
          })
        } else {
          // 如果用户还没有登录，提示未登录
          wx.showToast({
              title: '你还没有登录哦',
              icon: 'none',
              duration: 2000
          })
      }
      }
    })
  },

})