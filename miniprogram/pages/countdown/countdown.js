// pages/countdown/countdown.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({

	/**
	 * Page initial data
	 */
  data: {
    // 用户所有的作业
    addCountDown: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加倒计时.png",
    notificationSetting: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/提醒设置.png",
    add: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加按钮.png",
    showTrue: false,
    inputShowed: false,
    inputVal: "",
    // userAssignments: [
    //   {
    //     id: 0,
    //     countdown: '2020-12-21',
    //     name: 'CSSE1001',
    //     color: '#8877FF',
    //     notification: {
    //       n1: true
    //     }
    //   },
    //   {
    //     id: 1,
    //     countdown: '2020-12-21',
    //     name: 'CSSE2002',
    //     color: '#8877FF',
    //     notification: {
    //       n2: true
    //     }
    //   },
    //   {
    //     id: 2,
    //     countdown: '2020-12-21',
    //     name: 'CSSE3003',
    //     color: '#8877FF',
    //     notification: {
    //       n3: true
    //     }
    //   }
    // ],
    matchedItems: []

  },
  showInput: function () {
    this.setData({
        inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
        inputVal: "",
        inputShowed: false
    });
  },
  // 清空输入框内容
  clearInput: function () {
    this.setData({
        inputVal: ""
    });
  },
  // 获取输入框内容
  inputTyping: function (e) {
    var value = e.detail.value
    let that = this
    var reg = new RegExp(value)
    var userAssignments = this.data.userAssignments
    var matchedItems = []
    for (var i = 0; i < userAssignments.length; i++) {
      var name = userAssignments[i].name
      if (reg.test(name)) {
        matchedItems.push(userAssignments[i])
      }
    }
    this.setData({
      inputVal: value,
      matchedItems: matchedItems
    })
    console.log(matchedItems[0].name)
  },
  // 用于实现点击“核算”时，来显示与隐藏整个“conts”，这一部分其实是利用了面板的显示与隐藏功能  
  change: function () {
    let that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 通过点击“conts”区域里右上角的关闭按钮来关闭整个“conts”，
  // 当然了，你可以把该事件作用于“conts”上，此时点击“conts”  
  // 的任意一个地方，都会使得这个“conts”关闭  
  close: function () {
    let that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
	/**
	 * Lifecycle function--Called when page load
	 */
  onLoad: function (options) {
    // 如果用户没登录，会提示弹窗
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 获取用户所有的assignments
          var temp = []
          db.collection('MainUser')
            .where(
              {
                _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
              }
            )
            .get()
            .then(
              res => {
                console.log(res.data)
                temp = res.data[0].userAssignment
                // 如果用户有登记过assignment
                if (res.data.length > 0) {
                  var userAssignments = res.data[0].userAssignment
                  app.globalData.userAssignments = userAssignments;
                  var diffs = []
                  var now = new Date().getTime()
                  for (var i = 0; i < userAssignments.length; i++) {
                    var d = new Date(userAssignments[i]["date"]).getTime()
                    // 计算两者时间差（和云函数同款）
                    var diff = parseInt((d - now) / (1000 * 60 * 60 * 24))
                    diffs.push(diff)
                    userAssignments[i]["countdown"] = diff
                    // 计算style中的进度条百分比
                    var percentage = Number(diff / 20 * 100).toFixed(1)
                    if (percentage > 100) {
                      percentage = 0
                    } else {
                      percentage = 100 - percentage
                    }
                    userAssignments[i]["percentage"] = percentage
                  }
                  console.log("用户的作业有：")
                  console.log(userAssignments)
                  var minValue = Math.min.apply(null, diffs)
                  // 匹配最近的作业名称
                  for (var i = 0; i < res.data.length; i++) {
                    var d = new Date(userAssignments[i]["date"]).getTime()
                    var diff = parseInt((d - now) / (1000 * 60 * 60 * 24))
                    if (diff == minValue) {
                      var name = userAssignments[i]["name"]
                      // 决定了header的assignment即为i代表的assignment值
                      this.setData({
                        userAssignments: temp,
                        headerAssignment: userAssignments[i],
                        recentAssignmentName: name,
                        recentAssignmentDate: minValue
                      })
                      // 不确定是不是要把最近的那项删掉
                      // userAssignments.splice(i, 1)
                      this.setData({
                        userAssignments: userAssignments,
                      })
                    }
                  }
                }
              }
            )
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '您还没有登录哦',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '/pages/profile/profile',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.switchTab({
                  url: '/pages/home/home',
                })
              }
            }
          })
        }
      }
    })
      

  },
  /**
   * slide-delete 删除产品
   */
  handleSlideDelete({ detail: { id } }) {
    let assignments = this.data.userAssignments
    let productIndex = assignments.findIndex(item => item.id === id)
    // this的作用域不适用于showModal内部，需要另一个变量做引用
    let self = this
    wx.showModal({
      title: '删除该项作业',
      content: '您确定要删除吗？',
      success(res) {
        if (res.confirm) {
          assignments.splice(productIndex, 1)
          self.setData({
            userAssignments: assignments
          })
          // 数据库删除
        }
      }
    })
  },
  /**
   * 用户点击单项作业时，可以跳转到showCountDown页面
   * 显示该项作业
   */
  bindTap: function(e) {
    var index = e.currentTarget.dataset.index
    // 将数据通过json格式传递到下一个页面
    var query = JSON.stringify(this.data.userAssignments[index])
    console.log(query)
    wx.navigateTo({
      url: '/pages/addCountDown/addCountDown',
      success: function(res) {
        // 通过eventChannel向被打开页面传送正在被点击的assignment信息
        res.eventChannel.emit('acceptDataFromOpenerPage', query)
      }
    })
  }
})