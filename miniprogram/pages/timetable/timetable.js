// miniprogram/pages/timetable/timetable.js

var deatilTime;
const db = wx.cloud.database();
const app = getApp();
const _ = db.command;

const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function cl(content) {
  console.log(content);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    add: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/添加按钮.png",
    detailShow: false,
    detailAnimation: "bottom: 0;animation: detailDownUp 1s;",
    userCourseTime: [],
    selectClass: {},


  },
  timeDetail: function (event) {
    console.log(event.currentTarget.dataset['courseindex']);
    var courseIndex = event.currentTarget.dataset['courseindex'];
    var temp = this.data.userCourseTime[courseIndex];
    temp['courseindex'] = courseIndex;
    this.setData({
      detailShow: true,
      selectClass: temp
    });
    cl(this.data.selectClass);
  },

  timeDetailDown: function (event) {
    this.setData({
      //detailAnimation : "bottom: -545rpx;animation: detailUpDown 1s;",
      detailShow: false,
    });
    // console.log(this.data['detailShow']);
    // deatilTime = setTimeout(function() {
    //   this.data.setData({
    //     detailShow: false,
    //   });
    // } , 1000);
  },

  quitShade: function (event) {

    this.setData({
      detailShow: false,
    });
    clearTimeout(deatilTime);
  },
  deleteClass: function (e) {
    cl(e.currentTarget.dataset['classindex']);
    var temp = this.data.userCourseTime;
    temp.splice(e.currentTarget.dataset['classindex'], 1);
    let that = this;
    db.collection("MainUser").where({
      _openid: "oe4Eh5bq0O-m12IGUL6Ps-DkBuj8"
    }).get({
      success: function (res) {
        var list = res.data[0]['courseTime'];
        list.splice(e.currentTarget.dataset['classindex'], 1);
        db.collection("MainUser").where({
          _openid: "oe4Eh5bq0O-m12IGUL6Ps-DkBuj8"
        }).update({
          data: {
            courseTime: list
          }
        })
        that.setData({
          userCourseTime: temp,
          detailShow: false,
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    db.collection("MainUser").where({
      _openid: "oe4Eh5bq0O-m12IGUL6Ps-DkBuj8"
    }).get({
      success: function (res) {
        var temp = res.data[0]['courseTime'];
        for (var i = 0; i < temp.length; i++) {
          var left = 140 * (weeks.indexOf(temp[i]["classTime"]["weekday"]));
          var start = temp[i]["classTime"]["start"].split(":")[0];
          var top = 90 * (start - 8);
          temp[i]['left'] = "left:" + left + "rpx;"
          temp[i]['top'] = "top:" + top + "rpx;"
          temp[i]["color"] = "background-color:" + temp[i]['color'] + ";";
          temp[i]["height"] = "height:" + temp[i]['classTime']["hours"] * 88 + "rpx;";
        }
        that.setData({
          userCourseTime: temp
        });
      }
    });
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