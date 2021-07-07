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
    searchBarValue: ''
  },
  bindCourseInput: function (e) {
    this.setData({
      searchBarValue: e.detail.value
    })
  },
  fetchCourseInfo: function () {
    var title = this.data.searchBarValue;
    db.collection("CourseReview")
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
            success(res) {}
          })
          return;
        } else {
          var temp = res.data[0];
          var query = JSON.stringify({
            data: temp
          })
          wx.navigateTo({
            url: '/pages/review/review',
            success: function (res) {
              // 通过eventChannel向被打开页面传送正在被点击的assignment信息
              res.eventChannel.emit('acceptDataFromOpenerPage', query)
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      searchBarValue: "CSSE1001"
    })
    this.fetchCourseInfo();
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