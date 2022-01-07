// 云函数入口文件
var moment = require('moment-timezone');
const cloud = require('wx-server-sdk')
const MAIN_USER_SUFFIX = "_MainUser"

const ONE_DAY_INDEX = 0
const THREE_DAY_INDEX = 1
const ONE_WEEK_INDEX = 2
const MAX_LIMIT = 100

cloud.init()

const db = cloud.database();
const _ = db.command

// var now = new Date().getTime()

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

function formatDate(dateObject, type) {
  // `${todayDate.get('date')}/${todayDate.get('month') + 1}/${todayDate.get('year')}`.split('/').map(n => parseInt(n)).join('/');
  // return `${dateObject.get('year')}-${dateObject.get('month') + 1}-${dateObject.get('date')}`
  if (type == "date") {
    return dateObject.format("YYYY-M-D")
  } else {
    return dateObject.format("HH:mm")
  }
}

async function fetchAll(openid, collectionName) {
  // result 是一个用户的文档数据，包含所有字段
  const result = await db.collection(collectionName).where({
    _openid: openid
  }).get()
  const userData = result.data[0]
  var temp = userData.userAssignments
  var classMode = userData.classMode
  var todayDate = moment.tz('Asia/Shanghai')
  if (classMode == "Internal" || classMode == "internal") {
    todayDate = moment.tz('Australia/Brisbane')
  }
  for (var i = 0; i < temp.length; i++) {
    var assignment = temp[i]
    if (assignment["default"] == true) {
      // 默认作业，更新时间
      if (assignment["name"] == "CSSE1001 A1 (示例)") {
        assignment["date"] = formatDate(todayDate.clone().add(4, "d"), "date")
      } else {
        assignment["date"] = formatDate(todayDate.clone().add(29, "d"), "date")
      }
    } else {
      // 如果用户作业中存在时间不确定的，默认为999
      if (assignment["date"] == "TBD") {
        var date = "999";
        var diff = 999;
      } else {
        // 计算时间差
        var date = assignment["date"]
        var time = assignment["time"]
        var d1 = moment(`${date} ${time}`)
        var diff = d1.diff(todayDate, 'days')
      }
      const percentage = calculatePercentage(diff)
      assignment["countdown"] = diff
      assignment["id"] = i
      assignment["percentage"] = percentage
      assignment["diff"] = diff
    }
  }
  temp = temp.sort(function (a, b) {
    return a['diff'] - b['diff']
  })
  // header为第一个，其他不变
  const fetchRes = {
    "headerItem": temp[0],
    "assignments": temp
  }
  return fetchRes
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

async function appendAssignments(openid, collectionName, ass) {
  ass["attributes"] = {
    email: [0, 0, 0],
    wechat: [0, 0, 0]
  }
  db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        userAssignments: _.push(ass)
      }
    })
    .then(res => {
      console.log(res)
      return res
    })
}

async function updateAssignments(openid, collectionName, asses) {
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

async function deleteUserAssignments(openid, collectionName, ass) {
  db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        userAssignments: _.pull({
          assignment: _.eq(ass)
        })
      }
    })
    .then(res => {
      console.log(res)
      return res;
    })
}
/**
 * 获取某个用户数据库内所有用户的数据
 */
