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
    australia: false,
    templateID: '3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U',
    timeZone: "中国"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({australia: true})
    if (app.globalData.notification) {
      var notification = app.globalData.notification
      this.setData(
        {
          emailNotification: notification.emailNotification,
          wechatNotification: notification.wechatNotification,
          oneDay: notification.oneDay,
          threeDay: notification.threeDay,
          oneWeek: notification.oneWeek
        }
      )
      if (notification.location == "CH") {
        this.setData({china: true, australia: false})
      } else if (notification.location == "AU") {
        this.setData({australia: true, china: false})
      }

    } else {
      db.collection("MainUser")
      .where({
        _openid: app.globalData._openid
      })
      .get().then(
        res => {
          if (res.data.length > 0) {
            var notification = res.data[0].notification
            this.setData(
              {
                emailNotification: notification.emailNotification,
                wechatNotification: notification.wechatNotification,
                oneDay: notification.oneDay,
                threeDay: notification.threeDay,
                oneWeek: notification.oneWeek
              }
            )
            if (notification.location == "CH") {
              this.setData({china: true, australia: false})
            } else if (notification.location == "AU") {
              this.setData({australia: true, china: false})
            }
          }
        })
    }
    
    if (this.data.wechatNotification == true) {
      wx.getSetting({
        withSubscriptions: true,
        success (res) {
          if (!res.subscriptionsSetting.itemSettings) {
            wx.showModal({
              title: '提示',
              content: "系统检测到您未在订阅消息勾选总是保持以上选择，为保证您的体验，请一定要勾选哦！"
            })
          } else {
            console.log(res.subscriptionsSetting.itemSettings)
            
          }
        }
      })
    }
    
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
    this.setData({china: e.detail.value})
    if (this.data.australia == true) {
      this.setData({
        australia: false
      })
    }
    if (this.data.china == true) {
      this.setData({timeZone: "中国"})
    } else {
      this.setData({timeZone: "澳洲"})
    }
  },
  bindAustralia: function(e) {
    this.setData({australia: e.detail.value})
    if (this.data.china == true) {
      this.setData({
        china: false
      })
    }
    if (this.data.china == true) {
      this.setData({timeZone: "中国"})
    } else {
      this.setData({timeZone: "澳洲"})
    }
  },
  bindOneDay: function (e) {
    let that = this
    if (this.data.wechatNotification != true 
      && this.data.emailNotification != true) {
      wx.showModal({
        title: "提示",
        content: "你好像忘记设置微信或邮箱提醒了哦！"
      })
      return
    }
    // that.setData({oneDay: e.detail.value})
    if (this.data.wechatNotification == true && e.detail.value == true) {
      var templateID = this.data.templateID
      wx.requestSubscribeMessage({
        tmplIds: [templateID],
        success (res) {
          if (res['3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U'] == 'accept') {
            that.setData(
              {
                oneDay: true
              }
            )
          } else {
            that.setData(
              {
                oneDay: false
              }
            )
          }
        }
      })
    }
    if (e.detail.value == false) {
      that.setData(
        {
          oneDay: false
        }
      )
    }
    
  },
  bindThreeDay: function (e) {
    let that = this
    if (this.data.wechatNotification != true 
      && this.data.emailNotification != true) {
      wx.showModal({
        title: "提示",
        content: "你好像忘记设置微信或邮箱提醒了哦！"
      })
      return
    }

    if (this.data.wechatNotification == true && e.detail.value == true) {
      var templateID = this.data.templateID
      wx.requestSubscribeMessage({
        tmplIds: [templateID],
        success (res) {
          if (res['3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U'] == 'accept') {
            that.setData(
              {
                threeDay: true
              }
            )
          } else {
            that.setData(
              {
                threeDay: false
              }
            )
          }
        }
      })
    }
    if (e.detail.value == false) {
      that.setData(
        {
          threeDay: false
        }
      )
    }
  },
  bindOneWeek: function (e) {
    let that = this
    if (this.data.wechatNotification != true 
      && this.data.emailNotification != true) {
      wx.showModal({
        title: "提示",
        content: "你好像忘记设置微信或邮箱提醒了哦！"
      })
      return
    }
    if (this.data.wechatNotification == true && e.detail.value == true) {
      var templateID = this.data.templateID
      wx.requestSubscribeMessage({
        tmplIds: [templateID],
        success (res) {
          if (res['3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U'] == 'accept') {
            that.setData(
              {
                oneWeek: true
              }
            )
          } else {
            that.setData(
              {
                oneWeek: false
              }
            )
          }
        }
      })
    }
    if (e.detail.value == false) {
      that.setData(
        {
          oneWeek: false
        }
      )
    }
  },
  confirm: function(e) {
    // 更新数据库
    console.log(app.globalData._openid)
    console.log(this.data.oneDay)
    console.log(this.data.threeDay)
    console.log(this.data.oneWeek)
    let location = ''
    if (this.data.australia == true) {
      location = "AU"
    } else if (this.data.china == true){
      location = "CH"
    } else {
      location = ""
    }
    db.collection("MainUser")
    .where({
      _openid: app.globalData._openid
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
        console.log(res)
      }
    })
    app.globalData.notification = {
      location: location,
      wechatNotification: this.data.wechatNotification,
      emailNotification: this.data.emailNotification,
      oneDay: this.data.oneDay,
      threeDay: this.data.threeDay,
      oneWeek: this.data.oneWeek
    }
    wx.showToast({
      title: '成功',
      icon: 'succes',
      duration: 1000,
      mask:true
    })
    
  },
  
  requestSubscribe: function() {
    var templateID = '3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U'
    wx.requestSubscribeMessage({
      // tmplIds: ['YWEyy0vIoy9kdb12oU9Nr5YvizOF0Z1b3x7lwdZ8AFI'],
      tmplIds: [templateID],
      success (res) {
        console.log(res)
      }
    })
  },
  testCrontab: function() {
    wx.cloud.callFunction({
      name: 'crontab',
      data :{
      },
      success: res => {
          console.log(res)
      },
      fail: err => {
          console.error(err)
      }
    })
  }
})