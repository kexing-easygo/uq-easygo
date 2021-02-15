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
    oneDay: false,
    threeDay: false,
    oneWeek: false,
    china: false,
    australia: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindSwitch1: function (e) {
    this.setData({
      wechatNotification: e.detail.value
    })
  },

  bindSwitch2: function (e) {
    this.setData({
      emailNotification: e.detail.value
    })
  },
  bindChina: function(e) {
    this.setData({
      china: e.detail.value
    })
    if (this.data.china == true) {
      this.setData({
        australia: false
      })
    } else {
      this.setData({
        australia: true
      })
    }
  },
  bindAustralia: function(e) {
    this.setData({
      australia: e.detail.value
    })
    if (this.data.australia == true) {
      this.setData({
        china: false
      })
    } else {
      this.setData({
        china: true
      })
    }
  },
  bindOneDay: function (e) {
    var temp = 0
    if (e.detail.value == true) {
      temp = 1
    } else {
      temp = 0
    }
    this.setData(
      {
        oneDay: temp
      }
    )
  },
  bindThreeDay: function (e) {
    var temp = 0
    if (e.detail.value == true) {
      temp = 1
    } else {
      temp = 0
    }
    this.setData(
      {
        threeDay: temp
      }
    )
  },
  bindOneWeek: function (e) {
    var temp = 0
    if (e.detail.value == true) {
      temp = 1
    } else {
      temp = 0
    }
    this.setData(
      {
        oneWeek: temp
      }
    )
  },
  confirm: function(e) {
    // 更新数据库
    let location = ''
    if (australia == true) {
      location = "AU"
    } else {
      location = "CH"
    }
    db.collection("MainUser")
    .where({
      _openid: 'oe4Eh5T-KoCMkEFWFa4X5fthaUG8'
    })
    .update({
      data: {
        notification: {
          location: location,
          wechatNotification: this.data.wechatNotification,
          emailNotification: this.data.emailNotification,
          oneDay: this.data.oneDay,
          threeDay: this.data.threeDay,
          oneWeek: this.data.oneWeek
        }
      }, success: function(res) {
        if (res.stats.updated > 0) {
          console.log("提醒更新成功")
        }
      }
    })
    wx.navigateTo({
      url: '/pages/countdown/countdown',
      success: function (res) {
        var page = getCurrentPages().pop()
        if (page == undefined || page == null) return;
        // 刷新页面
        page.onLoad() 
      }
    })
  }

})