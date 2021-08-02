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
    semester_array: ['Semester 2, 2021','Summer Semester, 2021'],
    objectArray: [
      {id: 0, name: 'Semester 2, 2021'},
      {id: 1, name: 'Summer Semester, 2021'},
    ],
    index: 0,
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
  //semester picker function
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
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

  resetScore: function(assessments) {
    for (var i = 0; i < assessments.length; i++) {
      var item = assessments[i]
      // console.log(item)
      if (item.hasOwnProperty("score1") == true) {
        console.log("?")
        item.score1 = undefined
      }
      if (item.hasOwnProperty("score2") == true) {
        console.log("??")
        item.score2 = undefined
      }
      // assessments[i] = item
    }
    // console.log(assessments)
  },

  calculateScore: function(assessments) {
    var score = 0
    for (var i = 0; i < assessments.length; i++) {
      var item = assessments[i]
      var score1 = item.score1
      var score2 = item.score2
      var weight = item.weight
      // 只对数字进行计算
      weight = parseFloat(weight)
      if (score1 >= 0 && score2 > 0 
        && weight >= 0 && score2 >= score1) {
        score += (score1 / score2) * weight
      } else {
        score += 0
      }
    }
    // 分数均保留两位有效数字
    score = parseFloat(score.toFixed(2))
    var drop = 100 - score
    drop = parseFloat(drop.toFixed(2))
    var gpa = this.calculateGPA(score)
    this.setData({
      totalDropped: drop,
      totalScore: score,
      calculatedGPA: gpa
    })
    var startAngle = 1.5 * Math.PI;
    var endAngle = 1.5 * Math.PI + ((score / 100)*2) * Math.PI;
    this.drawCirclebg(); 
    this.drawCirclefront(startAngle, endAngle);
  },
  calculateGPA: function(score) {
    if (score >= 0 && score < 19) {
      return 1
    } else if (score >= 20 && score < 44) {
      return 2
    } else if (score >= 45 && score < 49) {
      return 3
    } else if (score >= 50 && score < 64) {
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
    circle.setLineWidth(10);
    circle.setStrokeStyle("#ffffff");
    circle.setLineCap("butt");
    circle.beginPath();
    circle.arc(50, 50, 45, 0, 2 * Math.PI, false);
    circle.stroke();
    circle.draw();
  },

  /**
   * 圆形动态进度条：绘制上层蓝色圆环
   */
  drawCirclefront: function(start, end) {
    var circle = wx.createCanvasContext('canvasProgress');
    circle.setLineWidth(10);
    circle.setStrokeStyle("#587FFC");
    circle.setLineCap("butt");
    circle.beginPath();
    if (end == 0) {
      circle.arc(50, 50, 45, start, 1.5 * Math.PI, false);
    } else {
      circle.arc(50, 50, 45, start, end, false);
    }
    circle.stroke();
    circle.draw();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.drawCirclebg(); 
    this.drawCirclefront(0);
    
  },
  /**
   * 点击搜索按钮，搜索课程信息。
   * 如果数据库内没有该课程，弹窗提示查无此课。
   * 如果有，进一步检查是否登录
   */
  searchCourse: function() {
    let value = this.data.course.toUpperCase()
    let _this = this
    // 数据库搜索
    db.collection("CourseNew")
    .where({
      course_name: value
    })
    .get({
      success: function(res) {
        console.log(res)
        if (res.data.length == 0) {
          wx.showModal({
            title: '温馨提示',
            content: "这门课太难了，超出了U妹目前的搜索范围。请确定课号重新输入或者微信联系U妹～",
            success(res) {
              return
            }
          })
        }
        
        var assessments = res.data[0].external.assessments
        if (assessments[assessments.length - 1].doublepass == true) {
          _this.setData({
            doublePass: true
          })
        } else {
          _this.setData({
            doublePass: false
          })
        }
        // 虽然不能清空
        _this.resetScore(assessments)
        _this.calculateScore(assessments)
        _this.setData({
          assessments: assessments
        })
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