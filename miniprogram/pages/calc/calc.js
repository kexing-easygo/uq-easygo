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
    selectSemester: true,
    semester: "select semester",
    // 测试数据
    assessments: [
      {name: "Online Problems", weight: 10},
      {name: "Assignment 1", weight: 10},
      {name: "Assignment 2", weight: 15},
      {name: "Assignment 3", weight: 20},
      {name: "Final exam", weight: 45},
      // doublepass: true, 
      // hurdle: 45, 
    ],
    result: "",
    // 获得总分
    totalScore: 0,
    // 丢失总分
    totalDropped: 0,
    // 是否为doublePass
    doublePass: true,
    calculatedGPA: 0

  },
  
  /** 
   * 获取键盘输入的作业实际得分
   * 和总分数。批量化管理所有输入框
   */
  bindKeyInput: function (e) {
    var key = e.currentTarget.id
    var scoreType = e.currentTarget.dataset.model
    var item = this.data.assessments[key]
    // 根据输入框类型更新数值
    if (scoreType == "score1") {
      item["score1"] = e.detail.value
    }
    if (scoreType == "score2") {
      item["score2"] = e.detail.value
    }
    // 如果两个输入框都有分数
    // 且满足条件，开始计算分数
    var percentage = item["score1"] / item["score2"]
    if (percentage <= 1 && percentage >= 0) {
      var mark = item["score1"] / item["score2"] * item.weight
      // 更新已获得百分比和丢失百分比
      item["score"] = mark
      item["dropped"] = item.weight - mark
    }
    var totalScore = 0
    var totalDropped = 0
    for (var i = 0; i < this.data.assessments.length; i++) {
      if (this.data.assessments[i]["score"] >= 0) {
        totalScore += this.data.assessments[i]["score"]
      }
      totalDropped = 100 - totalScore
    }
    this.setData({
      totalScore: totalScore,
      totalDropped: totalDropped,
      calculatedGPA: this.calculateGPA(totalScore)
    })
  },
  calculateGPA: function(score) {
    if (score >= 50 && score < 64) {
      return 4
    } else if (score >= 64 && score < 75) {
      return 5
    } else if (score >= 75 && score < 84) {
      return 6
    } else if (score >= 85) {
      return 7
    } else {
      return 3
    }
  },
  /** 
   * 选择器功能
  */

  mySelect: function(e) {
    this.setData({
      selectSemester: false
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
  },

  searchCourse: function() {
    let value = this.data.result
    let _this = this
    // if (value.length == 8) {
    //   // 数据库搜索
    //   db.collection("Courses").where({
    //     name: db.RegExp({
    //       regexp: '^' + value
    //     })
    //   }).get({
    //     success: function(res) {
    //       console.log(res.data[0].assessment)
    //       _this.setData({
    //         assessments: res.data[0].assessment
    //       })
    //     }
    //   })
    // }
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