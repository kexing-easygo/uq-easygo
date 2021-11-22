// import moment from 'moment'
// 云函数入口文件
var moment = require('moment-timezone');
const cloud = require('wx-server-sdk')
const MAIN_USER_SUFFIX = "_MainUser"
const TIMETABLE_USER_SUFFIX = "_Timetable"
const CURRENT_YEAR = 2021

cloud.init()


const db = cloud.database();
const _ = db.command
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
/**
 * 私有方法
 * 根据class的id，在数据库中搜索到对应的单节课信息。
 * 类似MySQL的外键
 */
async function __fetchClassById(collectionName, cid) {
  var course_code = cid.split("-")[0]
  var res = await fetchCourseInfo(course_code, collectionName)
  var info = res.data[0]
  const prefix = cid.split("|")[0]
  return info[prefix][cid]
}
/**
 * 私有方法
 * 根据学期返回用户文档中的某一学期所有classes
 */
async function __fetchCourseIdBySemester(openid, branch, semester) {
  var res = await getSelectedCourses(openid, branch + MAIN_USER_SUFFIX)
  if (!res.hasOwnProperty(semester)) {
    return []
  }
  var res1 = res[semester]
  var finalRes = []
  for (var i = 0; i < res1.length; i++) {
    var courseInfo = res1[i]
    var classes = courseInfo["classes"]
    // return classes
    for (var j = 0; j < classes.length; j++) {  
      var cid = classes[j]      
      finalRes.push(cid)
    }
  }
  return finalRes
}


/**
 * 根据课程代码，返回某一门课的所有信息
 * 包括所有单节课等
 */
async function fetchCourseInfo(courseName, collectionName, courseId) {
  var res =  await db.collection(collectionName).where({
    name: courseName
  }).get()
  res = res.result
  if (res.hasOwnProperty(courseId)) {
    return res[courseId]
  }
  return []
}


/**
 * 将对应的课程信息添加到用户的文档中
 */
async function appendUserClasses(event) {
  var res = await getSelectedCourses(event.openid, event.branch + MAIN_USER_SUFFIX)
  const semester = event.semester
  const courseCode = event.courseCode
  var semesterInfo = res[semester]
  for (var i = 0; i < semesterInfo.length; i++) {
    var info = semesterInfo[i]
    var code = info["code"]
    if (code == courseCode) {
      // 去重，不添加过多冗余数据
      info["classes"] = Array.from(new Set(info["classes"].concat(event.classes)))
    }
  }
  res[semester] = semesterInfo
  var appendRes = await db.collection(event.branch + MAIN_USER_SUFFIX)
  .where({
    _openid: event.openid
  })
  .update({
    data: {
      selectedCourses: res
    }
  })
  return appendRes
}



async function fetchUserClasses(openid, branch, semester) {
  const classIDs = await __fetchCourseIdBySemester(openid, branch, semester)
  var res = []
  const timetableCollection = branch + TIMETABLE_USER_SUFFIX
  for (var i = 0; i < classIDs.length; i++) {
    var cid = classIDs[i]
    res.push(await __fetchClassById(timetableCollection, cid))
  }
  return res
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


async function fetchToday(openid, branch) {
  const allCourses = await fetchUserClasses(openid, branch, "Semester 2, 2021")  // 获取所有的课程
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
  var data = result.data[0]
  return data.selectedCourses

}

/**
 * 用户在某个学期选择某门课的时间后，将该门课添加至用户的
 * selectedCourses字段内
 */
async function addSelectedCourses(openid, collectionName, course, semester) {
  var selectedCourses = await getSelectedCourses(openid, collectionName)
  if (!selectedCourses.hasOwnProperty(semester)) {
    // 如果本学期不存在，推送新的学期和课程进去
    selectedCourses[semester] = [
      {
        code: course,
        results: [],
        classes: []
      }
    ]
  } else {
    // 存在这个学期
    var semesterInfo = selectedCourses[semester]
    for (var i = 0; i < semesterInfo.length; i++) {
      var item = semesterInfo[i]
      if (item["code"] == course) {
        return
      }
    }
    // 但不存在这门课的时候
    semesterInfo.push({
      code: course,
      results: [],
      classes: []
    })
  }
  var result = await db.collection(collectionName)
  .where({
    _openid: openid
  })
  .update({
    data: {
      selectedCourses: selectedCourses
    }
  })
  return result
}


async function deleteSelectedCourse(openid, collectionName, course, semester) {
  var selectedCourses = await getSelectedCourses(openid, collectionName)
  // 如果用户确实在该学期有课 / 选择过课程
  if (selectedCourses.hasOwnProperty(semester)) {
    var courses = selectedCourses[semester]
    for (var i = 0; i < courses.length; i++) {
      var singleClass = courses[i]
      if (singleClass.code == course) {
        // 删除该课程
        courses.splice(i, 1)
        break
      }
    }
    var result = await db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        selectedCourses: selectedCourses
      }
    })
    return result
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  var branch = event.branch
  var method = event.method
  if (branch == undefined || method == undefined) {
    return {
      data: "缺少必须的元素"
    }
  }
  var openid = event.openid;
  var semester = event.semester == undefined? "" : event.semester
  if (method == "fetchCourseInfo") {
    return await fetchCourseInfo(event.courseName, branch + TIMETABLE_USER_SUFFIX, event.courseId)
  }
  
  var collectionName = branch + MAIN_USER_SUFFIX
  if (method == "appendUserClasses") {
    return await appendUserClasses(event)
  }
  if (method == "fetchToday") {
    return await fetchToday(openid, branch)
  }

  if (method == "fetchUserClasses") {
    return await fetchUserClasses(openid, branch, semester)
  }
  if (method == "updateUserClass") {
    var courseTime = event.courseTime
    return await updateUserClasses(openid, collectionName, courseTime)
  }
  
  if (method == "getSelectedCourses") {
    return await getSelectedCourses(openid, collectionName)
  }
  if (method == "addSelectedCourses") {
    var course = event.course
    var semester = event.semester
    return await addSelectedCourses(openid, collectionName, course, semester)
  }
  if (method == "deleteSelectedCourse") {
    var course = event.course
    var semester = event.semester
    return await deleteSelectedCourse(openid, collectionName, course, semester)
  }
  
}