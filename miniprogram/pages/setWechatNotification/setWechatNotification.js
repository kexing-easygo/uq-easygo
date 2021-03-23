// pages/setWechatNotification/setWechatNotification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    soundSwitch: false,
    vibrateSwitch: false,
    templateMessageResult: ''
  },
  bindSoundSwitch: function (e) {
    this.setData({
      soundSwitch: e.detail.value
    })
    console.log("声音开关改变为：", this.data.soundSwitch)
  },
  subscribe: function () {
    wx.requestSubscribeMessage({
      tmplIds: ["YWEyy0vIoy9kdb12oU9Nr5YvizOF0Z1b3x7lwdZ8AFI"],
      success(res) {
        console.log("订阅成功！")
      },
    })
  },
  call: function () {
    wx.cloud.callFunction(
      {
        name: 'openapi',
        data:
        {
          action: 'sendTemplateMessage'
        },
        success: res => {
          console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
          wx.showModal({
            title: '发送成功',
            content: '请返回微信主界面查看',
            showCancel: false,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
        }
      }
    )
  },
  bindVibrateSwitch: function (e) {
    this.setData({
      vibrateSwitch: e.detail.value
    })
    console.log("震动开关改变为：", this.data.vibrateSwitch)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})
