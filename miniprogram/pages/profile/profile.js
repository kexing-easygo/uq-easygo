// pages/profile/profile.js
const app = getApp()
// const cloud = require('wx-server-sdk')
const db = wx.cloud.database()
const command = db.command

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    anonymousPlaceholder: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未登录用户.jpeg"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true,
    //     })
    //     app.globalData.userInfo = res.userInfo
    //   }
    // } else {
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo,
    //         this.setData({
    //           userInfo: res.userInfo,
    //         })
    //     }
    //   })
    // }
    

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    // 调用获取用户openid的云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        // 暂时将校园通账户设置为openid
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    // 将nickName录入数据库
    db.collection("UserInfo").add(
      {
        data: {
          userNickname: this.data.userInfo.nickName
        }
      }
    ).then(res => {
      console.log(res)
    })
  },
})