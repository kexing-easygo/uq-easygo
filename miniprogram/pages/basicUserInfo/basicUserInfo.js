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
            // 调用获取用户openid的云函数
            wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                    console.log('[云函数] [login] user openid: ', res.result.openid)
                    // 暂时将校园通账户设置为openid
                    this.setData(
                        {
                            easygoAccount: res.result.openid
                        }
                    )
                },
                fail: err => {
                    console.error('[云函数] [login] 调用失败', err)

                }
            })
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