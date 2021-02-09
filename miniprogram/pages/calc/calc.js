// pages/calc/calc.js
Page({

  /**
   * Page initial data
   */
  data: {
    InComingImage:"cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/计算器敬请期待页面.png",
    selectSemester: true,
    semester: "select semester",

  },
  
  /** 
   * 获取键盘输入
   */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /** 
   * 选择器功能
  */


mySelect: function(e) {
  this.setData({
    selectSemester: false
  })

},
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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