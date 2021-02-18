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
    // assessments: [
    //   {name: "Online Problems", weight: 10},
    //   {name: "Assignment 1", weight: 10},
    //   {name: "Assignment 2", weight: 15},
    //   {name: "Assignment 3", weight: 20},
    //   {name: "Final exam", weight: 45},
    //   // doublepass: true, 
    //   // hurdle: 45, 
    // ],
    assessments: [],
    course: "",
    // 获得总分
    totalScore: 0,
    // 丢失总分
    totalDropped: 0,
    // 是否为doublePass
    doublePass: true,
    calculatedGPA: 0,
    // 历史数据
    historyData: {},
    userLoggedIn: false

  },
  bindCourseInput: function(e) {
    this.setData({course: e.detail.value})
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
    this.drawCirclebg(); 
    this.drawCirclefront(totalScore);
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
   * 圆形动态进度条：绘制底层白色圆环
   */
  drawCirclebg: function() {
    var circle = wx.createCanvasContext('canvasProgressbg')
    circle.setLineWidth(5);
    circle.setStrokeStyle("#000000");
    circle.setLineCap("butt");
    circle.beginPath();
    circle.arc(50, 50, 45, 0, 2 * Math.PI, false);
    circle.stroke();
    circle.draw();
  },

  /**
   * 圆形动态进度条：绘制上层蓝色圆环
   */
  drawCirclefront: function(score) {
    var circle = wx.createCanvasContext('canvasProgress');
    circle.setLineWidth(8);
    circle.setStrokeStyle("#ffffff");
    circle.setLineCap("round");
    circle.beginPath();
    circle.arc(50, 50, 45, 0 * Math.PI, ((score / 100)*2) * Math.PI, false);
    circle.stroke();
    circle.draw();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // var score = this.data.totalScore/100;
    this.drawCirclebg(); 
    this.drawCirclefront(0);
    let that = this
    // let openid = app.globalData.openid
    let openid = "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
    // 检查用户登录
    if (openid != null && openid != undefined) {
      // 如果用户登录过
      // 数据库搜索
      that.setData({
        userLoggedIn: true
      })
      db.collection("MainUser")
      .where({
        _openid: openid,
        "history.calculator": _.neq([]) 
      }).get({
        success: function(res) {
          // 如果拿到了，去拿history
          if (res.data != null) {
            var historyData = res.data[0].history.calculator
            that.setData({historyData: historyData})
          }
        }
      })
    }
  },
  /**
   * 点击搜索按钮，搜索课程信息。
   * 如果数据库内没有该课程，弹窗提示查无此课。
   * 如果有，进一步检查是否登录
   */
  searchCourse: function() {
    let value = this.data.course
    // let value = "CSSE1001"
    let _this = this
    // 数据库搜索
    db.collection("Courses").where({
      name: db.RegExp({
        regexp: '^' + value
      })
    }).get({
      success: function(res) {
        var assessments = res.data[0].assessment
        if (_this.data.userLoggedIn && _this.data.historyData) {
          var historyData = []
          for (var i = 0; i < _this.data.historyData.length; i++) {
            var item = _this.data.historyData[i]
            if (item.name == value) {
              historyData = item.data
            }
          }
          console.log(historyData)
          for (var j = 0; j < historyData.length; j++) {
            assessments[j]["score1"] = historyData[j].score1
            assessments[j]["score2"] = historyData[j].score2
          }
          _this.setData({
            historyData: historyData,
            assessments: assessments
          })
        }
      }
    })
    // 只有当用户登录并且有历史记录的时候
    // 才询问是否加载历史记录
    
      // this.setData({assessments: assessments})
      // wx.showModal({
      //   title: '温馨提示',
      //   content: '检测到您有使用过计算器，是否需要为您加载历史记录呢？',
      //   success(res) {
      //     if (res.confirm) {
      //       
      //       }
      //     } else if (res.cancel) {
            
      //     }
      //   }
      // })
    
    
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