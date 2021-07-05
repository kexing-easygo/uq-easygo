// miniprogram/pages/addReview/addReview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< HEAD
    maxlength: 140,
    reviewTxt: '',
  },

  input: function(e) {
    var input = e.detail.value;
    var length = parseInt(input.length);

    if (length > this.data.maxlength) return;
    this.setData({
      currentWord: length,
      reviewTxt: input
    });
  },
=======

  },

>>>>>>> 8189247e65116b75ceb1202a2c1d0ed79ee5f257
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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