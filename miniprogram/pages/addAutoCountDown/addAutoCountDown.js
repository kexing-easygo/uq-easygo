// miniprogram/pages/addAutoCountDown.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  return y + "-" + m + "-" + d;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 0,
    clicked_1: false,
    clicked_2: false,
    clicked_3: false,
    clicked_4: false,
    clicked_5: false,
    selectedAssessments: [],
    oneDay: false,
    threeDay: false,
    oneWeek: false,
    wechatNotification: false,
    emailNotification: false,
    templateID:'3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U'
  },
  bindSwitch1: function (e) {
    this.setData({
      wechatNotification: e.detail.value
    })
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
  },

  bindSwitch2: function (e) {
    this.setData({
      emailNotification: e.detail.value
    })
  },
  bindRed: function() {
    this.setData({
      color: "#FA5151",
      clicked_1: true,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindPink: function() {
    this.setData({
      color: "#FFC300",
      clicked_1: false,
      clicked_2: true,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindLightBlue: function() {
    this.setData({
      color: "#07C160",
      clicked_1: false,
      clicked_2: false,
      clicked_3: true,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindPurple: function() {
    this.setData({
      color: "#1485EE",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: true,
      clicked_5: false,
    });
  },
  bindYellow: function() {
    this.setData({
      color: "#576B95",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: true,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 读取全局缓存
    console.log(app.globalData.selectedAssessments);
    that.setData({
      selectedAssessments: app.globalData.selectedAssessments
    })
    const eventChannel = that.getOpenerEventChannel()
    eventChannel.on("acceptDataFromOpenerPage", function(d) {
      that.setData({
        selectedAssessments: d.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    if (this.data.wechatNotification == true && e.detail.value == true) {
      var templateID = this.data.templateID
      console.log("?")
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
  requestSubscribe: function() {
    var templateID = '3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U'
    wx.requestSubscribeMessage({
      tmplIds: [templateID],
      success (res) {
        console.log(res)
      }
    })
  },
  confirm: function() {
    var color = this.data.color;
    let that = this;
    var ass = this.data.selectedAssessments;
    for (var i = 0; i < ass.length; i++) {
      // 更新color字段
      ass[i].color = color;
      // TODO: 解析到TBD，自动变为30天后
      if (ass[i].date == "TBD") {
        ass[i].date = GetDateStr(30);
        ass[i].time = "00:00"
      }
      db.collection("MainUser")
      .where({
        _openid: app.globalData._openid
      })
      .update({
        data: {
          userAssignments: _.push(ass[i])
        },
        success: function (res) {
          if (res.stats.updated > 0) {
            console.log("作业条目添加成功")
          }
        }
      })
    }
    db.collection("MainUser")
    .where({
      _openid: app.globalData._openid
    })
    .update({
      data: {
        notification: {
          wechatNotification: that.data.wechatNotification,
          emailNotification: that.data.emailNotification,
          oneDay: that.data.oneDay,
          threeDay: that.data.threeDay,
          oneWeek: that.data.oneWeek
        }
      },
      success: function (res) {
        console.log(res)
      }
    })
    wx.reLaunch({
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