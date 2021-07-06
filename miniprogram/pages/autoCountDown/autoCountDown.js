// miniprogram/pages/autoCountDown.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 0,
    clicked_1: false,
    clicked_2: false,
    clicked_3: false,
    clicked_4: false,
    clicked_5: false,

    setClassMode: true,
    buttons: [{text: '好的'}, {text: '这就去设置'}],
    showResult: false,
    assessments: [],
    warning: true,
    searchBarValue: "",
    selectedAssessments: []
    
  },
  bindCourseInput: function (e) {
    this.setData({
      searchBarValue: e.detail.value
    })
  },

  bindRed: function() {
    this.setData({
      color: "#FA5151",
      clicked_1: true,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindPink: function() {
    this.setData({
      color: "#FFC300",
      clicked_1: false,
      clicked_2: true,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindLightBlue: function() {
    this.setData({
      color: "#07C160",
      clicked_1: false,
      clicked_2: false,
      clicked_3: true,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindPurple: function() {
    this.setData({
      color: "#1485EE",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: true,
      clicked_5: false,
    });
  },
  bindYellow: function() {
    this.setData({
      color: "#576B95",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: true,
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchCourseInfo();
  },
  /**
   * 绑定checkbox-group的回调函数
   * 
   * @param {e} 事件；
   * e.detail.value 代表被选中的checkbox的index数组
   * 也代表某个作业在assessments列表中的index
   */
  selectAssessments: function (e) {
    var selectedValues = e.detail.value;
    // 被选中的作业
    var temp = [];
    for (var i = 0; i < selectedValues.length; i++) {
      // index对应选中的作业在assessments里面的的index
      var index = parseInt(selectedValues[i]);
      temp.push(this.data.assessments[index]);
    }
    // console.log(temp);
    this.setData({
      selectedAssessments: temp
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 返回数据库中该门课的信息
   * course: 用户输入的course name
   * return: 该门课external的作业信息(array)
   * date字段被分成date和time以便于接下来添加
   * 
   */
  fetchCourseInfo: function() {
    var course = this.data.searchBarValue;
    let that = this;
    if (course.length == 8) {
      db.collection('CourseReview')
      .where({
        course_name: course
      })
      .get()
      .then(
        res =>{
          if (res.data.length == 0) {
            wx.showModal({
              title: '温馨提示',
              content: "这门课太难了，超出了U妹目前的搜索范围。请确定课号重新输入或者微信联系U妹～",
              success(res) {
                return
              }
            })
          } else {
            // TODO: 根据用户上课模式返回结果
            // 默认返回external
            var assessments = res.data[0]["external"]["assessments"];
            // 解析date字段，分成date和time
            for (var i = 0; i < assessments.length; i++) {
              var ass = assessments[i];
              var date_string = ass["date"];
              var date = date_string.split(" ")[0];
              var time = date_string.split(" ")[1];
              assessments[i]["date"] = date;
              assessments[i]["time"] = time;
            }
            // showResult要设置为true才可以显示搜索结果
            that.setData({
              showResult: true,
              assessments: assessments
            })
          }
        },
      )
    }
  },
  /**
   * 下一步按钮的回调函数，将选中的作业列表
   * 传递到下一个页面
   */
  confirm: function () {
    var course = this.data.searchBarValue;
    var color = this.data.color;
    var ass = this.data.selectedAssessments;
    // 用户选了作业但是没选择颜色
    if (color == 0) {
      wx.showModal({
        title: "提示",
        content: "你好像忘记设置颜色了哦！"
      })
      return
    }
    
    for (var i = 0; i < ass.length; i++) {
      // 更新color字段
      ass[i].color = color;
      ass[i].name = course + "-" + ass[i].name;
      // TODO: 解析到TBD，自动变为30天后
      if (ass[i].date == "TBD") {
        ass[i].date = GetDateStr(30);
        ass[i].time = "00:00"
      }
      db.collection("MainUser")
      .where({
        _openid: app.globalData._openid
      })
      .update({
        data: {
          userAssignments: _.push(ass[i])
        },
        success: function (res) {
          if (res.stats.updated > 0) {
            console.log("作业条目添加成功")
            // reLaunch方法一定要在异步方法内部调用，保证先后顺序
            // 不然会出现更新延迟的问题
            wx.redirectTo({
              url: '../countdown/countdown',
              success: function (res) {
                var page = getCurrentPages().pop()
                if (page == undefined || page == null) return;
                // 刷新页面
                page.onLoad()
              }
            })
          }
        }
      })
    }
    
  }

})