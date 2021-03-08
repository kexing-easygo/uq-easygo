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
    assessments: [],
    course: "",
    // 获得总分
    totalScore: 0,
    // 丢失总分
    totalDropped: 0,
    // 是否为doublePass
    doublePass: false,
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
    var assessments = this.data.assessments
    var scoreType = e.currentTarget.dataset.model
    var item = assessments[key]
    // 根据输入框类型更新数值
    if (scoreType == "score1") {
      item["score1"] = parseFloat(e.detail.value)
    }
    if (scoreType == "score2") {
      item["score2"] = parseFloat(e.detail.value)
    }
    this.setData({
      assessments: assessments
    })
    this.calculateScore(this.data.assessments)
    
  },
  calculateScore: function(assessments) {
    var score = 0
    for (var i = 0; i < assessments.length; i++) {
      var item = assessments[i]
      console.log(item)
      var score1 = item.score1
      var score2 = item.score2
      var weight = item.weight
      
      if (score1 >= 0 && score2 > 0) {
        score += (score1 / score2) * weight
      }
    }
    score = parseFloat(score.toFixed(2))
    var drop = 100 - score
    var gpa = this.calculateGPA(score)
    console.log(score)
    this.setData({
      totalDropped: drop,
      totalScore: score,
      calculatedGPA: gpa
    })

    this.drawCirclebg(); 
    this.drawCirclefront(score);
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
          console.log(res.data.length)
          if (res.data.length > 0) {
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
    let _this = this
    // 数据库搜索
    db.collection("Courses").where({
      name: db.RegExp({
        options: 'i',
        regexp: '^' + value
      })
    }).get({
      success: function(res) {
        var assessments = res.data[0].assessment
        if (assessments[assessments.length - 1].doublepass == true) {
          _this.setData({
            doublePass: true
          })
        }
        if (_this.data.userLoggedIn == true && _this.data.historyData.length > 0) {
          // 只有当用户登录并且有历史记录的时候
          // 才询问是否加载历史记录
          wx.showModal({
            title: '温馨提示',
            content: '检测到您有使用过计算器，是否需要为您加载历史记录呢？',
            success(res) {
              if (res.confirm) {
                var historyData = []
                for (var i = 0; i < _this.data.historyData.length; i++) {
                  var item = _this.data.historyData[i]
                  if (item.name == value) {
                    historyData = item.data
                  }
                }
                for (var j = 0; j < historyData.length; j++) {
                  assessments[j]["score1"] = historyData[j].score1
                  assessments[j]["score2"] = historyData[j].score2
                }
                _this.setData({
                  historyData: historyData,
                  assessments: assessments
                })
                _this.calculateScore(_this.data.assessments)
              }
              _this.setData({
                // assessments: assessments
              })
              // _this.calculateScore(_this.data.assessments)
            }
          })
        }
      }
    })
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
   * 当用户退出该页面的时候，
   */
  onUnload: function () {
    // 用户退出时保存所有历史信息
    let _this = this
    let name = this.data.course
    var assessments = _this.data.assessments
    var d = []
    for (var i = 0; i < assessments.length; i++) {
      var item = assessments[i]
      var temp = {}
      if (item.score1) {
        temp["score1"] = item.score1
      }
      if (item.score2) {
        temp["score2"] = item.score2
      }
      if (Object.keys(temp).length != 0) {
        d.push(temp)
      }
    }
    var updated = [{data: d, name: name}]
    db.collection("MainUser").where({
      _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
    }).update({
      data: {
        "history.calculator": updated
      }, success: function(res) {
        console.log(res)
      }
    })
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