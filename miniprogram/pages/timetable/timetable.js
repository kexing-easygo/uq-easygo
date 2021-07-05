// miniprogram/pages/timetable/timetable.js
import util from '../../utils/util.js';
var deatilTime;
const db = wx.cloud.database();
const app = getApp();
const _ = db.command;

const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// 时间序列，判断clash
const series = {
  "08:00": 0,
  "09:00": 1,
  "10:00": 2,
  "11:00": 3,
  "12:00": 4,
  "13:00": 5,
  "14:00": 6,
  "15:00": 7,
  "16:00": 8,
  "17:00": 9,
  "18:00": 10,
  "19:00": 11
}

/**
 * 从7.26开始，将第几周和那周的周一日期对应起来，以便于生成当周的
 * 五天日期。
 */
function generateTeachingWeeks() {
  var teachingStartMonday = new Date();
  teachingStartMonday.setDate(26);
  teachingStartMonday.setMonth(6);
  var teaching_weeks = {
    31: teachingStartMonday
  }
  for (var i = 32; i < 40; i++) {
    var newDate = new Date();
    newDate.setDate(teachingStartMonday.getDate() + 7 * (i - 31));
    teaching_weeks[i] = newDate;
  }
  var teachingStartMonday = new Date();
  teachingStartMonday.setDate(26);
  teachingStartMonday.setMonth(7);
  for (var i = 41; i < 46; i++) {
    var newDate = new Date();
    newDate.setDate(teachingStartMonday.getDate() + 7 * (i - 31));
    teaching_weeks[i] = newDate;
  }
  cl(teaching_weeks)
  return teaching_weeks;
}

// 教学周，将week num和第一天绑定
const teachingWeeks = generateTeachingWeeks();

function cl(content) {
  console.log(content);
}
/**
 * 基于7/26为第二学期第一周第一天，计算现在是第几周
 */
function current_week() {
  const targetDate = new Date();
  const startDate = new Date(targetDate);

  targetDate.setDate(26);
  targetDate.setMonth(7);
  startDate.setMonth(0);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const millisecondsOfWeek = 1000 * 60 * 60 * 24 * 7;

  const diff = targetDate.valueOf() - startDate.valueOf();

  return Math.ceil(diff / millisecondsOfWeek) - 3
}

/**
 * 获取某天所在的周一。用于生成周一到周五的日期
 * @param {获取} date 
 */
function GetMonday(date) {
  var dd = new Date(date)
  var week = dd.getDay(); //获取时间的星期数
  var minus = week ? week - 1 : 6;
  dd.setDate(dd.getDate() - minus); //获取周一日期
  return dd;
}


