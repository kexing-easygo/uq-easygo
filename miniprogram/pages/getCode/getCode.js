// pages/getCode/getCode.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputCodeValue: '',
    verificationCode: '',
    disabledButton: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      verificationCode: app.globalData.userVerificationCode
    })
  },
  /**
   * 获取用户输入的验证码
   */
  bindKeyboardInput: function (e) {
    this.data.inputCodeValue = e.detail.value;
    if (e.detail.value.length >= 1) {
      this.setData({
        disabledButton: false,
      });
    } else {
      this.setData({
        disabledButton: true,
      });
    }
  },
  checkVerificationCode: function (e) {
    var userInput = this.data.inputCodeValue
    // 用户输入不正确的话弹窗
    if (userInput != this.data.verificationCode) {
      wx.showModal({
        title: '错误',
        content: '您的验证码输入的不正确，请重新输入',
      })
      return
    }
    // 调用数据库，录入用户邮箱
    db.collection('MainUser')
      .where({
        _openid: app.globalData._openid
      })
      .update({
        data: {
          userEmail: app.globalData.userEmail
        }
      })
    wx.redirectTo({
      url: '/pages/email/email',
    })
  }
})