// miniprogram/pages/review/review.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseName: "DECO1100",
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
    // likeBar的四种文本
    text1: "好过",
    text2: "好难",
    text3: "好7",
    text4: "运气",
    reviewerInfo: "Sprite-2021 s1",
    ownReview: true,
    reviewData: {},
    // reviewData内的reviews数据
    reviews: [],
    showInfo: false,
    userOpenid: app.globalData._openid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    db.collection("CourseReview")
    .where({
      course_name: app.globalData.reviewCourseName
    })
    .get()
    .then(
      res => {
        var data = res.data[0];
        wx.setNavigationBarTitle({
          title: data.course_name,
        })
        var prerequisite = "None"
        if ("prerequisite" in data.external) {
          prerequisite = data.external.prerequisite.replace("<p>", "").replace("</p>", "");
        }
        var incompatible = "None"
        if ("incompatible" in data.external) {
          incompatible = data.external.incompatible.replace("<p>", "").replace("</p>", "");
        }
        that.setData({
          reviewData: data,
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
        // 先根据liked_by字段判断是否可以被点赞
        for (var i = 0; i < data.reviews.length; i++) {
          if (data.reviews[i].liked_by.indexOf(userOpenid) > -1) {
            data.reviews[i]["clickable"] = false;
          } else {
            data.reviews[i]["clickable"] = true;
          }
        }
        // 排优秀答案
        for (var i = 0; i < data.reviews.length; i++) {
          if (data.reviews[i].outstanding == true) {
            temp.push(data.reviews[i]);
            data.reviews.splice(i, 1);
            continue
          }
        }
        // 排自己的
        for (var i = 0; i < data.reviews.length; i++) {
          if (data.reviews[i].poster_open_id == userOpenid) {
            temp.push(data.reviews[i]);
            data.reviews.splice(i, 1);
            continue
          }
        }
        // 排其他的
        for (var i = 0; i < data.reviews.length; i++) {
          temp.push(data.reviews[i]);
          data.reviews.splice(i, 1);
        }
        that.data.reviews = temp;
        that.data.reviewData.reviews = temp;
    
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
      }
    )
    // let pages = getCurrentPages();
    // let that = this
    // if (pages.length > 1) {
    //   let prevPage = pages[pages.length - 2];
    //   if ("route" in prevPage) {
    //     if (prevPage.route == "pages/searchReview/searchReview") {
    //       if (!app.globalData.hasUserInfo) {
    //         wx.showToast({
    //           title: '登录才能使用课评的完整功能哦',
    //           icon: 'none'
    //         })
    //       }
    //     }
    //   }
    // }
    
  },
  /**
   * 回调函数，用户可以修改自己发表的评论
   * 点击后跳转至addReview页面
   */
  modifyReview: function (e) {
    var index = e.currentTarget.dataset['reviewindex'];
    var query = JSON.stringify(
      {
        reviewData: this.data.reviewData,
        index: index,
        course_name: this.data.courseName
      }
    )
    
    wx.navigateTo({
      url: '/pages/addReview/addReview',
      success: function (res) {
        // 通过eventChannel向被打开页面传送正在被点击的assignment信息
        res.eventChannel.emit('acceptDataFromOpenerPage', query)
      }
    })
  },
  /**
   * 登录用户可以给他人或自己的评论点赞。
   * 点赞后，用户的openid会存储在该条评论中
   */
  likes: function (e) {
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: 'UU妹提醒',
        content: '你需要登录才可以给他人的评论点赞哦～',
        success(res) {
          return;
        }
      })
    }
    var reviews = this.data.reviews
    var index = e.currentTarget.dataset['reviewindex'];
    var review = reviews[index];
    if (review["liked_by"].indexOf(app.globalData._openid) == -1) {
      review["likes"] += 1;
      review["liked_by"].push(app.globalData._openid);
      review["clickable"] = false;
    }
    this.setData({
      reviews: reviews
    })

  },
  /**
   * 登录用户可以评价该门课是否好过。
   * 点赞后，用户的openid会存储在该条评论中
   */
  easyPass: function () {
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: 'UU妹提醒',
        content: '你需要登录才可以给他人的评论点赞哦～',
        success(res) {
          return;
        }
      })
    }
    var data = this.data.easy_pass;
    if (data["users"].indexOf(app.globalData._openid) == -1) {
      data["num"] += 1;
      data["users"].push(app.globalData._openid);
      this.setData({
        easy_pass: data,
        easy_pass_clickable: false,
        img1: this.data.afterEasyPassImg,
        text1: "好过(" + data.num + ")"
      })
    }
    
  },
  /**
   * 登录用户可以评价该门课是否不好过。
   * 点赞后，用户的openid会存储在该条评论中
   */
  hardPass: function () {
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: 'UU妹提醒',
        content: '你需要登录才可以给他人的评论点赞哦～',
        success(res) {
          return;
        }
      })
    }
    var data = this.data.hard_pass;
    if (data["users"].indexOf(app.globalData._openid) == -1) {
      data["num"] += 1;
      data["users"].push(app.globalData._openid);
      this.setData({
        hard_pass: data,
        hard_pass_clickable: false,
        img2: this.data.afterHardPassImg,
        text2: "好难(" + data.num + ")"
      })
    }
  },
  /**
   * 登录用户可以评价该门课是否好拿7。
   * 点赞后，用户的openid会存储在该条评论中
   */
  easyHd: function () {
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: 'UU妹提醒',
        content: '你需要登录才可以给他人的评论点赞哦～',
        success(res) {
          return;
        }
      })
    }
    var data = this.data.easy_hd;
    if (data["users"].indexOf(app.globalData._openid) == -1) {
      data["num"] += 1;
      data["users"].push(app.globalData._openid);
      this.setData({
        easy_hd: data,
        easy_hd_clickable: false,
        img3: this.data.afterEasyHdImg,
        text3: "好7(" + data.num + ")"
      })
    }
    
  },
  /**
   * 登录用户可以评价该门课是不是看运气。
   * 点赞后，用户的openid会存储在该条评论中
   */
  goodLuck: function () {
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: 'UU妹提醒',
        content: '你需要登录才可以给他人的评论点赞哦～',
        success(res) {
          return;
        }
      })
    }
    var data = this.data.good_luck;
    if (data["users"].indexOf(app.globalData._openid) == -1) {
      data["num"] += 1;
      data["users"].push(app.globalData._openid);
      this.setData({
        good_luck: data,
        good_luck_clickable: false,
        img4: this.data.afterGoodLuckImg,
        text4: "运气(" + data.num + ")"
      })
    }
    
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
      course_name: that.courseName
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
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 发布评论；未登录用户无法发布。
   */
  addSingleReview: function () {
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: 'UU妹提醒',
        content: '你需要登录才可以发表评论哦～',
        success(res) {
          return;
        }
      })
    }
  }
})