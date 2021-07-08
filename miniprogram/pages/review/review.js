// miniprogram/pages/review/review.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
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
    // 未点赞图标
    beforeLikeImg:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未点赞.png",
    // 点赞图标
    afterLikeImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/点赞.png",
    // 未好过
    beforeEasyPassImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未好过.png",
    // 未好难
    beforeHardPassImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未好难.png",
    // 未好7
    beforeEasyHdImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未好7.png",
    // 未看运气
    beforeGoodLuckImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未看运气.png",
    // 好过
    afterEasyPassImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/好过.png",
    // 好难
    afterHardPassImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/好难.png",
    // 好7
    afterEasyHdImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/好7.png",
    // 运气
    afterGoodLuckImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/看运气.png",
    easy_hd: 0,
    easy_pass: 0,
    good_luck: 0,
    hard_pass: 0,
    reviewerInfo: "Sprite-2021 s1",
    ownReview: true,
    reviews: [],
    showInfo: false,
    userOpenid: app.globalData._openid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // 如果页面是从搜索过来
    if ("route" in prevPage) {
      if (prevPage.route == "pages/searchReview/searchReview") {
        const eventChannel = that.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (e) {
          app.globalData._openid = "oe4Eh5T-KoCMkEFWFa4X5fthaUG8";
          var raw = JSON.parse(e)
          var data = raw.data;
          // 缓存globalData
          app.globalData.reviewData = data;
          app.globalData.reviewCourseName = data.course_name;
        })
      }
    }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if ("route" in prevPage) {
      if (prevPage == "pages/searchReview/searchReview") {
        db.collection("MainUser")
        .where({
          _openid: app.globalData._openid
        })
        .get()
        .then(
          res => {
            if (res.data.length == 0) {
  
            } else {
              if ("classMode" in res.data) {
                app.globalData.classMode = res.data.classMode;
              } else {
  
              }
            }
          }
        )
      }
    }
    
    // 赋值
    let that = this
    var data = app.globalData.reviewData;
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
      reviews: data.reviews,
      userOpenid: app.globalData._openid
    })
  },
  modifyReview: function (e) {
    var index = e.currentTarget.dataset['reviewindex'];
    var review = this.data.reviews[index];
    var query = JSON.stringify({
      data: review
    })
    wx.navigateTo({
      url: '/pages/addReview/addReview',
      success: function (res) {
        // 通过eventChannel向被打开页面传送正在被点击的assignment信息
        res.eventChannel.emit('acceptDataFromOpenerPage', query)
      }
    })
  },
  likes: function (e) {
    var index = e.currentTarget.dataset['reviewindex'];
    var review = this.data.reviews[index];
    review["likes"] += 1;
    review["liked_by"].push(app.globalData._openid);
    app.globalData.reviewData.reviews = this.data.reviews;
    this.onReady();
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
    let that = this;
    db.collection("CourseReview")
    .where({
      course_name: app.globalData.reviewCourseName
    })
    .update({
      data: {
        reviews: that.data.reviews
      }, 
      success: function (res)  {
        if (res.stats.updated > 0) {
          wx.showToast({
            title: '点赞成功',
            icon: 'none'
          })
        }
      }
    })
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