var today = new Date();
// 当前月份为today.getMonth() + 1
var currentMonth = today.getMonth() + 1;
// 当前周几为today.getDay() + 1
var currentDay = today.getDay();
// 当前第几周没想好，写死了10
var currentWeek = current_week();
var selectWeekTitleStyle = "background-color: rgba(100, 103, 204, 0.7);";
const weekday_mapper = {
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五"
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
    currentMonth: currentMonth,
    weekdays: [],
    currentWeek: current_week(),
    currentDay: currentDay,
    weekTitleStyle: ["", "","","","","","","","","","","","",""],
    selectWeekStyle: selectWeekTitleStyle,
    selectWeek: currentWeek ,
    // 是否显示所有课程
    isAllWeek: false

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
      _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
    }).get({
      success: function (res) {
        var list = res.data[0]['courseTime'];
        list.splice(e.currentTarget.dataset['classindex'], 1);
        db.collection("MainUser").where({
          _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
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
  // currentWeek: function () {
  //   const targetDate = new Date();
  //   const startDate = new Date(targetDate);

  //   startDate.setMonth(0);
  //   startDate.setDate(1);
  //   startDate.setHours(0, 0, 0, 0);

  //   const millisecondsOfWeek = 1000 * 60 * 60 * 24 * 7;

  //   const diff = targetDate.valueOf() - startDate.valueOf();

  //   cl(Math.ceil(diff / millisecondsOfWeek))
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var selectWeek = this.data.selectWeek;
    console.log(selectWeek);
    // 根据第几周，返回那周的周一日期
    var startDate = teachingWeeks[selectWeek];
    this.setData({
      currentMonth: startDate.getMonth() + 1
    })
    // 根据current_week逆向生成日期
    // 先获取当前周的周一，再从周一开始计算四天
    // 忽略周末    
    var weekdays = []
    for (var i = 0; i < 5; i++) {
      var monday = GetMonday(startDate);
      var newDate = new Date(monday.setDate(monday.getDate() + i));
      var month = newDate.getMonth() + 1;
      weekdays.push(weekday_mapper[i + 1] + "\n" + month + "-" + newDate.getDate());
    }
    this.setData({
      weekdays: weekdays
    })
    let that = this;
    db.collection("MainUser").where({
      _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
    }).get({
      success: function (res) {
        var temp = res.data[0]['courseTime'];
        for (var i = 0; i < temp.length; i++) {
          temp[i]['index'] = i;
            for (var j = 0; j < temp.length; j++) {
              if (i != j) {
                if (temp[i]["classTime"]["weekday"] == temp[j]["classTime"]["weekday"]) {
                  var s1 = that.generateTimeSeries(temp[i]);
                  var s2 = that.generateTimeSeries(temp[j]);
                  for (var k = 0; k < 12; k++) {
                    // 判断两节课是否有冲突的部分
                    if (s1[k] == s2[k] && "clash" in temp[i] == false && "clash" in temp[j] == false) {
                      if (s1[k] == 1) {
                        temp[i]["clash"] = 0
                        temp[j]["clash"] = 1
                      }
                    }
                  }
                }
              }
            }
          
        }

        for (var i = 0; i < temp.length; i++) {

          var clash = temp[i]["clash"]
          if (temp[i].hasOwnProperty("clash")) {
            temp[i]['width'] = "width:" + "67.5rpx;"
            var left = 140 * (weeks.indexOf(temp[i]["classTime"]["weekday"])) + 70 * clash;
          } else {
            temp[i]['width'] = "width:" + "135rpx;"
            var left = 140 * (weeks.indexOf(temp[i]["classTime"]["weekday"]));
          }
          var start = temp[i]["classTime"]["start"].split(":")[0];
          var top = 25 + 90 * (start - 8);
          temp[i]['left'] = "left:" + left + "rpx;"
          temp[i]['top'] = "top:" + top + "rpx;"
          temp[i]["color"] = temp[i]['color'];
          temp[i]["height"] = "height:" + temp[i]['classTime']["hours"] * 90 + "rpx;";
          temp[i]["notes"] = temp[i]['classTime']["notes"];
          // != 变成 == 即可
          if (that.data.isAllWeek == false) {

            if (temp[i]["classTime"]["week_pattern"][selectWeek] == 1) {
              temp[i]["display"] = "yes";
            } else {
              temp[i]["display"] = "no";
            }
          } else {
            if (temp[i]["classTime"]["week_pattern"][selectWeek] != 1) {
              temp[i]["display"] = "yes";
            } else {
              temp[i]["display"] = "no";
            }
          }
          
        }
        // cl(temp);
        that.setData({
          userCourseTime: temp
        });
      }
    });
    // 根据current_week逆向生成日期
    // 先获取当前周的周一，再从周一开始计算四天
    // 忽略周末    
    // var weekdays = []
    // for (var i = 0; i < 5; i++) {
    //   var monday = GetMonday(new Date());
    //   var newDate = new Date(monday.setDate(monday.getDate() + i));
    //   var month = newDate.getMonth() + 1;
    //   weekdays.push(weekday_mapper[i + 1] + "\n" + month + "-" + newDate.getDate());
    // }
    // this.setData({
    //   weekdays: weekdays
    // })
  },
  add_note: function (e) {
    var temp = this.data.selectClass;
    temp.notes = e.detail.value;
    this.setData({
      selectClass: temp,
    });
  },

  update_note: function(e) {
    var temp = this.data.userCourseTime;
    temp[this.data.selectClass.index]["classTime"]['notes'] = this.data.selectClass.notes;
    let that = this;
    db.collection("MainUser").where({
      _openid: "oe4Eh5T-KoCMkEFWFa4X5fthaUG8",
    }).update({
      data: {
        courseTime: temp,
      }
    });
  },
  /**
   * 根据每节课的时间
   * 生成时间列表
   * 如果课是在8-9点，则该位置为1，其余位置为0
   * 如果课在8-10，则从8-9开始标记为1（两个1），其余位置为0
   */
  generateTimeSeries: function (course) {
    var course_duration = course["classTime"]["hours"];
    var time_series = []
    for (var i = 0; i < 12; i++) {
      time_series.push(0);
    }
    var start_index = series[course["classTime"]["start"]]
    for (var i = start_index; i < start_index + course_duration; i++) {
      time_series[i] = 1
    }
    return time_series;
  },
  change_week: function(e) {
    var tmpSelect = parseInt(e.currentTarget.dataset['week']) + current_week() -1;
    if (tmpSelect >= 40) {
      tmpSelect += 1;
    }
    this.setData({
      selectWeek: tmpSelect,
      isAllWeek: false
    });
    this.onLoad();
   
  },
  /**
   * 切换至所有课程都显示的模式
   */
  changeAllWeek: function() {
    var weekdays = []
    for (var i = 0; i < 5; i++) {
      var monday = GetMonday(new Date());
      var newDate = new Date(monday.setDate(monday.getDate() + i));
      var month = newDate.getMonth() + 1;
      weekdays.push(weekday_mapper[i + 1] + "\n" + month + "-" + newDate.getDate());
    }
    this.setData({
      currentMonth: new Date().getMonth() + 1,
      weekdays: weekdays,
      isAllWeek: true
    })
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