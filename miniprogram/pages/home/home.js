// pages/home/home.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    swiperPlaceholderOne:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图上线了.png",
    swiperPlaceholderTwo:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图倒计时功能.png",
    swiperPlaceholderThree:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图敬请期待.png",
    calcIcon:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/计算器.png",
    countdownIcon:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/倒计时.png",
    inComingHolder:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图敬请期待.png",
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

  }
})
