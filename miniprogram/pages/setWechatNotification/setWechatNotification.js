// pages/setWechatNotification/setWechatNotification.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        soundSwitch: false,
        vibrateSwitch: false
    },
    bindSoundSwitch: function (e) {
        this.setData ({
            soundSwitch: e.detail.value
        })
        console.log("声音开关改变为：", this.data.soundSwitch)
    }, 
    bindVibrateSwitch: function (e) {
        this.setData ({
            vibrateSwitch: e.detail.value
        })
        console.log("震动开关改变为：", this.data.vibrateSwitch)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    }
})
