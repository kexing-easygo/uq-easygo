// pages/home/home.js
// const moment = require('../../utils/moment.min')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

function timeCompare(h1, m1, h2, m2) {
  return h1 * 60 + m1 > h2 * 60 + m2;
}
Page({

  /**
   * Page initial data
   */
  data: {
    // 轮播图
    swiperPlaceholderOne: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图一.png",
    swiperPlaceholderTwo: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/轮播图二.png",
    swiperPlaceholderThree: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/课程表宣传图.png",
    // 功能图标
    calcIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/新计算器图标.png",
    countdownIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/新倒计时图标.png",
    timetableIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/新课表图标.png",
    reviewIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/新课评图标.png",
    // 下方非滚动海报
    PostHolderOne: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/非滚动海报一.png",
    PostHolderTwo: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/非滚动海报二.png",
    PostHolderThree: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/非滚动海报三.png",
    classNotice: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/shangkeling.png",
    tileImg: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/titleImg.png",
    classToday: [],
    haveClass: false,
  },

  /**
   * Lifecycle function--Called when page load
   * 在进入主页时，缓存用户的openid
   */

  onLoad: function (options) {
    var that = this;

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData._openid = res.result.openid
        app.globalData._openid
        // 拿到openid后，检索数据库
        // 如果数据库内没有对应openid，就视为未登录
        db.collection('MainUser')
          .where({
            _openid: app.globalData._openid,
          })
          .get({
            success: function (res) {
              if (res.data.length == 0) {
                app.globalData.hasUserInfo = false;
              } else {
                app.globalData.hasUserInfo = true;
                db.collection("MainUser").where({
                  _openid: app.globalData._openid
                }).get({
                  success: function (res) {
                    var temp = res.data[0]['courseTime'];
                    var week = new Date().getDay(),
                      arr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                      today = arr[week];

                    var todayResult = [];
                    var now = new Date();
                    for (var i = 0; i < temp.length; i++) {
                      if (temp[i]['classTime']["weekday"] == today) {
                        var classTime = temp[i]['classTime']["start"].split(':');
                        if (timeCompare(parseInt(classTime[0]), parseInt(classTime[1]), parseInt(now.getHours()), parseInt(now.getMinutes()))) {
                          todayResult.push(temp[i]);
                        }

                      }
                    }
                    if (todayResult.length > 0) {
                      //显示结果
                      that.setData({
                        classToday: todayResult,
                        haveClass: true
                      });
                    }
                  }
                })
              }
            }
          })
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
      imageUrl: this.data.PostHolderTwo
    }
  },
  navigateToWaiting: function () {
    wx.navigateTo({
      url: '/pages/waiting/waiting',
    })
  },
  clickWebview: function(e) {
    wx.navigateTo({
      url: "/pages/webView/webView"
    })
  },
  clickImage: function (e) {
    var model = e.currentTarget.dataset.model
    var imageUrl = ''
    if (model == "one") {
      imageUrl = this.data.PostHolderOne
    } else if (model == "two") {
      imageUrl = this.data.PostHolderTwo
    } else {
      imageUrl = this.data.PostHolderThree
    }

    wx.previewImage({
      urls: [imageUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  clickImages: function (e) {
    wx.previewImage({
      urls: [
        this.data.swiperPlaceholderOne,
        this.data.swiperPlaceholderTwo,
        this.data.swiperPlaceholderThree
      ], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },
})