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
     * 1. 调用生成随机验证码的云函数，生成一串随机验证码并返回
     * 2. 调用发邮件的云函数，发送返回的验证码
     * 3. 函数内获取云函数返回的验证码
     * 4. 和用户的验证码相比对
     * 5. 比对成功，录入数据
     */
    getVerificationCode() {
        wx.cloud.callFunction({
            name: 'generator',
            data: {'type': 'getVerificationCode'},
            success: res => {
                console.log(res.result)
            },
            fail: err => {
                console.error(err)
            }
        })
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