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
      var reviews = raw.reviewData.reviews;
      var review = reviews[index];
      that.setData({
        // 上一级页面发送来的课程数据
        reviewData: raw.reviewData,
        // 课程数据的reviews字段
        reviews: reviews,
        nickName: review.poster_name,
        semester: review.semester_enrolled,
        reviewTxt: review.review,
        currentWord: review.review.length,
        // 被修改的评论的索引
        index: index,
        // 被修改的评论
        modifiedReview: review,
        isModified : true
      })
      console.log(index);
    })
    that.setData({
      course_name: app.globalData.reviewCourseName
    })
    
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
  formatDate: function () {
  },
  deleteReview: function () {
   
    var course = this.data.course_name;
    var index = this.data.index;
    var temp = [];
    db.collection("CourseReview")
    .where({
      course_name: course
    })
    .get().then(
      res => {
        //更新数据
        for (var i = 0; i < res.data[0].reviews.length; i++) {
          if (i != index) {
            temp.push(res.data[0].reviews[i]);
            console.log(temp);
          }
        }
        db.collection("CourseReview")
        .where({
          course_name: course
        }).update({
          data: {
            reviews: temp
          }
        });
        //跳转界面
        wx.redirectTo({
          url: '/pages/review/review',
          success: function (res) {}
        })
        
      }
    );
    
    


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
    var temp = {}
    // 修改评论
    if (that.data.isModified == true) {
      temp = that.data.reviews[that.data.index];
      temp.poster_name = nickName;
      temp.post_date =  year + "-" + month + "-" + date,
      temp.post_time = d.toTimeString().split(" ")[0],
      temp.semester_enrolled = semester,
      temp.review = reviewTxt
      // 更新评论数据
      that.data.reviews[that.data.index] = temp;
      // 更新课程数据
      that.data.reviewData.reviews = that.data.reviews;
      db.collection("CourseReview")
      .where({
        course_name: that.data.course_name
      })
      .update({
        data: {
          reviews: that.data.reviewData.reviews
        },
        success: function (res) {
          console.log(res)
          if (res.stats.updated > 0) {
            // app.globalData.reviewsData = that.data.reviewData
            // app.globalData.reviewsData.reviews = that.data.reviewData.reviews
            var pages = getCurrentPages();
            var prev = pages[pages.length - 2];
            if (prev == undefined || prev == null) return;
            // 刷新页面
            prev.onLoad();
            wx.redirectTo({
              url: '/pages/review/review',
            })
          } else {
            // wx.showToast({
            //   title: '修改失败',
            //   icon: 'error',
            //   duration: 1000
            // })  
            // return
          }
        }
      })
    } else {
      temp = {
        poster_name: nickName,
        poster_open_id: app.globalData._openid,
        // mode: app.globalData.classMode,
        outstanding: false,
        post_date: year + "-" + month + "-" + date,
        post_time: d.toTimeString().split(" ")[0],
        likes: 0,
        review: reviewTxt, 
        semester_enrolled: semester,
        liked_by: []
      }
      wx.showModal({
        title: 'UU妹提醒',
        content: '发布的评论是无法删除的哦，你确定要发布嘛？',
        success(res) {
          db.collection("CourseReview")
          .where({
            course_name: that.data.course_name
          })
          .update({
            data: {
              reviews: _.push(temp)
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
              
                // wx.showToast({
                //   title: '发表失败',
                //   icon: 'error',
                //   duration: 1000
                // })  
                // return
              
            }
          })
        }
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