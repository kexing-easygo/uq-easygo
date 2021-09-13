// miniprogram/pages/contactUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoimg:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/UQ_EASY GO.png",
    kefuimg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/微信客服号.JPG",
    companyLogo: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/课行.png",
    accountimg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/微信公众号.jpg",
    developer1: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/lewis.JPG",
    developer2: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/arthur.JPG",
    developer3: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/nine1ie.JPG",
    operator1: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/jessica.JPG",
    operator2: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/xiaole.JPG",
    operator3: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/jianguiren.JPG",
    designer1: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/kaylee.jpg"
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

  },
  click: function (e) {
    let that = this;
    // console.log()
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})