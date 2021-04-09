// miniprogram/pages/timetable/timetable.js

var deatilTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加按钮.png",
    detailShow: false,
    detailAnimation : "bottom: 0;animation: detailDownUp 1s;",

  },



  timeDetail: function(event){
    console.log(event.currentTarget.dataset['course']);
    this.setData({
      detailShow: true,
    });
  },

  timeDetailDown: function(event) {
    this.setData({
      //detailAnimation : "bottom: -545rpx;animation: detailUpDown 1s;",
      detailShow: false,
    });
    // console.log(this.data['detailShow']);
    // deatilTime = setTimeout(function() {
    //   this.data.setData({
    //     detailShow: false,
    //   });
    // } , 1000);
  },

  quitShade: function(event) {

    this.setData({
      // detailAnimation : "bottom: -545rpx;animation: detailUpDown 1s;",
      detailShow: false,

    });
    clearTimeout(deatilTime);
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