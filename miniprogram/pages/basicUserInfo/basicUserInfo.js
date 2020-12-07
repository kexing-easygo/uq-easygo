// pages/basicUserInfo/basicUserInfo.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        easygoNickname: null,
        userGender: null,
        hasAccountAllocated: false,
        account: null,
        easygoAccount: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(app.globalData.userinfo)
        if (app.globalData.hasUserInfo == true) {
            this.setData({
                userInfo: app.globalData.userInfo,
                easygoNickname: app.globalData.easygoNickname,
                hasUserInfo: true,
            })
            var gender = null
            if (this.data.userInfo.gender == "1") {
                gender = "男"
            } else if (this.data.userInfo.gender == "2") {
                gender = "女"
            } else {
                gender = "未知"
            }
            this.setData({
                userGender: gender
            })
        } else {
            // 如果用户还没有登录，提示未登录
            // 并跳转至profile页面
            wx.showToast({
                title: '你还没有登录哦',
                icon: 'none',
                duration: 2000
            })
            wx.navigateTo({
              url: '/pages/profile/profile',
            })
        }
    },

})