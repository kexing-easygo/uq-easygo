// pages/basicUserInfo/basicUserInfo.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    hasUserInfo: false,
    array: ['External', 'Internal'],
    classMode: "点击设置",
    index: 0,
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      classMode: this.data.array[e.detail.value],
    })
    let that = this;
    db.collection('MainUser')
    .where({
      // _openid: app.globalData._openid
      _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"

    })
    .update({
      data: {
        // 表示将 done 字段置为 true
        classMode: that.data.classMode
      },
      success: function(res) {
        wx.showToast({
          title: '更新成功',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  setMode: function (e) {
    this.setData({
      setClassMode: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (app.globalData.hasUserInfo) {
      // 获取用户上课模式
      var classMode = "点击设置"
      db.collection('MainUser')
      .where({
        // _openid: app.globalData._openid
        _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"

      })
      .get()
      .then(res => {
        if ('classMode' in res.data[0]) {
          classMode = res.data[0].classMode;
        }
        that.setData({
          classMode: classMode
        })
      })
      that.setData({
        hasUserInfo: true,
        nickName: app.globalData.userInfo.nickName
      })
    } else {
      wx.showToast({
          title: '你还没有登录哦',
          icon: 'none',
          duration: 2000
      })
    }
  }
})