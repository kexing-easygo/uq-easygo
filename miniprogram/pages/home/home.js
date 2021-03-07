// pages/home/home.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    swiperPlaceholderOne:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图上线了.png",
    swiperPlaceholderTwo:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图倒计时功能.png",
    swiperPlaceholderThree:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/Bug征集.png",
    calcIcon:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/计算器.png",
    countdownIcon:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/倒计时.png",
    PostHolderOne:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/Bug征集.png",
    inComingHolder:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/敬请期待海报.png",
    inComingIcon:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/敬请期待.png"
  },

  /**
   * Lifecycle function--Called when page load
   * 在进入主页时，缓存用户的openid
   */
  onLoad: function (options) {
    wx.getSetting({
      withSubscriptions: true,
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 证明用户授权了
          app.globalData.hasUserInfo = true,
          app.globalData.userInfo = res.authSetting['scope.userInfo']
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              app.globalData._openid = res.result.openid
            }
          })
        }
      }
    })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    // wx.showModal({
    //   title: "体验须知",
    //   content: "小程序目前在体验测试阶段，后续发布的正式版才会储存数据哦～"
    // })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {
    return {
      title: 'UQ校园通',
      path: '/pages/home/home',
      // imageUrl: 'cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/三月精简校历.png'
    }
  },
  navigateToWaiting: function() {
    wx.navigateTo({
      url: '/pages/waiting/waiting',
    })
  },
  // /**
  //  * 分享朋友圈。灰度测试
  //  */
  // onShareTimeline: function() {
    
  // },
  clickImage: function(e) {
    wx.previewImage({
      urls: [this.data.swiperPlaceholderThree], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  clickWaiting: function(e) {
    wx.previewImage({
      urls: [this.data.inComingHolder], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  clickImages: function(e) {
    wx.previewImage({
      urls: 
      [
        this.data.swiperPlaceholderOne,
        this.data.swiperPlaceholderTwo,
        this.data.swiperPlaceholderThree
      ], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})
