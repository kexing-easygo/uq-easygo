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
    // hours24: false,
    // hours48: false,
    // hours72: false,
    years,
    showDelete: false,
    index: 0,
    buttonText: "确认添加"
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件
    // 如果是查看assignment而并非点击加号按钮
    // 获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(e) {
      // 解码json数据
      var raw = JSON.parse(e)
      var data = raw.data
      if (data != undefined) {
        // console.log("从上一页面传递进来的data为" + data)
        that.setData({
          title: data.name,
          dueDate: data.date,
          color: data.color,
          showDelete: true,
          index: raw.index,
          buttonText: "确认"
        })
        // 设置该页面标题为作业名称
        wx.setNavigationBarTitle({
          title: data.name,
        })
      }
    })
  },
  addCountDown: function () {
    // 表明是在修改作业条目
    if (this.data.buttonText == "确认") {
      let temp = app.globalData.userAssignments
      let that = this
      // 更新指定条目
      temp[this.data.index] = {
        date: this.data.dueDate,
        name: this.data.title,
        // color是颜色板选择的颜色
        color: this.data.color
      }
      db.collection("MainUser")
        .where({
          _openid: 'oe4Eh5T-KoCMkEFWFa4X5fthaUG8'
        })
        .update({
          data: {
            userAssignment: temp
          }, success: function(res) {
            if (res.stats.updated > 0) {
              console.log("作业条目更新成功")
            }
          }
        })
      
    } else {
      const _ = db.command
      db.collection("MainUser")
        .where({
          _openid: 'oe4Eh5T-KoCMkEFWFa4X5fthaUG8'
        })
        .update({
          data: {
            userAssignment: _.push(
              {
                date: this.data.dueDate,
                name: this.data.title,
                // color是颜色板选择的颜色
                color: this.data.color
              }
            )
          }, success: function(res) {
            if (res.stats.updated > 0) {
              console.log("作业条目更新成功")
            }
          }
        })
    }
    
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
  },
  deleteCountdown: function() {
    let temp = app.globalData.userAssignments
    let that = this
    wx.showModal({
      title: "删除作业",
      content: "是否确定要删除？",
      success (res) {
        if (res.confirm) {
          temp.splice(that.data.index, 1)
          db.collection("MainUser")
          .where({
            _openid: 'oe4Eh5T-KoCMkEFWFa4X5fthaUG8'
          })
          .update({
            data: {
              userAssignment: temp
            }, success: function(res) {
              if (res.stats.updated > 0) {
                console.log("作业条目删除成功")
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
      }
    })
  }
})