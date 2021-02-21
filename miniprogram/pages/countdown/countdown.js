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
      historyIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加按钮.png",
      showTrue: false,
      showAll: true,
      userAssignments: [],
      matchedItems: [],
      selectMatchedItem: false,
      selectedAssignments: [],
      showResult: "",
      history: [],
      showHistory: false,
    },
  //显示搜索记录
  showHistory: function (value) {
    this.setData({
      showHistory: true,
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
        showResult: "hidden"
      })
    }

  },

  search: function (value) {
    console.log(value);
    // 只在输入框有东西的时候再输入
    if (value.length > 0) {
      this.setData(
          {
            showAll: false,
            showResult: true,
            showHistory: "display:none",
          }
      )
      var reg = new RegExp(value)
      var matchedItems = []
      for (var i = 0; i < this.data.userAssignments.length; i++) {
        var name = this.data.userAssignments[i].name
        if (reg.test(name)) {
          matchedItems.push(
            {
              text: this.data.userAssignments[i].name,
              value: i
            }
          )
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
    this.setData(
      {
        selectMatchedItem: true,
        selectedAssignments: temp,
        showAll: false,
        showResult: "hidden"
      }
    )
  },
  clear: function(e) {
    this.setData(
        {
          showAll: true,
          selectMatchedItem: false,
          selectedAssignments: [],
          matchedItems: [],
          showResult: "",
          showHistory: "display:none",
        }
    )

  },

  hideHistory: function(e) {
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
          var temp = []
          db.collection('MainUser')
              .where(
                  {
                    _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
                  }
              )
              .get({
                    success: function (res) {
                      temp = res.data[0].userAssignments;
                      
                      // 如果用户有登记过assignment
                      if (res.data.length > 0) {
                        
                        var userAssignments = res.data[0].userAssignments;
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
                        var minValue = Math.min.apply(null, diffs)
                        // 匹配最近的作业名称
                        for (var i = 0; i < temp.length; i++) {
                          temp[i]["id"] = i
                          var d = new Date(userAssignments[i]["date"]).getTime()
                          var diff = parseInt((d - now) / (1000 * 60 * 60 * 24))
                          if (diff == minValue) {
                            var name = userAssignments[i]["name"]
                            // 决定了header的assignment即为i代表的assignment值
                            that.setData({
                              userAssignments: temp,
                              headerAssignment: userAssignments[i],
                              recentAssignmentName: name,
                              recentAssignmentDate: minValue,
                              history: res.data[0].history.countdown,

                            })
                            
                          }
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
   * 用户点击单项作业时，可以跳转到showCountDown页面
   * 显示该项作业
   */
  bindTap: function(e) {
    var index = e.currentTarget.dataset.index
    // 将数据通过json格式传递到下一个页面
    var query = JSON.stringify(
      {index: index,
      data: this.data.userAssignments[index]}
      
    )
    wx.navigateTo({
      url: '/pages/addCountDown/addCountDown',
      success: function(res) {
        // 通过eventChannel向被打开页面传送正在被点击的assignment信息
        res.eventChannel.emit('acceptDataFromOpenerPage', query)
      }
    })
  }
})