// miniprogram/pages/addTimeTable/addTimeTable.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command

function get_class_start_end(start, duration, timeDiff) {
  var hour = duration / 60;
  var starts = start.split(":");
  var stHour =  parseInt(starts[0]) - timeDiff;
  var endHour =  stHour + hour;
  return stHour + ":" + starts[1] + " - " + endHour + ":" + starts[1] ;
}

// function cl(content) {
//   console.log(content);
// }
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    courseTitle: "",
    courseTimeDeatial: {},
    findTime: false,
    selectedClass: [],
    color: "#6600cc",
    mode: "",
    clicked_1: true,
    // clicked_2: false,
    // clicked_3: false,
    // clicked_4: false,
    // clicked_5: false,
    showButton: false,
    
    afterGrey: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后灰色选择器.png",
    afterRed: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后红色选择器.png",
    afterYellow: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后黄色选择器.png",
    afterGreen: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后绿色选择器.png",
    afterBlue: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/后蓝色选择器.png",

    beforeGrey: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未灰色选择器.png",
    beforeRed: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未红色选择器.png",
    beforeYellow: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未黄色选择器.png",
    beforeGreen: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未绿色选择器.png",
    beforeBlue: "cloud://uqeasygo1.7571-uqeasygo1-1302668990/image/颜色选择器/未蓝色选择器.png",
    timeZoneDiff: 0,
  },
  onLoad: function(options) {
    var now = new Date();
    var timeDiff = (now.getTimezoneOffset() - (-600)) / 60;
    this.setData({
      timeZoneDiff: timeDiff
    });
    let that = this;
    db.collection("MainUser")
    .where({
      _openid: app.globalData._openid
    })
    .get().then(
      res => {
        if (res.data.length == 0) {
          wx.showModal({
            title: 'UU妹提醒',
            content: '登录才能使用课程表哦！请前往个人中心登录～',
            success(res) {
              wx.redirectTo({
                url: '/pages/timetable/timetable',
              })
              return;
            }
          })
        } else {
          if ("classMode" in res.data[0]) {
            that.setData({
              mode: res.data[0].classMode
            })
            wx.showToast({
              title: '当前上课模式为:' + res.data[0].classMode,
              duration: 2000,
              icon: "none"
            })
          } else {
            wx.showModal({
              title: 'UU妹提醒',
              content: '请前往个人中心-基本资料设置授课模式～',
              success(res) {
                wx.reLaunch({
                  url: '/pages/timetable/timetable',
                })
                return;
              }
            })
          }
        }
      }
    )    
  },
  timeCourse: function (e) {
    this.setData({
      courseTitle: e.detail.value.toUpperCase(),
    });
  },
  searchCourseTime: function () {
    var dic = {};
    var timediff = this.data.timeZoneDiff;
    let that = this;
    db.collection('TimetableNew').where({
      course_name: that.data.courseTitle.toUpperCase(),
    }).get({
      success: function (res) {
        if (res.data.length == 0) {
          wx.showModal({
            title: 'UU妹提醒',
            content: '这门课太难了，超出了U妹的搜索范围，请确定课程名称后重新搜索或联系U妹～',
            success(res) {
              return;
            }
          })
        }
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
              temp["start-end"] = get_class_start_end(startTime, time, 0);
              temp["start-end-display"] = get_class_start_end(startTime, time, timediff);
              temp["start"] = startTime;
              temp["hours"] = time / 60;
              temp["week_pattern"] = res.data[0][key][keyItem]["week_pattern"];
              temp["notes"] = null;
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
          showButton: true
        });
      }
    });

  },
  chooseClass: function (e) {
    var values = e.detail.value;
    var temp = [];
    for (var i = 0; i < this.data.courseTimeDeatial.length; i++) {
      for (var j = 0; j < values.length; j++) {
        if (this.data.courseTimeDeatial[i] == this.data.courseTimeDeatial[values[j]]) {
          temp.push(this.data.courseTimeDeatial[i]);
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
        wx.reLaunch({
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
  bindRed: function() {
    this.setData({
      color: "#FF7043",
      clicked_1: true,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },

  bindYellow: function() {
    this.setData({
      color: "#FFB300",
      clicked_1: false,
      clicked_2: true,
      clicked_3: false,
      clicked_4: false,
      clicked_5: false,
    });
  },

  bindGreen: function() {
    this.setData({
      color: "#8BC34A",
      clicked_1: false,
      clicked_2: false,
      clicked_3: true,
      clicked_4: false,
      clicked_5: false,
    });
  },

  bindBlue: function() {
    this.setData({
      color: "#29B6F6",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: true,
      clicked_5: false,
    });
  },

  bindGrey: function() {
    this.setData({
      color: "#576B95",
      clicked_1: false,
      clicked_2: false,
      clicked_3: false,
      clicked_4: false,
      clicked_5: true,
    });
  },
})