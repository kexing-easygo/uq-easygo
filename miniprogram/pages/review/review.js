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
    likeUrl: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未点赞.png",
    img1: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未好过.png",
    img2: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未好难.png",
    img3: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未好7.png",
    img4: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/未看运气.png",
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
    easy_hd: {},
    easy_pass: {},
    good_luck: {},
    hard_pass: {},
    easy_hd_clickable: true,
    easy_pass_clickable: true,
    good_luck_clickable: true,
    hard_pass_clickable: true,
    text1: "好过",
    text2: "好难",
    text3: "好7",
    text4: "运气",
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
    if (pages.length > 1) {
      let prevPage = pages[pages.length - 2];
      // 如果页面是从搜索过来
      if ("route" in prevPage) {
        if (prevPage.route == "pages/searchReview/searchReview") {
          const eventChannel = that.getOpenerEventChannel()
          eventChannel.on('acceptDataFromOpenerPage', function (e) {
            // app.globalData._openid = "oe4Eh5T-KoCMkEFWFa4X5fthaUG8";
            var raw = JSON.parse(e)
            var data = raw.data;
            // 缓存globalData
            app.globalData.reviewData = data;
            app.globalData.reviewCourseName = data.course_name;
          })
        }
      }
    }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let pages = getCurrentPages();
    if (pages.length > 1) {
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
    // 对reviews进行重排
    // 优秀答案放第一，然后是自己的，最后是别人的
    var temp = [];
    var userOpenid = that.data.userOpenid;
    for (var i = 0; i < data.reviews.length; i++) {
      if (data.reviews[i].liked_by.indexOf(userOpenid) > -1) {
        data.reviews[i]["clickable"] = false;
      } else {
        data.reviews[i]["clickable"] = true;
      }
    }
    for (var i = 0; i < data.reviews.length; i++) {
      if (data.reviews[i].outstanding == true) {
        temp.push(data.reviews[i]);
        data.reviews.splice(i, 1);
        continue
      }
    }
    for (var i = 0; i < data.reviews.length; i++) {
      if (data.reviews[i].poster_open_id == userOpenid) {
        temp.push(data.reviews[i]);
        data.reviews.splice(i, 1);
        continue
      }
    }
    for (var i = 0; i < data.reviews.length; i++) {
      temp.push(data.reviews[i]);
      data.reviews.splice(i, 1);
    }
    app.globalData.reviewData.reviews = temp;
    // 变量
    var easy_hd_clickable = that.data.easy_hd_clickable;
    var easy_pass_clickable = that.data.easy_pass_clickable;
    var good_luck_clickable = that.data.good_luck_clickable;
    var hard_pass_clickable = that.data.hard_pass_clickable;
    var text1 = that.data.text1;
    var text2 = that.data.text2;
    var text3 = that.data.text3;
    var text4 = that.data.text4;
    var img1 = that.data.img1;
    var img2 = that.data.img2;
    var img3 = that.data.img3;
    var img4 = that.data.img4;
    // 检查是否有likeBar
    // 如果有点击过
    if (that.data.easy_pass.users.indexOf(userOpenid) > -1) {
      easy_pass_clickable = false;
      text1 = "好过(" + that.data.easy_pass.num + ")";
      img1 = that.data.afterEasyPassImg;
    }

    if (that.data.hard_pass.users.indexOf(userOpenid) > -1) {
      hard_pass_clickable = false;
      text2 = "好难(" + that.data.hard_pass.num + ")";
      img2 = that.data.afterHardPassImg;
    }

    if (that.data.easy_hd.users.indexOf(userOpenid) > -1) {
      easy_hd_clickable = false;
      text3 = "好7(" + that.data.easy_hd.num + ")";
      img3 = that.data.afterEasyHdImg;
    }

    if (that.data.good_luck.users.indexOf(userOpenid) > -1) {
      good_luck_clickable = false;
      text4 = "运气(" + that.data.good_luck.num + ")";
      img4 = that.data.afterGoodLuckImg;
    }
    that.setData({
      reviews: temp,
      easy_hd_clickable: easy_hd_clickable,
      easy_pass_clickable: easy_pass_clickable,
      good_luck_clickable: good_luck_clickable,
      hard_pass_clickable: hard_pass_clickable,
      text1: text1,
      text2: text2,
      text3: text3,
      text4: text4,
      img1: img1,
      img2: img2,
      img3: img3,
      img4: img4,
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
  easyPass: function () {
    var data = this.data.easy_pass;
    data["num"] += 1;
    data["users"].push(app.globalData._openid);
    this.onReady();
  },
  hardPass: function () {
    var data = this.data.hard_pass;
    data["num"] += 1;
    data["users"].push(app.globalData._openid);
    this.onReady();
  },
  easyHd: function () {
    var data = this.data.easy_hd;
    data["num"] += 1;
    data["users"].push(app.globalData._openid);
    this.onReady();
  },
  goodLuck: function () {
    console.log("?")
    var data = this.data.good_luck;
    data["num"] += 1;
    data["users"].push(app.globalData._openid);
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
    console.log(that.data.reviews);
    db.collection("CourseReview")
    .where({
      course_name: app.globalData.reviewCourseName
    })
    .update({
      data: {
        reviews: that.data.reviews,
        easy_hd: that.data.easy_hd,
        easy_pass: that.data.easy_pass,
        hard_pass: that.data.hard_pass,
        good_luck: that.data.good_luck
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