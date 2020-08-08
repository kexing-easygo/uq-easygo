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
    this.setData(
      {
        hours24: e.detail.value
      }
    )
  },
  bind48: function (e) {
    this.setData(
      {
        hours48: e.detail.value
      }
    )
  },
  bind72: function (e) {
    this.setData(
      {
        hours72: e.detail.value
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
    if (this.data.title.length > 0) {
      if (e.detail.value.length > 0) {
        this.setData({
          buttonDisabled: false
        })
      }
    }
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