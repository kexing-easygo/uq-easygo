// pages/email/email.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasEmail: '未绑定'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userEmail == null) {
            this.setData(
                {
                    hasEmail: "未绑定"
                }
            )
        } else {
            this.setData(
                {
                    hasEmail: app.globalData.userEmail
                }
            );
        }
    }
})