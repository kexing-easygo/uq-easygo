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
    addBlack:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/黑色按钮.png",
    historyIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加按钮.png",
    showTrue: false,
    showAll: true,
    userAssignments: [],
    matchedItems: [],
    selectMatchedItem: false,
    selectedAssignments: [],
    showResult: "",
    history: [],
    startsearch: false,
    searchFocus: false,
    searchBarValue: "",
    style: "countdown_days",
    recentAssignmentDate: "∞",
    recentAssignmentName: "None",
    clear: false
  },
  //显示搜索记录
  startsearch: function (value) {
    if (this.data.searchBarValue.length > 0) {
      this.setData({
        startsearch: true,
      })  
    }
    this.setData({
      searchFocus: false
    })
  },
  //用户点击搜索记录的时候，跳转到对应界面
  historyTap: function (value) {
    //
    this.setData({
      showHistory: false,
    })
    var history = value['target']['dataset']['historytag'];
    var temp = [];
    if (history != null) {
      this.data.userAssignments.forEach(element => {
        if (element['name'] == history) {
          temp.push(element);
        }
      });
      this.setData({
        selectMatchedItem: true,
        selectedAssignments: temp,
        showAll: false,
        showResult: "hidden",
        recentAssignmentName: temp[0].name,
        recentAssignmentDate: temp[0].countdown,
        searchBarValue: temp[0].name,
        searchFocus: false,
      })
    }

  },

  search: function (value) {
    // 只在输入框有东西的时候再输入
    // this.setData({clear: false})
    if (value.length > 0) {
      this.setData({
        showAll: false,
        showResult: true,
        searchFocus: true,
        startsearch: true
      })
      var reg = new RegExp(value)
      var matchedItems = []
      for (var i = 0; i < this.data.userAssignments.length; i++) {
        var name = this.data.userAssignments[i].name
        if (reg.test(name)) {
          matchedItems.push({
            text: this.data.userAssignments[i].name,
            value: i
          })
        }
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(matchedItems)
        }, 200)
      })
    }

  },
  selectResult: function (e) {
    var key = e.detail.item.value
    var temp = []
    // 选中的作业项目
    temp.push(this.data.userAssignments[key])
    this.setData({
      selectMatchedItem: true,
      selectedAssignments: temp,
      recentAssignmentName: this.data.userAssignments[key].name,
      recentAssignmentDate: this.data.userAssignments[key].countdown,
      showAll: false,
      showResult: "hidden",
      startsearch: false,
    })
  },
  clear: function (e) {
    var tempName = "None";
    var tempCD = "∞";
    if (this.data.userAssignments.length > 0) {
      tempName = this.data.userAssignments[0].name;
      tempCD = this.data.userAssignments[0].countdown;
      this.data.userAssignments.forEach(element => {
        if (element.countdown < tempCD) {
          tempName = element.name;
          tempCD = element.countdown;
        }
      });
    }
    
    this.setData({
      startsearch: false,
      showAll: true,
      selectMatchedItem: false,
      selectedAssignments: [],
      recentAssignmentDate: tempCD,
      recentAssignmentName: tempName,
      matchedItems: [],
      showResult: "",
      searchFocus: true
    });
  },

  hideHistory: function (e) {
    this.setData({
      showHistory: false,
    });
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
    this.setData({
      search: this.search.bind(this)
    })

    let that = this
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 获取用户所有的assignments
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              app.globalData._openid = res.result.openid
              var temp = []
              db.collection('MainUser')
                .where({
                  _openid: app.globalData._openid
                })
                .get({
                  success: function (res) {
                    temp = res.data[0].userAssignments
                    // 如果用户有登记过assignment
                    if (temp.length > 0) {
                      var userAssignments = res.data[0].userAssignments;
                      app.globalData.userAssignments = userAssignments;
                      var diffs = [];
                      var now = new Date().getTime();
                      if (res.data[0].notification.location == "AU") {
                        // 转化为澳洲时间计算
                        now += 2 * 60 * 60 * 1000;
                      }
                      for (var i = 0; i < userAssignments.length; i++) {
                        var date = userAssignments[i]["date"]
                        var time = userAssignments[i]["time"]
                        var string = date + "T" + time + ":00"
                        var d = new Date(string).getTime()
                        var diff = parseInt((d - now) / (1000 * 60 * 60 * 24))
                        diffs.push(diff)
                        // 计算style中的进度条百分比
                        var percentage = Number(diff / 20 * 100).toFixed(1)
                        if (percentage >= 100) {
                          percentage = 0
                        } else if (percentage < 100 && percentage > 0) {
                          percentage = 100 - percentage
                        } else {
                          percentage = 100
                        }
                        console.log(percentage);
                        userAssignments[i]["countdown"] = diff
                        userAssignments[i]["id"] = i
                        userAssignments[i]["percentage"] = percentage
                        userAssignments[i]["diff"] = diff
                      }
                      var minValue = Math.min.apply(null, diffs)
                      // 匹配最近的作业名称
                      for (var i = 0; i < userAssignments.length; i++) {
                        var diff = userAssignments[i]["diff"]
                        if (diff == minValue) {
                          var name = userAssignments[i]["name"]

                          // 决定了header的assignment即为i代表的assignment值
                          that.setData({
                            // headerAssignment: userAssignments[i],
                            recentAssignmentName: name,
                            recentAssignmentDate: minValue,
                            userAssignments: userAssignments,
                            history: res.data[0].history.search,
                            showAll: true,
                            selectMatchedItem: false,
                            selectedAssignments: [],
                            matchedItems: [],
                            showResult: "",
                            showHistory: false,
                            searchFocus: false,
                          })
                        }
                      }
                    }

                  }
                })
            }
          })


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
   * 用户点击单项作业时，可以跳转到showCountDown页面
   * 显示该项作业
   */
  bindTap: function (e) {
    var index = e.currentTarget.dataset.index
    // 将数据通过json格式传递到下一个页面
    var query = JSON.stringify({
        index: index,
        data: this.data.userAssignments[index]
      }

    )
    wx.navigateTo({
      url: '/pages/addCountDown/addCountDown',
      success: function (res) {
        // 通过eventChannel向被打开页面传送正在被点击的assignment信息
        res.eventChannel.emit('acceptDataFromOpenerPage', query)
      }
    })
  }
})