async function __fetchAll(collectionName) {
  const res = await db.collection(collectionName).count()
  const totalDocuments = res.total
  const fetchTimes = Math.ceil(totalDocuments / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < fetchTimes; i++) {
    const promise = db.collection(collectionName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有数据取出后返回所有数据
  var response = (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
  var data = response.data
  return data
}

/**
 * 中间接口，通过该接口调用推送微信消息的云函数
 */
async function __push_notification(values, mode) {

}

const sendVerificationCode = async () => {
  await cloud.callFunction({
    // 要调用的云函数名称
    name: 'sendEmail',
    // 传递给云函数的参数
    data: {
      "toAddr": email,
      "subject": "作业提醒",
      "content": content
    }
  })
}

/**
 * 中间接口，通过该接口调用发邮件的云函数
 */
async function __send_email(email, diff, assName) {
  var content = `您的作业: ${assName} 还有${diff}天就due啦！还不抓紧写？\n\n课行校园通团队`
  await cloud.callFunction({
    // 要调用的云函数名称
    name: 'sendEmail',
    // 传递给云函数的参数
    data: {
      "toAddr": email,
      "subject": "作业提醒",
      "content": content
    }
  })

}

async function push(collectionName) {
  var data = await __fetchAll(collectionName)
  // for (var i = 0; i < data.length; i++) {
  var item = data[0]
  var openid = item._openid
  const mode = item.classMode
  const email = item.userEmail
  var todayDate = moment.tz('Asia/Shanghai')
  if (mode == "Internal" || mode == "internal") {
    todayDate = moment.tz('Australia/Brisbane')
  }
  var assignments = item.userAssignments
  for (var j = 0; j < assignments.length; j++) {
    var assignment = assignments[j]  // 单条作业
    // 默认的示例不提醒
    if (assignment.hasOwnProperty("default")) {
      continue
    }
    var date = assignment["date"]
    var time = assignment["time"]
    var d1 = moment(`${date} ${time}`)
    var diff = d1.diff(todayDate, 'days')
    // 0表示没有提醒过，1表示提醒过
    if (item.notification.wechat.enabled == true) {
      var values = item.notification.wechat.attributes
      var assValues = assignment.attributes.wechat
      if (values[ONE_WEEK_INDEX] == 0 && diff <= 7 && assValues[ONE_WEEK_INDEX] == 0) {
        // send wechat 
        assValues[ONE_WEEK_INDEX] = 1
      }
      if (values[THREE_DAY_INDEX] == 0 && diff <= 3 && assValues[THREE_DAY_INDEX] == 0) {
        // send wechat 
        assValues[THREE_DAY_INDEX] = 1
      }
      if (values[ONE_DAY_INDEX] == 0 && diff <= 1 && assValues[ONE_DAY_INDEX] == 0) {
        // send wechat
        assValues[ONE_DAY_INDEX] = 1
      }

    }
    if (item.notification.email.enabled == true) {
      var values = item.notification.email.attributes
      var assValues = assignment.attributes.email
      if (values[ONE_WEEK_INDEX] == 0 && diff <= 7 && assValues[ONE_WEEK_INDEX] == 0) {
        // send email 
        assValues[ONE_WEEK_INDEX] = 1
      }
      if (values[THREE_DAY_INDEX] == 0 && diff <= 3 && assValues[THREE_DAY_INDEX] == 0) {
        // send email 
        assValues[THREE_DAY_INDEX] = 1
      }
      if (values[ONE_DAY_INDEX] == 0 && diff <= 1 && assValues[ONE_DAY_INDEX] == 0) {
        // send email
        assValues[ONE_DAY_INDEX] = 1
      }
      await __send_email(email, diff, assignment["name"])
    }
  }
  db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        userAssignments: assignments
      }
    })
  // }
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
  if (method == "fetchUserAssignments") {
    return await fetchAll(openid, collectionName)
  }
  if (method == "setNotification") {
    var notification = event.notification
    if (notification == undefined) {
      return {
        code: -1,
        msg: "缺少notification"
      }
    }
    return await setNotification(openid, collectionName, notification)
  }
  if (method == "appendAssignments") {
    var ass = event.assignment
    if (ass == undefined) {
      return {
        code: -1,
        msg: "缺少ass"
      }
    }
    return await appendAssignments(openid, collectionName, ass)
  }
  if (method == "push") {
    return await push("UQ_MainUser")
  }
  if (method == "deleteUserAssignments") {
    var assName = event.assignment
    if (assName == undefined) {
      return {
        code: -1,
        msg: "缺少ass"
      }
    }
    return await deleteUserAssignments(openid, collectionName, assName)
  }
  if (method == "updateAssignments") {
    var allAss = event.newAssignment
    if (allAss == undefined) {
      return {
        code: -1,
        msg: "缺少ass"
      }
    }
    return await updateAssignments(openid, collectionName, allAss)

  }
}