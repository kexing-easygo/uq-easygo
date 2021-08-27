// miniprogram/pages/searchReview/searchReview.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
//要random结果的list (Arthur ever been here)
var EAITcourse = ["CSSE1001", "CSSE2002", "CSSE2310", "COMP3506", "COMP3702", "MATH1050", "CSSE2010", "INFS1200", "INFS2200", "INFS3200", "INFS3200", "INFS3202", "DECO3801", "DECO1400", "DECO3800"];

var BScourse = ["ACCT1110", "LAWS1100", "ACCT1102", "MGST1301", "ECON1301", "ECON1011", "ECON1310", "FINM1415", "ACCT1102", "BISM1201", "ACCT2102", "ACCT3101", "BISM2202", "ACCT2102", "FINM2415"];

//生成随机数 (Arthur ever been here)
function make_random(min, max, numbers) {
  var result = [];
  while (result.length < numbers) {
    var number = Math.floor(Math.random() * (max - min) + min);
    console.log(number);
    if (result.indexOf(number) < 0) {
      result.push(number);
      console.log(number);
    }
  }
  return result;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchError: false,
    buttons: [{ text: '取消' }, { text: '确认' }],
    searchBarValue: '',
    hotSearchIT: [],
    hotSearchBS: []

  },
  bindCourseInput: function (e) {
    this.setData({
      searchBarValue: e.detail.value
    })
  },
  bindHotSearch: function (e) {
    var name = e.currentTarget.dataset['name'];
    this.setData({
      searchBarValue: name
    })
    this.fetchCourseInfo();
  },
  /**
   * 返回某门课的全部信息，并跳转至review界面
   */
  fetchCourseInfo: function () {
    var title = this.data.searchBarValue.toUpperCase();
    db.collection("CourseNew")
      .where({
        course_name: title
      })
      .get()
      .then(
        res => {
          if (res.data.length == 0) {
            wx.showModal({
              title: 'UU妹提醒',
              content: '这门课超出了U妹的搜索范围。请确认好课号重新输入或微信联系U妹～',
              success(res) {
                return;
              }
            })

          } else {
            db.collection("CourseNew")
              .where({
                course_name: title
              }).update({
                data: {
                  searchTimes: _.inc(1)
                },
              })

            app.globalData.reviewCourseName = title;
            wx.navigateTo({
              url: '/pages/review/review',
              success: function (res) {
              }
            })
          }
        }
      )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //生成随机数 (Arthur ever been here)
    var chosenCourseIndex = make_random(0, 14, 6);
    var SearchIT = [];
    var SearchBS = [];
    //6是有6个要展示的(Arthur ever been here)
    for (var i = 0; i < 6; i++) {
      SearchIT.push(EAITcourse[chosenCourseIndex[i]]);
      SearchBS.push(BScourse[chosenCourseIndex[i]]);
    }
    this.setData({
      hotSearchIT: SearchIT,
      hotSearchBS: SearchBS
    });


    // const _ = db.command
    // var temp = 
    // {
    //   poster_name: "Null🐷",
    //   poster_open_id: "oe4Eh5Slt8P3MIQIq-UwMuE3pyHg",
    //   mode: "Internal",
    //   outstanding: true,
    //   post_date: "2021-07-02",
    //   post_time: "12:00",
    //   likes: 1,
    //   review: "这课真的巨难", 
    //   semester_enrolled: "2020 s2",
    //   liked_by: ["oe4Eh5Slt8P3MIQIq-UwMuE3pyHg"]
    // }
    // db.collection("CourseReview")
    //   .where({
    //     course_name: "CSSE1001"
    //   })
    //   .update({
    //     data: {
    //       reviews: _.push(temp)
    //     },
    //     success: function (res) {

    //     }
    //   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.setData({
    //   searchBarValue: "CSSE1001"
    // })
    // this.fetchCourseInfo();
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