// pages/calc/calc.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({

  /**
   * Page initial data
   */
  data: {
    InComingImage:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/计算器敬请期待页面.png",
    inputVal: "",
    isDoublePass: false,
    matchedItems: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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
    // 获取本门课的信息
    // 数据库用正则表达式进行模糊搜索    
    db.collection("Courses").where({
      name: db.RegExp({
        regexp: '.*' + value,
        options: "i"
      })
    }).get({
      success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          // console.log("搜索到结果为")
          // console.log(res.data)
          for (var i = 0; i < data.length; i++) {
            matchedItems.push(data[i].assessment)
          }
        }
      })
    // console.log(matchedItems)
  },
  extractCourseInfo: function(course) {
    var courseName = course.name
    var assessments = course.assessments
    for (var i = 0; i < assessments.length; i++) {
      var assessment = assessments[i]
      var name = assessment.name
      var weight = assessment.weight
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