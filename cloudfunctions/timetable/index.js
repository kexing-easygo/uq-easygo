// 云函数入口文件
const cloud = require('wx-server-sdk')
const MAIN_USER_SUFFIX = "_MainUser"
const TIMETABLE_USER_SUFFIX = "_Timetable"
cloud.init()


const db = cloud.database();
const _ = db.command
const wxContext = cloud.getWXContext()
const OPENID =  wxContext.FROM_OPENID;



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


// week: week1, week2, week3, week4
async function fetchUserClassesByWeek(openid, collectionName, weekData) {
  var allClasses = await fetchUserClasses(openid, collectionName);
  var result = {}
  if (allClasses.length > 0) {
    // var courseTime = allClasses[0].courseTime
    for (var i = 0; i < weekData.length; i++) {
      var temp = []
      var weekday = weekData[i]
      for (var j = 0; j < allClasses.length; j++) {
        var item = allClasses[j]
        var activitiesDays = item["activitiesDays"]
        // 直接判断weekday在不在里面
        if (activitiesDays.indexOf(weekday) != -1) {
          // 存在，则推入
          temp.push(item)
        }
      }
      result[weekday] = temp
    }
    return result
  }
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
  // if (openid == undefined) {
  //   return {
  //     code: -1,
  //     msg: "缺少openid"
  //   }
  // }
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
  if (method == "fetchByWeek") {
    var collectionName = branch + MAIN_USER_SUFFIX
    var weekData = event.weekData;
    if (weekData == undefined) {
      return {
        code: -1,
        msg: "缺少weekData"
      }
    }
    return await fetchUserClassesByWeek(openid, collectionName, weekData);
  }
  if (method == "updateUserClasses") {
    var collectionName = branch + MAIN_USER_SUFFIX
    var courseTime = event.courseTime
    return await updateUserClasses(openid, collectionName, courseTime)
  }
}