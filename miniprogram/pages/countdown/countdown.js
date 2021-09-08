// pages/countdown/countdown.js
const db = wx.cloud.database()
const app = getApp()
var now = new Date().getTime()
const _ = db.command

function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  return y + "-" + m + "-" + d;
}

var d1 = GetDateStr(4)
var d2 = GetDateStr(30)



Page({

  /**
   * Page initial data
   */
  data: {
    // touch flag
    touchStartX: "",
    // isTouchMove: false, //左滑动为true 

    // 用户所有的作业
    addCountDown: "/images/icons/倒计时/添加倒计时.png",
    notificationSetting: "/images/icons/倒计时/提醒设置.png",
    add: "/images/icons/倒计时/添加按钮.png",
    addBlack: "/images/icons/倒计时/黑色按钮.png",
    autoCountDown: "/images/icons/倒计时/自动添加.png",
    showTrue: false,
    showAll: true,
    d1,
    d2,
    // 新用户进入倒计时的默认作业条目
    defaultUserAssignments: [{
        'color': '#7986CB',
        'name': "CSSE1001 A1 (示例)",
        "date": d1,
        "time": "00:00",
        "default": true
      },
      {
        'color': '#7986CB',
        'name': "点我查看更多",
        "date": d2,
        "time": "00:00",
        "default": true
      }
    ],
    userAssignments: [],
    // matchedItems: [],
    // selectMatchedItem: false,
    // selectedAssignments: [],
    // showResult: "",
    // history: [],
    // startsearch: false,
    // searchFocus: false,
    // searchBarValue: "",
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
  calculatePercentage: function (diff) {
    var percentage = Number(diff / 30 * 100).toFixed(1)
    if (percentage >= 100) {
      percentage = 0
    } else if (percentage < 100 && percentage > 0) {
      percentage = 100 - percentage
    } else {
      percentage = 100
    }
    return percentage
  },
  /**
   * 更新用户作业中的默认作业条目数值。
   * @param {*} assignments 
   */
  updateAssignments: function (assignments) {
    let that = this
    // const arr = [d1, d2]

    for (var i = 0; i < 2; i++) {
      // 默认数据全是写死的
      var date = assignments[i]["date"]
      var time = assignments[i]["time"]
      var string = date + "T" + time + ":00"
      var d = new Date(string).getTime()
      var diff = parseInt((d - now) / (1000 * 60 * 60 * 24))
      var percentage = this.calculatePercentage(diff)
      assignments[i]["countdown"] = diff
      assignments[i]["id"] = i
      assignments[i]["percentage"] = percentage
    }
    that.setData({
      userAssignments: assignments,
      recentAssignmentName: assignments[0].name,
      recentAssignmentDate: assignments[0].countdown,
      history: {
        search: {}
      },
      showAll: true,
      selectMatchedItem: false,
      selectedAssignments: [],
      matchedItems: [],
      showResult: "",
      showHistory: false,
      searchFocus: false,
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
    if (app.globalData.hasUserInfo) {
      // 获取用户所有的assignments
      let temp = []
      db.collection('MainUser')
        .where({
          _openid: app.globalData._openid
        })
        .get({
          success: function (res) {
            temp = res.data[0].userAssignments
            // 如果用户有登记过assignment
            if (temp.length > 0) {
              var userAssignments = temp;
              // var diffs = [];
              if (res.data[0].notification.location == "AU") {
                // 转化为澳洲时间计算
                now += 2 * 60 * 60 * 1000;
              }
              for (var i = 0; i < userAssignments.length; i++) {
                // 如果用户作业中存在默认作业
                // 更新其数值为固定数值
                if (userAssignments[i]["default"] == true) {
                  if (userAssignments[i]["name"] == "CSSE1001 A1 (示例)") {
                    userAssignments[i]["date"] = d1;
                  } else {
                    userAssignments[i]["date"] = d2;
                  }
                }
                if (userAssignments[i]["date"] == "TBD") {
                  var date = "999";
                  var diff = 999;
                } else {
                  var date = userAssignments[i]["date"]
                  var time = userAssignments[i]["time"]
                  var string = date + "T" + time + ":00"
                  var d = new Date(string).getTime()
                  now = new Date().getTime();
                  var diff = Math.ceil((d - now) / (1000 * 3600 * 24))
                }
                // 计算style中的进度条百分比
                var percentage = that.calculatePercentage(diff)
                userAssignments[i]["countdown"] = diff
                userAssignments[i]["id"] = i
                userAssignments[i]["percentage"] = percentage
                userAssignments[i]["diff"] = diff
                userAssignments[i]["isTouchMove"] = false
              }
              userAssignments = userAssignments.sort(function (a, b) {
                return a['diff'] - b['diff']
              });
              that.setData({
                userAssignments: userAssignments,
                recentAssignmentName: userAssignments[0]['name'],
                recentAssignmentDate: userAssignments[0]['diff'],
                recentAssignmentColor: userAssignments[0]['color'],
                showAll: true,

              })
            }
            app.globalData.userAssignments = userAssignments;
          }
        })
    } else {
      wx.showModal({
        title: 'UU妹提醒',
        content: '登录才能使用倒计时的完整功能哦！',
        success(res) {}
      })
      this.updateAssignments(this.data.defaultUserAssignments);
    }
    
  },
  onReady: function (options) {

  },
  onShow: function () {

    // if (app.globalData._openid == '') {
    //   wx.cloud.callFunction({
    //     name: 'login',
    //     data: {},
    //     success: res => {
    //       app.globalData._openid = res.result.openid
    //     }
    //   })
    // }
  },
  /**
   * 用户点击单项作业时，可以跳转到showCountDown页面
   * 显示该项作业
   */
  bindTap: function (e) {
    var index = e.currentTarget.dataset.index
    console.log(this.data.userAssignments[index])
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
  },

  _touchStart(e, items) {
    items.forEach(function(v, i) {
      if(v.isTouchMove)
        v.isTouchMove = false;
    })
    this.setData({
      touchStartX: e.changedTouches[0].clientX
    })
    return items
  },

  _touchMove(e, items, id) {
    var index = e.currentTarget.dataset.index
    var touchMoveX = e.changedTouches[0].clientX;
    var x = this.data.touchStartX;

    items.forEach(function(v,i){
      v.isTouchMove = false 
      if (i == id) {
        if (touchMoveX > x) {
          v.isTouchMove = false
        } else {
          v.isTouchMove = true
        }
      }
    })
    return items
  },

  touchStart(e){
    let data = this._touchStart(e, this.data.userAssignments)
    this.setData({
      userAssignments: data
    })
  },
  touchMove(e){
    let data = this._touchMove(e, this.data.userAssignments, e.currentTarget.dataset.index)
    this.setData({
      userAssignments: data
    })
  },
  /**
   * 滑动删除倒计时的回调函数
   * @param {*} e 
   */
  delete: function(e) {
    let temp = this.data.userAssignments;
    var index = e.currentTarget.dataset.index;
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
          temp.splice(index, 1)
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
                wx.showToast({
                  title: '作业条目删除成功',
                  duration: 1000,
                  icon: "success"
                })
                that.onLoad();
              }
            }
          })
         
        }
      }
    })
  }
})