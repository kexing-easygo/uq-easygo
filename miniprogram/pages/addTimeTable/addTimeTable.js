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

// function cl(content) {
//   console.log(content);
// }
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    courseTitle: "csse1001",
    courseTimeDeatial: {},
    findTime: false,
    selectedClass: [],
    color: "#6600cc",
    mode: "",
    clicked_1: false,
    clicked_2: false,
    clicked_3: false,
    clicked_4: false,
    clicked_5: false,
  },
  onLoad: function(options) {
    let that = this;
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: 'UU妹提醒',
        content: '登录才能使用课程表哦！',
        success(res) {
          wx.redirectTo({
            url: '/pages/profile/profile',
          })
          return;
        }
      })
    } else {
      db.collection("MainUser")
      .where({
        _openid: app.globalData._openid
      })
      .get()
      .then(
        res => {
          if (!("classMode" in res.data[0])) {
            wx.showModal({
              title: 'UU妹提醒',
              content: '请在个人中心-基本资料设置授课模式',
              success(res) {
                wx.redirectTo({
                  url: '/pages/basicUserInfo/basicUserInfo',
                })
                return;
              }
            })
          } else {
            that.setData({
              mode: res.data[0].classMode
            })
            wx.showToast({
              title: '当前上课模式为:' + res.data[0].classMode,
              duration: 1000,
              icon: "none"
            })
          }
        }
      )
    }
    
  },
  onReady: function(options) {
    this.searchCourseTime()
  },
  timeCourse: function (e) {
    this.setData({
      courseTitle: e.detail.value.toUpperCase(),
    });
    console.log(this.data.course);
  },
  searchCourseTime: function () {
    var dic = {};
    let that = this;
    db.collection('TimetableNew').where({
      course_name: that.data.courseTitle,
    }).get({
      success: function (res) {
        for (var key in res.data[0]) {
          if (key.length >= 20) {
            var keyList = key.split("_");
            var mode = keyList[1] + keyList[3]; //S2EX & S2IN
            dic[mode] = [];
            for (var keyItem in res.data[0][key]) {
              var keyItemList = keyItem.split("|");
              var temp = {};
              // type -> LEC1-01 / PRA1
              temp["type"] = keyItemList[1] + "-" + keyItemList[2].replace("Delayed", "D");
              var location = "-";
              if (res.data[0][key][keyItem]["location"].length > 3) {
                location = res.data[0][key][keyItem]["location"].split(" ")[0];
              }
              // console.log(res.data[0][key][keyItem]);
              temp["location"] = location;
              temp["weekday"] = res.data[0][key][keyItem]["day_of_week"];
              var startTime = res.data[0][key][keyItem]["start_time"];
              var time = res.data[0][key][keyItem]["duration"];
              temp["start-end"] = get_class_start_end(startTime, time);
              temp["start"] = startTime;
              temp["hours"] = time / 60;
              temp["week_pattern"] = res.data[0][key][keyItem]["week_pattern"];
              temp["notes"] = "Nothing";
              dic[mode].push(temp);
            }
          }
        }
        if (that.data.mode == "External") {
          dic = dic["S2EX"];
        } else {
          dic = dic["S2IN"];
        }
        that.setData({
          courseTimeDeatial: dic,
          findTime: true,
        });
        console.log(that.data.courseTimeDeatial);
      }
    });

  },
  chooseClass: function (e) {
    var values = e.detail.value;
    var temp = [];
    for (var i = 0; i < this.data.courseTimeDeatial['S2IN'].length; i++) {
      for (var j = 0; j < values.length; j++) {
        if (this.data.courseTimeDeatial['S2IN'][i] == this.data.courseTimeDeatial['S2IN'][values[j]]) {
          temp.push(this.data.courseTimeDeatial['S2IN'][i]);
          break;
        }
      }
    }
    this.data.selectedClass = temp;
  },
  confirmSelect: function () {
    var temp = [];
    for (var i = 0; i < this.data.selectedClass.length; i++) {
      var t = {};
      t["courseName"] = this.data.courseTitle;
      t['classTime'] = this.data.selectedClass[i];
      t['color'] = "background-color:" + this.data.color + ";";
      temp.push(t);
    }
    db.collection("MainUser").where({
      _openid: app.globalData._openid
    }).update({
      data: {
        courseTime: _.push(
          temp
        )
      }, 
      success: function (res) {
        wx.redirectTo({
          url: '/pages/timetable/timetable',
          success: function (res) {
            var page = getCurrentPages().pop()
            if (page == undefined || page == null) return;
            // 刷新页面
            page.onLoad()
          }
        })
      }
    });

    
  },
  bindRed: function () {
    this.setData({
      color: "#FA5151",
      clicked_1: true,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindPink: function () {
    this.setData({
      color: "#FFC300",
      clicked_1: false,
      clicked_2: true,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindLightBlue: function () {
    this.setData({
      color: "#07C160",
      clicked_1: false,
      clicked_2: false,
      clicked_3: true,
      clicked_4: false,
      clicked_5: false,
    });
  },
  bindPurple: function () {
    this.setData({
      color: "#1485EE",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: true,
      clicked_5: false,
    });
  },
  bindYellow: function () {
    this.setData({
      color: "#576B95",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: true,
    });
  }
})