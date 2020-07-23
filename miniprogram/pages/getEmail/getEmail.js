// pages/getEmail/getEmail.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hasEmail: false,
        userEmail: null,
        inputEmailValue: '',
        verificationCode: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    bindKeyboardInput: function (e) {
        this.data.inputEmailValue = e.detail.value
    },
    /**
     * 1. 调用发邮件的云函数，发送验证码
     * 2. 函数内获取云函数返回的验证码
     * 3. 和用户的验证码相比对
     * 4. 比对成功，录入数据
     */
    getVerificationCode: function () {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})