// pages/addCountDown/addCountDown.js

const app = getApp()
const db = wx.cloud.database()
const date = new Date()
const years = []
const months = []
const days = []
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

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
    dueDate: "2020-01-02",
    color: "",
    notificationDate: {},
    hours24: false,
    hours48: false,
    hours72: false,
    buttonDisabled: false,
    years,
    items: [
      {value: 'USA', name: '美国'},
      {value: 'CHN', name: '中国', checked: 'true'},
      {value: 'BRA', name: '巴西'},
      {value: 'JPN', name: '日本'},
      {value: 'ENG', name: '英国'},
      {value: 'FRA', name: '法国'},
    ]
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
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      items
    })
  }
})