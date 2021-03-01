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
    
  },
  bindAustralia: function(e) {
    this.setData({australia: e.detail.value})
    if (this.data.china == true) {
      this.setData({
        china: false
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
    if (this.data.wechatNotification == true && e.detail.value == true) {
      this.requestSubscribe()
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
    if (this.data.wechatNotification == true && e.detail.value == true) {
      this.requestSubscribe()
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
    
    if (this.data.wechatNotification == true && e.detail.value == true) {
      this.requestSubscribe()
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
    wx.requestSubscribeMessage({
      tmplIds: ['YWEyy0vIoy9kdb12oU9Nr5YvizOF0Z1b3x7lwdZ8AFI'],
      success (res) {
        console.log(res)
      }
    })
  },

  // template: function() {
  //   wx.cloud.callFunction({
  //     name: 'sendTemplate',
  //     data :{
  //       作业标题: "1",
  //       时间:"2021-02-20",
  //       截止时间:"2021-02-25",
  //       提醒内容:"无",
  //       备注:"无"
  //     },
  //     success: res => {
  //         console.log(res)
  //     },
  //     fail: err => {
  //         console.error("模版云函数调用失败。")
  //         console.error(err)
  //     }
  //   })
  // },
  testCrontab: function() {
    
  }
})