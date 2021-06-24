//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'uqeasygo1',
        traceUser: true,
      })
    }
    
    // 小程序全局变量
    this.globalData = {
      userInfo: {},
      hasUserInfo: false,
      _openid: '',
      userVerificationCode: '',
      userEmail: '',
    }
    // wx.showModal({
    //   title: "体验须知",
    //   content: "小程序目前在体验测试阶段，后续发布的正式版才会储存数据哦～"
    // })
  },
})
