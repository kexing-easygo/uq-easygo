// pages/modifyUserName/modifyUserName.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: '',
        easygoNickname: null
    },
    // 获取用户在输入框输入的内容
    bindKeyboardInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    // 修改用户的校园通用户名，
    // 并返回上一页面
    submitNewNickname: function() {
        // if (this.data.inputValue.length > 0) {
            this.data.easygoNickname = this.data.inputValue
            app.globalData.easygoNickname = this.data.easygoNickname
            // 返回上一页面
            wx.navigateTo({
              url: '/pages/basicUserInfo/basicUserInfo',
            })
        // }
        // console.log(this.data.easygoNickname)
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

    }
})