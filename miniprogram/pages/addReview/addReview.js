// miniprogram/pages/addReview/addReview.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxlength: 140,
    reviewTxt: '',
    nickName: "",
    semester: "2021 s1",
    course_name: "",
    heading: "",
    isModified: false,
    semesterArray : [
      "2017 s1",
      "2017 s2",
      "2018 s1",
      "2018 s2",
      "2019 s1",
      "2019 s2",
      "2020 s1",
      "2020 s2",
      "2021 s1",
      "2021 s2",
    ],
    semesterIndex: 0,
    index: null
  },
  /**
   * 对reviews进行重排
   * 优秀答案放第一，然后是自己的，最后是别人的
   * 
   * @param {*} reviews 
   */
  sortReviews: function (reviewData) {
    let that = this;
    var reviews = reviewData.reviews;
    var temp = [];
    var tempIndex = [];
    var userOpenid = app.globalData._openid;
    for (var i = 0; i < reviews.length; i++) {
      if (reviews[i].liked_by.indexOf(userOpenid) > -1) {
        reviews[i]["clickable"] = false;
      } else {
        reviews[i]["clickable"] = true;
      }
    }
    // 排优秀答案
    for (var i = 0; i < reviews.length; i++) {
      if (reviews[i].outstanding == true && tempIndex.indexOf(i) < 0) {
        temp.push(reviews[i]);
        tempIndex.push(i);
      }
    }
    // 排自己的
    for (var i = 0; i < reviews.length; i++) {
      if (reviews[i].poster_open_id == userOpenid && tempIndex.indexOf(i) < 0) {
        temp.push(reviews[i]);
        tempIndex.push(i);
      }
    }
    // 排其他的
    for (var i = 0; i < reviews.length; i++) {
      if (tempIndex.indexOf(i) < 0) {
        temp.push(reviews[i]);
        tempIndex.push(i);
      }
    }
    reviewData.reviews = temp;
    console.log(temp);
    return reviewData;
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (e) {
      // 解码json数据
      var raw = JSON.parse(e)
      // raw是所有评论数据
      var index = raw.index;
      var review = raw.reviewData.reviews[index];
      var dataBaseIndex = raw.dataBaseIndex;
      that.setData({
        // 上一级页面发送来的课程数据
        reviewData: raw.reviewData,
        // 课程数据的reviews字段
        nickName: review.poster_name,
        semester: review.semester_enrolled,
        reviewTxt: review.review,
        currentWord: review.review.length,
        // 被修改的评论的索引
        index: dataBaseIndex,
        // 被修改的评论
        modifiedReview: review,
        isModified : true
      })

    })
    that.setData({
      course_name: app.globalData.reviewCourseName
    })
    // db.collection("CourseNew")
    // .where({
    //   course_name: app.globalData.reviewCourseName
    // })
    // .get()
    // .then(res => {
    //   var d = that.sortReviews(res.data[0]);
    //   console.log(d.reviews)
    //   db.collection("CourseNew")
    //   .where({
    //     course_name: app.globalData.reviewCourseName
    //   })
    //   .update({
    //     data: {
    //       reviews: d.reviews
    //     }, success: function(res) {
    //       console.log(res)
    //     }
    //   })     
    // })
    
  },
  onReady: function (e) {
    
  },
  getName: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  getSemester: function (e) {
    this.setData({
      semester: this.data.semesterArray[e.detail.value]
    })
  },
  getReview: function(e) {
    var review = e.detail.value;
    var length = parseInt(review.length);

    if (length > this.data.maxlength) return;
    this.setData({
      currentWord: length,
      reviewTxt: review
    });
  },

  deleteReview: function () {
    let that = this;
    var reviewData = that.data.reviewData;
    var course_name = that.data.course_name;
    var index = that.data.index;
    // 删除这条评论
    reviewData.reviews.splice(index, 1);
    // 重排
    that.sortReviews(reviewData);
    wx.showModal({
      title: 'UU妹提醒',
      content: "你确定要删除你的评论嘛",
      success(res) {
        if (res.confirm) {
          db.collection("CourseNew")
          .where({
            course_name: course_name
          }).update({
            data: {
              reviews: reviewData.reviews
            }
          });
          //跳转界面
          wx.redirectTo({
            url: '/pages/review/review',
            success: function (res) {
              var pages = getCurrentPages();
              var prev = pages[pages.length - 2];
              if (prev == undefined || prev == null) return;
              // 刷新页面
              prev.onLoad();
            }
          })
        }
      }
    })
    
  },
  postReview: function () {
    let that = this
    var semester = that.data.semester;
    var reviewTxt = that.data.reviewTxt;
    var nickName = that.data.nickName;
    if (nickName == '') {
      wx.showToast({
        title: '还请大侠留下姓名～',
        icon: 'none'
      })
      return
    }
    if (reviewTxt.length <= 10) {
      wx.showToast({
        title: '大侠多说点吧（10字以上喔）～',
        icon: 'none'
      })
      return
    }
    
    var d = new Date();
    var year = d.getFullYear();
    var month = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1);
    var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    var temp = {};
    
    // 修改评论
    if (that.data.isModified == true) {
      temp = that.data.reviewData.reviews[that.data.index];
      temp.poster_name = nickName;
      temp.post_date =  year + "-" + month + "-" + date,
      temp.post_time = d.toTimeString().split(" ")[0],
      temp.semester_enrolled = semester,
      temp.review = reviewTxt
      // 更新评论数据
      that.data.reviewData.reviews[that.data.index] = temp;
      db.collection("CourseNew")
      .where({
        course_name: that.data.course_name
      })
      .update({
        data: {
          reviews: that.data.reviewData.reviews
        },
        success: function (res) {
          if (res.stats.updated > 0) {
            var pages = getCurrentPages();
            var prev = pages[pages.length - 2];
            if (prev == undefined || prev == null) return;
            // 刷新页面
            prev.onLoad();
            wx.redirectTo({
              url: '/pages/review/review',
            })
          }
        }
      })
    } else {
      // 推送到现有的review中
      db.collection("CourseNew")
      .where({
        course_name: that.data.course_name
      })
      .get()
      .then(res => {
        var reviewData = res.data[0];
        reviewData.reviews.push(
          {
            poster_name: nickName,
            poster_open_id: app.globalData._openid,
            outstanding: false,
            post_date: year + "-" + month + "-" + date,
            post_time: d.toTimeString().split(" ")[0],
            likes: 0,
            review: reviewTxt, 
            semester_enrolled: semester,
            liked_by: []
          }
        );
        that.sortReviews(reviewData);
        wx.showModal({
          title: 'UU妹提醒',
          content: "你确定要发表评论嘛",
          success(res) {
            if (res.confirm) {
              db.collection("CourseNew")
              .where({
                course_name: that.data.course_name
              })
              .update({
                data: {
                  reviews: reviewData.reviews
                },
                success: function (res) {
                  var pages = getCurrentPages();
                  var prev = pages[pages.length - 2];
                  if (prev == undefined || prev == null) return;
                  // 刷新页面
                  prev.onLoad();
                  wx.redirectTo({
                    url: '/pages/review/review',
                    success: function (res) {}
                  })     
                  
                }
              })
            }
          }
        })
      })
    }
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
    let that = this;
    that.setData({
      heading: that.data.course_name
    })
    wx.setNavigationBarTitle({
      title:that.data.course_name
    })
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