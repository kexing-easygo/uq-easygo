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
  },
  testCrontab: function() {
    // wx.requestSubscribeMessage({
    //   tmplIds: ['YWEyy0vIoy9kdb12oU9Nr5YvizOF0Z1b3x7lwdZ8AFI'],
    //   success (res) {
    //     console.log(res)
    //   }
    // })
    // wx.cloud.callFunction({
    //   name: 'sendTemplate',
    //   // data: {
    //   //     "toAddr": this.data.inputEmailValue,
    //   //     "subject": "UQ校园通", 
    //   //     "content": content,
    //   // },
    //   success: res => {
    //       console.log(res)
    //   },
    //   fail: err => {
    //       console.error("模版云函数调用失败。")
    //       console.error(err)
    //   }
    // })
    wx.getSetting({
      withSubscriptions: true,
      success (res) {
        console.log(res.subscriptionsSetting)
        // res.subscriptionsSetting = {
        //   mainSwitch: true, // 订阅消息总开关
        //   itemSettings: {   // 每一项开关
        //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
        //     SYS_MSG_TYPE_RANK: 'accept'
        //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
        //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
        //   }
        // }
      }
    })
  }

})