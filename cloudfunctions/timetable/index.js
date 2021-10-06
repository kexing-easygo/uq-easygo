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
  try {
    return await db.collection(collectionName)
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
  } catch (e) {
    return {"code": -1, "msg": OPENID}
  }
}

async function fetchUserClasses(collectionName) {
  try {
    var result = await db.collection(collectionName).where({
      _openid: OPENID
    }).get()
    return result.data[0].courseTime;
  } catch (e) {
    console.error(e);
  }
}

async function updateUserClasses(collectionName, courseTime) {
  try {
    await db.collection(collectionName)
    .where({
      _openid: "oBF0v4_6S3T66uyzKN78doVFHi6Q"
    })
    .update({
      data: {
        courseTime: courseTime
      }
    })
    .then(res => {
      return res;
    })
  } catch (e) {
    return e
  }
}


// week: week1, week2, week3, week4
async function fetchUserClassesByWeek(collectionName, week) {
  var _openid = "oBF0v4_6S3T66uyzKN78doVFHi6Q"
  var result = await fetchUserClasses("USYD_MainUser");
  var courseTime = result.data[0].courseTime
//   console.log(result.data[0].courseTime)
  var temp = []
  var i;
  console.log(courseTime.length)
  for (i = 0; i < courseTime.length; i++) {
    console.log(courseTime[i])
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  var branch = event.branch
  var method = event.method
  if (branch == undefined 
    || method == undefined) {
    return {
      code: "-1",
      msg: "缺少branch或者method"
    }
  }
  if (method == "fetchCourseInfo") {
    var courseName = event.courseName
    var collectionName = branch + TIMETABLE_USER_SUFFIX
    return await fetchCourseInfo(courseName, collectionName)
  }
  if (method == "appendUserClasses") {
    var openid = event._openid
    var collectionName = branch + MAIN_USER_SUFFIX
    var courseTime = event.courseTime
    return await appendUserClasses(openid, courseTime, collectionName)
  }

  if (method == "fetchUserClasses") {
    var collectionName = branch + MAIN_USER_SUFFIX
    return await fetchUserClasses(collectionName)
  }
  if (method == "fetchByWeek") {
    var collectionName = branch + TIMETABLE_USER_SUFFIX
    await fetchUserClassesByWeek(collectionName, "week1");
  }
}