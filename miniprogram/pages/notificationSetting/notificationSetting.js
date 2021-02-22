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
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'uqeasygo1',
        traceUser: true,
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
    this.setData(
      {
        oneDay: temp
      }
    )
    if (this.wechatNotification == true) {
      this.requestSubscribe()
    }
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
    if (this.wechatNotification == true) {
      this.requestSubscribe()
    }
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
    if (this.wechatNotification == true) {
      this.requestSubscribe()
    }
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
  },
  
  requestSubscribe: function() {
    wx.requestSubscribeMessage({
      tmplIds: ['YWEyy0vIoy9kdb12oU9Nr5YvizOF0Z1b3x7lwdZ8AFI'],
      success (res) {
        console.log(res)
      }
    })
  },

  template: function() {
    wx.cloud.callFunction({
      name: 'sendTemplate',
      success: res => {
          console.log(res)
      },
      fail: err => {
          console.error("模版云函数调用失败。")
          console.error(err)
      }
    })
  },
  testCrontab: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'crontab',
      // 传给云函数的参数
      success: function(res) {
        console.log(res) // 3
      },
      fail: console.error
    })
  }
})