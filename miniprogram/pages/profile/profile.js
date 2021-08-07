// pages/profile/profile.js
const app = getApp()
const db = wx.cloud.database()
const command = db.command
function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  return y + "-" + m + "-" + d;
}

var d1 = GetDateStr(4)
var d2 = GetDateStr(30)

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    basicInfoIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/基本信息.png",
    basicSettingIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/基本设置.png",
    bindingEmailIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/邮箱绑定.png",
    bindingPhoneIcon: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/手机绑定.png",
    contactUs: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/联系我们.png"
  },

  /**
   * Lifecycle function--Called when page load
   * 调用getSetting接口判断用户是否已经授权
   * 
   */
  onLoad: function (options) {
    let that = this
    //从云数据库中检索该openid是否存在
    if (!app.globalData.hasUserInfo) {
      that.setData({
        hasUserInfo: false
      })
      return;
    }
    db.collection('MainUser')
    .where({
      _openid: app.globalData._openid
    })
    .get().then(
      res => {
        if (res.data.length > 0) {
          // 将读取到的所有用户的信息均更新至全局变量中
          app.globalData.userInfo = res.data[0].userInfo
          app.globalData.userEmail = res.data[0].userEmail
          app.globalData.notification = res.data[0].notification
          app.globalData.hasUserInfo = true
          that.setData({
            userInfo: res.data[0].userInfo,
            hasUserInfo: true
          })
        }
      })

  },

  /**
   * 仅获取开放信息，如头像，名字，性别，城市等
   * 
   */
  getUserProfile: function () {
    let that = this
    wx.getUserProfile({
      desc: "登陆获取用户开放信息",
      success: async (r) => {
        that.setData({
          userInfo: r.userInfo,
          hasUserInfo: true
        })
        app.globalData.hasUserInfo = true
        db.collection("MainUser")
          .add({
            data: {
              nickName: r.userInfo.nickName,
              userAssignments: [
                {
                  'color': '#7986CB',
                  'name': "CSSE1001 A1 (示例)",
                  "date": d1,
                  "time": "00:00",
                  "default": true
                },
                {
                  'color': '#7986CB',
                  'name': "点我查看更多",
                  "date": d2,
                  "time": "00:00",
                  "default": true
                }
              ],
              userInfo: r.userInfo,
              userEmail: "",
              notification: {
                emailNotification: "",
                wechatNotification: "",
                oneDay: "",
                threeDay: "",
                oneWeek: "",
                location: "AU"
              },
              history: {
                calculator: {},
                search: {}
              }
            }
          })
      },
    })
  },
})