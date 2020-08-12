// pages/getMobile/getMobile.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputMobileValue: '',
        disabledButton: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    },
    /**
     * 获取用户输入的手机号码
     */
    bindKeyboardInput: function (e) {
        this.data.inputMobileValue = e.detail.value
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
    /**
     * 1. 生成一串随机验证码并返回
     * 2. 容后再议
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
        // app.globalData.userVerificationCode = num
        // app.globalData.userEmail = this.data.inputEmailValue
        wx.navigateTo({
          url: '/pages/getCode/getCode',
        })
    }
})