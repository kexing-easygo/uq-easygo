// import moment from 'moment'
// 云函数入口文件
var moment = require('moment-timezone');
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
    return await db.collection(collectionName).where({
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
  const allCourses = await fetchUserClasses(openid, collectionName)  // 获取所有的课程
  const todayCourses = {
    now: [],
    next: []
  };
  const todayDate = moment.tz('Asia/Shanghai');
  const currentTime = todayDate.get('hour')
  const today = `${todayDate.get('date')}/${todayDate.get('month') + 1}/${todayDate.get('year')}`.split('/').map(n => parseInt(n)).join('/');
  if (allCourses == undefined) return [];
  allCourses.map(course => {
    if (course.activitiesDays.includes(today)) {
      const startTime = parseInt(course.start_time.split(":")[0]);
      const endTime = parseInt(course.end_time.split(":")[0]);
      if (currentTime >= startTime && currentTime < endTime) todayCourses["now"].push(course);
      else if (currentTime <= startTime) todayCourses["next"].push(course);
    }
  })
  const compareCourse = (a, b) =>
    a.start_time.split(":")[0] - b.start_time.split(":")[0];
  todayCourses["next"] = todayCourses["next"].sort((a, b) => compareCourse(a, b));
  return todayCourses;
}

async function getSelectedCourses(openid, collectionName) {
  const result = await db.collection(collectionName)
  .where({
    _openid: openid
  })
  .get()
  const data = result.data[0]
  return data.selectedCourses == undefined? [] : data.selectedCourses

}

async function addSelectedCourses(openid, collectionName, course, semester) {
  var selectedCourses = await getSelectedCourses(openid, collectionName)
  if (!selectedCourses.hasOwnProperty(semester)) {
    // 如果本学期不存在，推送新的学期和课程进去
    console.log("1")
    selectedCourses[semester] = [
      {
        code: course,
        results: []
      }
    ]
  } else {
    var semesterInfo = selectedCourses[semester]
    for (var i = 0; i < semesterInfo.length; i++) {
      var item = semesterInfo[i]
      if (item["code"] == course) {
        return
      }
    }
    semesterInfo.push({
      code: course,
      results: []
    })
  }
  // return selectedCourses
  // console.log(selectedCourses)
  db.collection(collectionName)
  .where({
    _openid: openid
  })
  .update({
    data: {
      selectedCourses: selectedCourses
    }
  })
  .then(res => {
    const updated = res.updated
    if (updated == 0) {
      return "更新失败"
    } else {
      return "更新成功"
    }
  })
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
  if (method == "getSelectedCourses") {
    var collectionName = branch + MAIN_USER_SUFFIX
    return await getSelectedCourses(openid, collectionName)
  }
  if (method == "addSelectedCourses") {
    var collectionName = branch + MAIN_USER_SUFFIX
    var course = event.course
    var semester = event.semester
    return await addSelectedCourses(openid, collectionName, course, semester)
  }
}