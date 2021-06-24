// pages/getEmail/getEmail.js


const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputEmailValue: '',
    disabledButton: true
  },
  /**
   * 1. 生成一串随机验证码并返回
   * 2. 调用发邮件的云函数，发送返回的验证码
   * 3. 函数内获取云函数返回的验证码
   * 4. 和用户的验证码相比对
   * 5. 比对成功，录入数据
   */
  sendVerificationCode() {
    if (this.isEmail(this.data.inputEmailValue)) {
      var n1 = Math.floor(Math.random() * 10).toString()
      var n2 = Math.floor(Math.random() * 10).toString()
      var n3 = Math.floor(Math.random() * 10).toString()
      var n4 = Math.floor(Math.random() * 10).toString()
      var n5 = Math.floor(Math.random() * 10).toString()
      var n6 = Math.floor(Math.random() * 10).toString()
      var num = n1 + n2 + n3 + n4 + n5 + n6
      console.log(num)
      app.globalData.userVerificationCode = num
      app.globalData.userEmail = this.data.inputEmailValue
      wx.redirectTo({
        url: '/pages/getCode/getCode',
      })
      var content = "您本次的验证码为: "
      content += num
      content += "。"
      content += "打死也不要告诉别人哦！"
      wx.cloud.callFunction({
        name: 'sendEmail',
        data: {
          "toAddr": this.data.inputEmailValue,
          "subject": "UQ校园通",
          "content": content,
        },
        success: res => {

        },
        fail: err => {
          console.error("发送邮件云函数调用失败。")
        }
      })
    } else {
      wx.showModal({
        title: '错误',
        content: '您的邮箱格式输入的不正确，请重新输入',
      })
      return
    }
    
  },
  isEmail: function (email) {
    var reg = /^(.)+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+([a-zA-Z0-9_-])/
    return reg.test(email)
  },
  /**
   * 获取用户输入的邮箱
   */
  bindKeyboardInput: function (e) {
    var email = e.detail.value
    if (e.detail.value.length >= 1) {
      this.setData({
        disabledButton: false,
        inputEmailValue: email
      })
    } else {
      this.setData({
        disabledButton: true
      })
    }
  },
  onShow: function() {
    wx.showModal({
      title: "UU妹提醒",
      content: "官方推荐QQ邮箱或者学校邮箱；其他邮箱可能需要在垃圾邮箱查看"
    })
  }
})