// pages/countdown/countdown.js
const db = wx.cloud.database()
const app = getApp()

Page({

	/**
	 * Page initial data
	 */
  data: {
    // 用户所有的作业
    userAssignments: app.globalData.userAssignments,
    addCountDown: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加倒计时.png",
    notificationSetting: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/提醒设置.png",
    add: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加按钮.png",
    showTrue: false
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
    // 但是弹窗跳转不到profile和home
    // 我很迷惑
    if (app.globalData.openid == null) {
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
    } else {
      // 获取用户所有的assignments
      var temp = []
      db.collection('MainUser')
        .where(
          {
            _openid: app.globalData.openid
          }
        )
        .get()
        .then(
          res => {
            console.log(res.data)
            temp = res.data[0].userAssignments
            // 如果用户有登记过assignment
            if (res.data.length > 0) {
              var userAssignments = res.data[0].userAssignments
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
    }

  },

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
  onReady: function () {

  },

	/**
	 * Lifecycle function--Called when page show
	 */
  onShow: function () {

  },

	/**
	 * Lifecycle function--Called when page hide
	 */
  onHide: function () {

  },

	/**
	 * Lifecycle function--Called when page unload
	 */
  onUnload: function () {

  },

	/**
	 * Page event handler function--Called when user drop down
	 */
  onPullDownRefresh: function () {

  },

	/**
	 * Called when page reach bottom
	 */
  onReachBottom: function () {

  },

	/**
	 * Called when user click on the top right corner to share
	 */
  onShareAppMessage: function () {

  }
})