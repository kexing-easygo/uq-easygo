// miniprogram/pages/autoCountDown.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setClassMode: true,
    buttons: [{text: '好的'}, {text: '这就去设置'}],
    showResult: false,
    assessments: [],
    warning: true,
    searchBarValue: ""
    // search: ""
  },
  bindCourseInput: function (e) {
    this.setData({
      searchBarValue: e.detail.value
    })
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
    // this.fetchCourseInfo();
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
   * 这他妈异步请求我丢
   * 
   */
  fetchCourseInfo: function() {
    var course = this.data.searchBarValue;
    // var course = "CSSE1001"
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
            // showResult要设置为true才可以显示搜索结果
            that.setData({
              showResult: true,
              assessments: assessments
            })
            console.log(this.data.assessments);
          }
        },
      )
    }
    
  }

})