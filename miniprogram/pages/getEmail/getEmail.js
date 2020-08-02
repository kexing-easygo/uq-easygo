// pages/getEmail/getEmail.js

const db = wx.cloud.database()
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
        wx.navigateTo({
          url: '/pages/getCode/getCode',
        })
        // wx.cloud.callFunction({
        //     name: 'sendEmail',
        //     data: {
        //         'toAddr': this.data.inputEmailValue,
        //         'subject': '来自你爹的问候', // 后续放入用户的学科号
        //         'content': num,
        //     },
        //     success: res => {
                
        //     },
        //     fail: err => {
        //         console.error("发送邮件云函数调用失败。")
        //     }
        // })
    },
    /**
     * 获取用户输入的邮箱
     */
    bindKeyboardInput: function (e) {
        this.data.inputEmailValue = e.detail.value
        if (e.detail.value.length >= 1) {
            this.setData(
                {
                    disabledButton: false
                }
            )
        } else {
            this.setData(
                {
                    disabledButton: true
                }
            )
        }
    },
})