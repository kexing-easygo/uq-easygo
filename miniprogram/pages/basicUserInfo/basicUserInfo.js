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
        if (app.globalData.userInfo) {
            
            this.setData({
                userInfo: app.globalData.userInfo,
                easygoNickname: app.globalData.easygoNickname,
                hasUserInfo: true,
            })
            console.log(this.data.userInfo.openid)
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
        }
    },

})