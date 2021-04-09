// miniprogram/pages/addTimeTable/addTimeTable.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command

function get_class_start_end(start, duration) {
  var hour = duration / 60;
  var starts = start.split(":");
  var end = parseInt(starts[0]) + hour + ":" + starts[1];
  return start + " - " + end; 
}

function cl(content) {
  console.log(content);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseTitle:"csse1001",
    courseTimeDeatial: {},
    findTime: false,
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
  timeCourse: function(e) {
    this.setData({
      courseTitle:e.detail.value.toUpperCase(),
    });
    console.log(this.data.course);
  },
  searchCourseTime: function() {
   
    var dic = {};
    let that = this;
    db.collection('Timetable').where({
      course: that.data.courseTitle,
    }).get({
      success: function(res) {
        
        for (var key in res.data[0]) {
          
          if (key.length >= 20) {
            var keyList = key.split("_");
            
            var mode = keyList[1] + keyList[3];
            var i = 0;
            
            dic[mode] = [];
            
            
            for (var keyItem in res.data[0][key]) {
              var keyItemList = keyItem.split("|");
              var temp = {};
              temp["type"] = keyItemList[1];
              var location = "-";
              if (res.data[0][key][keyItem]["location"].length > 3) {
                location = res.data[0][key][keyItem]["location"].split(" ")[0];
              }
              
              temp["location"] = location;
              temp["weekday"] = res.data[0][key][keyItem]["day_of_week"];
              var startTime = res.data[0][key][keyItem]["start_time"];
              var time = res.data[0][key][keyItem]["duration"];
              
              temp["start-end"] = get_class_start_end(startTime, time);
              temp["start"] = startTime;
              temp["hours"] = time / 60;
              dic[mode].push(temp);    
            }
          }
        }

        that.setData({
          courseTimeDeatial: dic,
          findTime: true,
        });
        cl(that.data.courseTimeDeatial);
      }
    });

    
  }
})