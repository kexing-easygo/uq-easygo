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
    openid: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    // anonymousPlaceholder: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未登录用户.jpeg"
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
              console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
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
  login: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log("openid获取成功: ", res.result.openid)
        this.setData({
          openid: res.result.openid
        })
        //从云数据库中检索该openid是否存在
        db.collection('MainUser')
          .where({
            _openid: res.result.openid
          })
          .get().then(
            res => {
              if (res.data.length == 0) {
                console.log("No data found.")
                db.collection("MainUser")
                  .add({
                    data: {
                      userAssignments: [],
                      userInfo: this.data.userInfo,
                      userEmail: ""
                    }
                  })
              //如果存在
              } else { 
                // 将读取到的所有用户的信息均更新至全局变量中
                app.globalData.openid = res.data[0]._openid
                app.globalData.hasUserInfo = true
                app.globalData.userEmail = res.data[0].userEmail
                app.globalData.userAssignments = res.data[0].userAssignments
                app.globalData.userInfo = res.data[0].userInfo
                // 更新用户的开放信息
                db.collection('MainUser')
                  .doc(res.data[0]._id).update({
                    data: {
                      userInfo: res.data[0].userInfo
                    }
                  })
              }
            })
      },
      fail: err => {
        console.error('openid获取失败: ', err)
      }
    })
  },
  /**
   * 仅获取开放信息，如头像，名字，性别，城市等
   * 
   */
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.openid = this.data.openid
    app.globalData.hasUserInfo = true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      canIUse: true
    })
    this.login()
  },
})