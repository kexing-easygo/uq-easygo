// miniprogram/pages/review/review.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseName: "DECO1100 - Design Thinking",
    courseLecturer: "Lecturer",
    courseFaculty: "Faculty",
    coursePre: ['DECO1100', 'DECO1100'],
    courseSemester: ['Semester1', 'Semester2'],
    courseIncompatible: "DECO1100",
    like:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/课程表敬请期待.png",
    easy_hd: 0,
    easy_pass: 0,
    good_luck: 0,
    hard_pass: 0,
    reviewerInfo: "Sprite-2021 s1",
    ownReview: true,
    reviews: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const eventChannel = that.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (e) {
      var raw = JSON.parse(e)
      var data = raw.data;
      console.log(data);
      // 赋值
      var prerequisite = "None"
      if ("prerequisite" in data.external) {
        prerequisite = data.external.prerequisite;
      }
      var incompatible = "None"
      if ("incompatible" in data.external) {
        incompatible = data.external.incompatible;
      }
      that.setData({
        courseName: data.course_name,
        courseLecturer: data.external.lecturer,
        courseFaculty: data.external.faculty,
        coursePre: prerequisite,
        courseIncompatible: incompatible,
        courseSemester: data.external.taught,
        easy_hd: data.easy_hd,
        easy_pass: data.easy_pass,
        good_luck: data.good_luck,
        hard_pass: data.hard_pass,
        reviews: data.reviews
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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