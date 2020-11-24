// pages/addCountDown/addCountDown.js

const app = getApp()
const db = wx.cloud.database()
const date = new Date()
const years = []
const months = []
const days = []
for (let i = 2020; i <= date.getFullYear(); i++) {
  years.push(i)
}
console.log(years)
for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    dueDate: "",
    color: "",
    notificationDate: {},
    hours24: false,
    hours48: false,
    hours72: false,
    years,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindPrint: function(e) {
    console.log("1")
  },
  bind24: function (e) {
    var temp = 0
    if (e.detail.value == true) {
      temp = 1
    } else {
      temp = 0
    }
    this.setData(
      {
        hours24: temp
      }
    )
  },
  bind48: function (e) {
    var temp = 0
    if (e.detail.value == true) {
      temp = 1
    } else {
      temp = 0
    }
    this.setData(
      {
        hours48: temp
      }
    )
  },
  bind72: function (e) {
    var temp = 0
    if (e.detail.value == true) {
      temp = 1
    } else {
      temp = 0
    }
    this.setData(
      {
        hours72: temp
      }
    )
  },

  addCountDown: function () {
    const _ = db.command
    db.collection("MainUser")
      .where({
        _openid: app.globalData.openid
      })
      .update({
        data: {
          userAssignments: _.push(
            {
              date: this.data.dueDate,
              name: this.data.title,
              notification: {
                "24": this.data.hours24,
                "48": this.data.hours48,
                "72": this.data.hours72
              },
              // color是颜色板选择的颜色
              color: this.data.color
            }
          )
        }
      })
      .then(
        res => {
          console.log("更新成功!")
        }
      )
    wx.navigateTo({
      url: '/pages/countdown/countdown',
    })
  },
  bindTitleInput: function(e) {
    // 获取assignment名称
    this.data.title = e.detail.value
  },
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    // 设置due date
    this.setData({
      dueDate: e.detail.value
    })
  },
  bindRed: function() {
    this.setData({
      color: "#FE5B5B"
    })
  },
  bindPink: function() {
    this.setData({
      color: "#FF8FDE"
    })
  },
  bindLightBlue: function() {
    this.setData({
      color: "#77D5FF"
    })
  },
  bindPurple: function() {
    this.setData({
      color: "#8877FF"
    })
  },
  bindYellow: function() {
    this.setData({
      color: "#E3FF6E"
    })
  },
  bindGreen: function() {
    this.setData({
      color: "#9EFF97"
    })
  }
})