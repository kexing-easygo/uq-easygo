// miniprogram/pages/searchReview/searchReview.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchError: false,
    buttons: [{text: '取消'}, {text: '确认'}],
    searchBarValue: '',
    hotSearch: [
      "CSSE1001", 
      "CSSE2002", 
      "CSSE2310", 
      "COMP3506", 
      "COMP3702", 
      "MATH1050"
    ]
  },
  bindCourseInput: function (e) {
    this.setData({
      searchBarValue: e.detail.value
    })
  },
  bindHotSearch: function (e) {
    var name = e.currentTarget.dataset['name'];
    this.setData({
      searchBarValue: name
    })
    this.fetchCourseInfo();
  },
  /**
   * 返回某门课的全部信息，并跳转至review界面
   */
  fetchCourseInfo: function () {
    var title = this.data.searchBarValue.toUpperCase();
    db.collection("CourseNew")
    .where({
      course_name: title
    })
    .get()
    .then(
      res => {
        if (res.data.length == 0) {
          wx.showModal({
            title: 'UU妹提醒',
            content: '这门课超出了U妹的搜索范围。请确认好课号重新输入或微信联系U妹～',
            success(res) {
              return;
            }
          })
          
        } else {

          app.globalData.reviewCourseName = title;
          wx.navigateTo({
            url: '/pages/review/review',
            success: function (res) {
            }
          })
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const _ = db.command
    // var temp = 
    // {
    //   poster_name: "Null🐷",
    //   poster_open_id: "oe4Eh5Slt8P3MIQIq-UwMuE3pyHg",
    //   mode: "Internal",
    //   outstanding: true,
    //   post_date: "2021-07-02",
    //   post_time: "12:00",
    //   likes: 1,
    //   review: "这课真的巨难", 
    //   semester_enrolled: "2020 s2",
    //   liked_by: ["oe4Eh5Slt8P3MIQIq-UwMuE3pyHg"]
    // }
    // db.collection("CourseReview")
    //   .where({
    //     course_name: "CSSE1001"
    //   })
    //   .update({
    //     data: {
    //       reviews: _.push(temp)
    //     },
    //     success: function (res) {
          
    //     }
    //   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.setData({
    //   searchBarValue: "CSSE1001"
    // })
    // this.fetchCourseInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})