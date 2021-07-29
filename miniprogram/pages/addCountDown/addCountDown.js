// pages/addCountDown/addCountDown.js

const app = getApp()
const db = wx.cloud.database()
const date = new Date()
const years = []
const months = []
const days = []
for (let i = 2021; i <= date.getFullYear(); i++) {
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
    dueDate: "2020-12-31",
    dueTime: '23:59',
    years,
    showDelete: false,
    index: 0,
    buttonText: "确认添加",
    inputDisabled: false, 
    inputFocus: false,
    cursorColor: "black",

    //color flags
    color: "#7986CB",
    clicked_1: false,
    afterGrey: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后灰色选择器.png",
    afterRed: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后红色选择器.png",
    afterYellow: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后黄色选择器.png",
    afterGreen: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后绿色选择器.png",
    afterBlue: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后蓝色选择器.png",

    beforeGrey: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未灰色选择器.png",
    beforeRed: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未红色选择器.png",
    beforeYellow: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未黄色选择器.png",
    beforeGreen: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未绿色选择器.png",
    beforeBlue: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未蓝色选择器.png"
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
    eventChannel.on('acceptDataFromOpenerPage', function (e) {
      // 解码json数据
      var raw = JSON.parse(e)
      var data = raw.data
      if (Object.keys(data).length > 0) {
        // console.log("从上一页面传递进来的data为" + data)
        that.setData({
          title: data.name,
          dueDate: data.date,
          dueTime: data.time,
          color: data.color,
          showDelete: true,
          index: raw.index,
          buttonText: "确认",
          buttonDisabled: false,
          inputDisabled: true
        })
        // 设置该页面标题为作业名称
        wx.setNavigationBarTitle({
          title: data.name,
        })
      } else {
        // that.setData({
        //   buttonDisabled: true
        // })
      }
    })
    wx.hideKeyboard({
      success: (res) => {},
    })
  },
  addCountDown: function () {
    // 用户只有输入完题目、设置好时间日期后，才可以进行下一步
    // 表明是在修改作业条目
    let temp = app.globalData.userAssignments
    let that = this
    if (this.data.buttonText == "确认") {
      // 更新指定条目
      temp[this.data.index] = {
        date: this.data.dueDate,
        name: this.data.title,
        // color是颜色板选择的颜色
        color: this.data.color,
        time: this.data.dueTime
      }
      if (app.globalData.hasUserInfo) {
        db.collection("MainUser")
          .where({
            _openid: app.globalData._openid
          })
          .update({
            data: {
              userAssignments: temp
            },
            success: function (res) {
              if (res.stats.updated > 0) {
                console.log("作业条目更新成功")
                app.globalData.userAssignments = temp
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
            }
          })
      }
      
    } else {
      if (this.data.title == '') {
        wx.showToast({
          title: '请输入作业标题哦～',
          icon: 'none'
        })
        return
      }
      if (this.data.dueDate == '2020-12-31') {
        wx.showToast({
          title: '请修改due的日期哦～',
          icon: 'none'
        })
        return
      }
      if (this.data.dueTime == '23:59') {
        wx.showToast({
          title: '请修改due的时间哦～',
          icon: 'none'
        })
        return
      }
      // 当数据都在的时候才可以添加
        const _ = db.command
        if (app.globalData.hasUserInfo) {
          db.collection("MainUser")
            .where({
              _openid: app.globalData._openid
            })
            .update({
              data: {
                userAssignments: _.push({
                  date: this.data.dueDate,
                  name: this.data.title,
                  // color是颜色板选择的颜色
                  color: this.data.color,
                  time: this.data.dueTime
                })
              },
              success: function (res) {
                if (res.stats.updated > 0) {
                  console.log("作业条目添加成功")
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
              }
            })
        }
      }

  },
  bindTitleInput: function (e) {
    // 获取assignment名称
    this.data.title = e.detail.value
  },
  bindFocus: function(e) {
    this.setData({
      cursorColor: "grey"
    })
  },

  bindBlur: function(e) {
    this.setData({
      cursorColor: "black"
    })
  },
  bindDateChange: function (e) {
    // 设置due date
    this.setData({
      dueDate: e.detail.value
    })

  },
  bindTimeChange: function (e) {
    this.setData({
      dueTime: e.detail.value
    })

  },
  bindRed: function() {
    this.setData({
      color: "#FF7043",
      clicked_1: true,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },

  bindYellow: function() {
    this.setData({
      color: "#FFB300",
      clicked_1: false,
      clicked_2: true,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },

  bindGreen: function() {
    this.setData({
      color: "#8BC34A",
      clicked_1: false,
      clicked_2: false,
      clicked_3: true,
      clicked_4: false,
      clicked_5: false,
    });
  },

  bindBlue: function() {
    this.setData({
      color: "#29B6F6",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: true,
      clicked_5: false,
    });
  },

  bindGrey: function() {
    this.setData({
      color: "#576B95",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: true,
    });
  },
  deleteCountdown: function () {
    let temp = app.globalData.userAssignments
    let that = this
    if (!app.globalData.hasUserInfo) {
      wx.showToast({
        title: '你需要登陆才能使用倒计时的删除功能哦！',
        icon: "none"
      })
      return
    }
    wx.showModal({
      title: "删除倒计时",
      content: "是否确定要删除？",
      success(res) {
        if (res.confirm) {
          if (app.globalData.hasUserInfo) {
            temp.splice(that.data.index, 1)
            db.collection("MainUser")
              .where({
                _openid: app.globalData._openid
              })
              .update({
                data: {
                  userAssignments: temp
                },
                success: function (res) {
                  if (res.stats.updated > 0) {
                    console.log("作业条目删除成功")
                  }
                }
              })
          }
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
      }
    })
  }
})