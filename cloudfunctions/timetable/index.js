// import moment from 'moment'
// 云函数入口文件
const moment = require('moment');
const cloud = require('wx-server-sdk')
const MAIN_USER_SUFFIX = "_MainUser"
const TIMETABLE_USER_SUFFIX = "_Timetable"
cloud.init()


const db = cloud.database();
const _ = db.command
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


function timeCompare(h1, m1, h2, m2) {
  return h1 * 60 + m1 > h2 * 60 + m2;
}

async function fetchCourseInfo(courseName, collectionName) {
  try {
    return await db.collection(collectionName).where ({
      name: courseName
    }).get()
  } catch (e) {
    console.error(e)
  }
}

async function appendUserClasses(openid, courseTime, collectionName) {
  db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        courseTime: _.push(
          courseTime
        )
      }
    })
    .then(res => {
      console.log(res)
      return res
    })
  
}

async function fetchUserClasses(openid, collectionName) {
  try {
    var result = await db.collection(collectionName).where({
      _openid: openid
    }).get()
    return result.data[0].courseTime;
  } catch (e) {
    console.error(e);
  }
}

async function updateUserClasses(openid, collectionName, courseTime) {
  db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        courseTime: courseTime
      }
    })
    .then(res => {
      return res;
    })
}
/**
 * 判断某节课是否已经上完
 * 如果上完了，返回true；否则返回false
 */
function hasClassFinished(item) {
  var now = new Date()
  var duration = Number(item.duration)
  // 转化start time，获得时间戳
  var start = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + item.start_time
  // 转中国时间
  var startTimestamp = Date.parse(start) - 120 * 60 * 1000
  // 获取end time时间戳
  var endTimestamp = startTimestamp + duration * 60 * 1000 - 120 * 60 * 1000
  // 判断当前时间戳在不在里面
  var nowTimestamp = now.getTime()
  if (nowTimestamp < endTimestamp) {
    return false
  }
  return true
}


function timeCompare(h1, m1, h2, m2) {
  return h1 * 60 + m1 > h2 * 60 + m2;
}

async function fetchToday(openid, collectionName, date) {
  var classes = await fetchUserClasses(openid, collectionName)
  var result =[]
  // date: 28/10/2021
  var week = new Date().getDay()
  var weekdayOfToday = WEEKDAYS[week];
  for (var i = 0; i < classes.length; i++) {
    var item = classes[i]
    if (item.day_of_week == weekdayOfToday) {
      if (!hasClassFinished(item)) {
        result.push(item)
      }
    }
  }
  // 按照开始时间先后来排序
  result.sort((a, b) => {
    return a.start_time - b.start_time
  })
  // return result
  // console.log(result)
  var new_result = {
    now: [],
    next: [],
    r: []
  }
  for (var i = 0; i < result.length; i++) {
    var item = result[i]
    var now = new Date()
    var start = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + item.start_time
    var end = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + item.end_time
    d1 = moment(start).unix()
    d2 = moment(end).unix()
    var unixNow = moment().unix()
    var new_item = {
      activity_group_code: item["activity_group_code"],
      start_time: start,
      end_time: end,
      a: [d1, unixNow, d2],
      next: unixNow >= d1 && unixNow < d2
    }
    new_result["r"].push(new_item)
    // if (unixNow < d1) {
    //   new_result["next"].push(new_item)
    // } 
    // if (unixNow >= d1 && unixNow < d2) {
    //   new_result["now"].push(new_item)
    // }
    
  }
  return new_result
}


// 云函数入口函数
exports.main = async (event, context) => {
  var branch = event.branch
  var method = event.method
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
  if (method == "fetchCourseInfo") {
    var courseName = event.courseName
    var collectionName = branch + TIMETABLE_USER_SUFFIX
    return await fetchCourseInfo(courseName, collectionName)
  }
  if (method == "appendUserClasses") {
    var collectionName = branch + MAIN_USER_SUFFIX
    var courseTime = event.courseTime
    return await appendUserClasses(openid, courseTime, collectionName)
  }

  if (method == "fetchUserClasses") {
    var collectionName = branch + MAIN_USER_SUFFIX
    return await fetchUserClasses(openid, collectionName)
  }
  if (method == "updateUserClasses") {
    var collectionName = branch + MAIN_USER_SUFFIX
    var courseTime = event.courseTime
    return await updateUserClasses(openid, collectionName, courseTime)
  }
  if (method == "fetchToday") {
    var collectionName = branch + MAIN_USER_SUFFIX
    var date = event.date
    return await fetchToday(openid, collectionName, date)
    // fetchToday(openid, collectionName, date).then(res => {
      // console.log(res)
      // return res
    // })
  }

}