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
    openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8",
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
        // console.log(res.data.length)
        if (res.data.length == 0) {
          console.log("No data found.")
        } else { //如果存在 -> 更新已有的记录
          app.globalData.userID = res.data[0]._id
          app.globalData.userEmail = res.data[0].email
          db.collection('MainUser').doc(res.data[0]._id).update({
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
    // 将nickName录入数据库
    db.collection('MainUser')
      .add({
        data: {
          userInfo: e.detail.userInfo,
          userAssignments: []
        }
      })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})