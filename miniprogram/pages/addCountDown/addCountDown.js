// pages/addCountDown/addCountDown.js

const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    dueDate: "2020-01-02",
    color: "",
    notificationDate: {},
    hours24: false,
    hours48: false,
    hours72: false,
    buttonDisabled: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  bindTitleInput: function (e) {
    this.setData(
      {
        title: e.detail.value
      }
    )
  },
  bindDateInput: function (e) {
    this.setData(
      {
        dueDate: e.detail.value
      }
    )
  },

  addCountDown: function () {
    // wx.cloud.callFunction({
    //   name: 'sendEmail',
    //   data: {},
    // }).then((res) => {
    //   console.log(res.result)
    // })
    //   .catch(console.error)
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
              color: ""
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
})