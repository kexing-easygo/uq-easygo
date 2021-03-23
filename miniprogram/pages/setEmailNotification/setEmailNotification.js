// pages/setEmailNotification/setEmailNotification.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        emailSwitch: false
    },
    bindEmailSwitch: function (e) {
        this.setData ({
            emailSwitch: e.detail.value
        })
        console.log("邮箱开关改变为：", this.data.emailSwitch)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
})