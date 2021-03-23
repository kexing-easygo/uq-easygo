// pages/setMobileNotification/setMobileNotification.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobileSwitch: false
    },
    bindMobileSwitch: function (e) {
        this.setData ({
            mobileSwitch: e.detail.value
        })
        console.log("短信开关改变为：", this.data.mobileSwitch)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
})