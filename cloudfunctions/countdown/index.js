// 云函数入口文件
const cloud = require('wx-server-sdk')
const MAIN_USER_SUFFIX = "_MainUser"

cloud.init()

const db = cloud.database();
const _ = db.command

var now = new Date().getTime()

function GetDateStr(AddDayCount) {
  var dd = new Date();
  //获取AddDayCount天后的日期
  dd.setDate(dd.getDate() + AddDayCount); 
  var y = dd.getFullYear();
  //获取当前月份的日期，不足10补0
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); 
  //获取当前几号，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); 
  return y + "-" + m + "-" + d;
}

function calculatePercentage(diff) {
  var percentage = Number(diff / 30 * 100).toFixed(1)
  if (percentage >= 100) {
    percentage = 0
  } else if (percentage < 100 && percentage > 0) {
    percentage = 100 - percentage
  } else {
    percentage = 100
  }
  return percentage
}
// 默认作业的倒计时时间
var d1 = GetDateStr(3)
var d2 = GetDateStr(29)
// 默认作业
const DEFAULT_ASSIGNMENTS = [
  {
    'color': '#7986CB',
    'name': "CSSE1001 A1 (示例)",
    "date": d1,
    "time": "00:00",
    "default": true
  },
  {
    'color': '#7986CB',
    'name': "点我查看更多",
    "date": d2,
    "time": "00:00",
    "default": true
  }
]
async function fetchAll(openid, collectionName) {
  var result = await db.collection(collectionName).where({
    _openid: openid
  }).get()
  var temp = result.data[0].userAssignments
  var notification = result.data[0].notification
  var fetchRes = {}
  if (temp.length > 0) {
    var userAssignments = temp;
    // var diffs = [];
    if (notification.location == "AU") {
      // 转化为澳洲时间计算
      now += 2 * 60 * 60 * 1000;
    }
    for (var i = 0; i < userAssignments.length; i++) {
      // 如果用户作业中存在默认作业, 更新其数值为固定数值
      if (userAssignments[i]["default"] == true) {
        if (userAssignments[i]["name"] == "CSSE1001 A1 (示例)") {
          userAssignments[i]["date"] = d1;
        } else {
          userAssignments[i]["date"] = d2;
        }
      }
      // 如果用户作业中存在时间不确定的，默认为999
      if (userAssignments[i]["date"] == "TBD") {
        var date = "999";
        var diff = 999;
      } else {
        var date = userAssignments[i]["date"]
        var time = userAssignments[i]["time"]
        var string = date + "T" + time + ":00"
        var d = new Date(string).getTime()
        now = new Date().getTime();
        var diff = Math.ceil((d - now) / (1000 * 3600 * 24))
      }
      // 计算style中的进度条百分比
      var percentage = calculatePercentage(diff)
      userAssignments[i]["countdown"] = diff
      userAssignments[i]["id"] = i
      userAssignments[i]["percentage"] = percentage
      userAssignments[i]["diff"] = diff
      userAssignments[i]["isTouchMove"] = false
    }
    userAssignments = userAssignments.sort(function (a, b) {
      return a['diff'] - b['diff']
    });
    fetchRes["assignments"] = userAssignments
    fetchRes["headerAssignments"] = userAssignments[0]
    return fetchRes
  }
}

async function setNotification(openid, collectionName, notification) {
  db.collection(collectionName)
  .where({
    _openid: openid
  })
  .update({
    data: {
      notification: notification
    }
  })
  .then(res => {
    console.log(res)
    return res
  })
}

async function appendUserAssignments(openid, collectionName, ass) {
  db.collection(collectionName)
  .where({
    _openid: openid
  })
  .update({
    data: {
      userAssignments: _.push({
        ass
      })
    }
  })
  .then(res => {
    console.log(res)
    return res
  })
}

async function updateUserAssignments(openid, collectionName, asses) {
  db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        userAssignments: asses
      }
    })
    .then(res => {
      console.log(res)
      return res;
    })
}



// 云函数入口函数
exports.main = async (event, context) => {
  var branch = event.branch;
  var method = event.method;
  var openid = event.openid;
  if (branch == undefined) {
    return {
      code: -1,
      msg: "缺少branch"
    }
  }
  if (method == undefined) {
    return {
      code: -1,
      msg: "缺少method"
    }
  }
  if (openid == undefined) {
    return {
      code: -1,
      msg: "缺少openid"
    }
  }
  var collectionName = branch + MAIN_USER_SUFFIX
  if (method == "fetchAll") {
    return await fetchAll(openid, collectionName)
  } else if (method == "setNotification") {
    var notification = event.notification
    if (notification == undefined) {
      return {
        code: -1,
        msg: "缺少notification"
      }
    }
    return await setNotification(openid, collectionName, notification)
  } else if (method == "appendUserAssignments") {
    var ass = event.ass
    if (ass == undefined) {
      return {
        code: -1,
        msg: "缺少ass"
      }
    }
  } else if (method == "updateAssignments") {

  }
}