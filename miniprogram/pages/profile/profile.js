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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    basicInfoIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/profile/基本信息.png",
    basicSettingIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/profile/基本设置.png",
    bindingEmailIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/profile/邮箱绑定.png",
    bindingPhoneIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/profile/手机绑定.png",
  },

  /**
   * Lifecycle function--Called when page load
   * 调用getSetting接口判断用户是否已经授权
   * 
   */
  onLoad: function (options) {
    let that = this
    // 判断用户是否已经进行过授权
    // 如果是，就直接拿info。否则用button来获得
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: async (res) => {
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
              this.login()
            }
          })
        }
      }
    })
  },

  /**
   * 用户首次获取授权时调用login函数
   * 获取openid。如果openid已经存在，则不再录入
   */
  login: function () {
    let that = this
    //从云数据库中检索该openid是否存在
    db.collection('MainUser')
      .where({
        _openid: app.globalData._openid
      })
      .get().then(
        res => {
          if (res.data.length == 0) {
            db.collection("MainUser")
              .add({
                data: {
                  userAssignments: [],
                  userInfo: that.data.userInfo,
                  userEmail: "",
                  notification: {
                    emailNotification: "",
                    wechatNotification: "",
                    oneDay: "",
                    threeDay: "",
                    oneWeek: "",
                    location: ""
                  },
                  history: {
                    calculator: {},
                    search: {}
                  }
                }
              })
            //如果存在
          } else {
            // 将读取到的所有用户的信息均更新至全局变量中
            app.globalData.userInfo = res.data[0].userInfo
            // app.globalData.userAssignments = res.data[0].userAssignments
            app.globalData.userEmail = res.data[0].userEmail
            app.globalData.notification = res.data[0].notification
            // app.globalData.history = res.data[0].history
            // 更新用户的开放信息
            db.collection('MainUser')
              .where({
                _openid: app.globalData._openid
              })
              .update({
                data: {
                  userInfo: that.data.userInfo
                },
                success: function (s) {
                  console.log(s)
                  if (s.stats.updated > 0) {
                    console.log("更新成功")
                  } else {
                    console.err("更新失败")
                  }
                }
              })
          }
          app.globalData.hasUserInfo = true
        })
  },
  /**
   * 仅获取开放信息，如头像，名字，性别，城市等
   * 
   */
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.hasUserInfo = true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      canIUse: true
    })
    this.login()
  },
})