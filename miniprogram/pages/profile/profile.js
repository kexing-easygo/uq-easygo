// pages/profile/profile.js
const app = getApp()
const db = wx.cloud.database()
const command = db.command

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    openid: app.globalData.openid,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    anonymousPlaceholder: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未登录用户.jpeg"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    //先获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log("openid获取成功: ", res.result.openid)
        this.setData({
          openid: res.result.openid
        })
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('openid获取失败: ', err)
      }
    })

    //从云数据库中检索该openid是否存在
    db.collection('MainUser').where({
      _openid: this.data.openid
    }).get().then(
      res => {
        if (res.data.length == 0) {
          console.log("No data found.")
        } else { //如果存在 -> 更新已有的记录
          app.globalData.userID = res.data[0]._id
          app.globalData.userEmail = res.data[0].userEmail
          app.globalData.userAssignments = res.data[0].userAssignments
          db.collection('MainUser')
            .doc(res.data[0]._id).update({
              data: {
                userInfo: res.data[0].userInfo
              }
            })
          this.setData({
            userInfo: res.data[0].userInfo,
            canIUse: true,
            hasUserInfo: true
          })
        }
      })
  },

  getUserInfo: function (e) {

    //部署库中data到界面中
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    // 将新用户的信息录入数据库
    db.collection('MainUser')
      .add({
        data: {
          userInfo: e.detail.userInfo,
          userAssignments: [],
          userEmail: ""
        }
      })
      .then(res => {
        console.log(res)
      })

  },
})