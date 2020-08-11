// pages/notificationSetting/notificationSetting.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechatNotification: app.globalData.wechatNotification,
    emailNotification: app.globalData.emailNotification,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindSwitch1: function (e) {
    this.wechatNotification = e.detail.value
    db.collection('MainUser').where({
      _openid: app.globalData.openid
    }).update(
      {
        data: {
          wechatNotification: this.data.wechatNotification

        }
      }
    )
  },

  bindSwitch2: function (e) {
    this.emailNotification = e.detail.value
    db.collection('MainUser').where({
      _openid: app.globalData.openid
    }).update(
      {
        data: {
          emailNotification: this.data.emailNotification
        }
      }
    )
  }
})