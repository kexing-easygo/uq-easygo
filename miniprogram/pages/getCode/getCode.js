// pages/getCode/getCode.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputCodeValue: '',
        verificationCode: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData(
            {
                verificationCode: app.globalData.userVerificationCode
            }
        )
    },
    /**
     * 获取用户输入的验证码
     */
    bindKeyboardInput: function (e) {
        this.data.inputCodeValue = e.detail.value
    },
    checkVerificationCode: function (e) {
        var userInput = this.data.inputCodeValue
        while (userInput != this.data.verificationCode) {
            this.setData(
                {
                    info: "输入错误，请再试一次"
                }
            )
        }
        console.log("输入正确。")
        // 调用数据库，录入用户邮箱
        wx.navigateTo({
            url: '/pages/email/email',
        })
    }
})