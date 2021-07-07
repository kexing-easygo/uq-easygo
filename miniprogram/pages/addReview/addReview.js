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
    semester: "",
    course_name: app.globalData.reviewCourseName,
    heading: ""
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
      var data = raw.data
      if (Object.keys(data).length > 0) {
        that.setData({
          nickName: data.poster_name,
          semester: data.semester_enrolled,
          reviewTxt: data.review,
          currentWord: data.review.length
        })
      }
    })
  },
  getName: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  getSemester: function (e) {
    this.setData({
      semester: e.detail.value
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
    if (semester == '') {
      wx.showToast({
        title: '大侠是哪学期学的呀～',
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
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var s2 = d.getHours() + ":" + d.getMinutes();
    if (app.globalData.hasUserInfo) {
      var temp = 
      {
        poster_name: nickName,
        poster_open_id: app.globalData._openid,
        mode: app.globalData.classMode,
        outstanding: false,
        post_date: year + "-" + month + "-" + date,
        post_time: s2,
        likes: 0,
        review: reviewTxt, 
        semester_enrolled: semester
      }
      db.collection("CourseReview")
        .where({
          course_name: that.data.course_name
        })
        .update({
          data: {
            reviews: _.push(temp)
          },
          success: function (res) {
            if (res.stats.updated > 0) {
              wx.showToast({
                title: '发表成功',
                icon: 'success',
                duration: 1000
              })         
              wx.redirectTo({
                url: '/pages/review/review',
                success: function (res) {
                  var page = getCurrentPages().pop()
                  if (page == undefined || page == null) return;
                  // 刷新页面
                  page.onLoad()
                }
              })     
            } else {
              wx.showToast({
                title: '发表失败',
                icon: 'error',
                duration: 1000
              })  
              return
            }
          }
        })
    } else {
      wx.showToast({
        title: '你需要登陆才能发布评论哦！',
        icon: "none"
      })
      return
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
    this.setData({
      heading: app.globalData.reviewCourseName
    })
    wx.setNavigationBarTitle({
      title: app.globalData.reviewCourseName,
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