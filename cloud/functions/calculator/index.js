// 云函数入口文件
const cloud = require('wx-server-sdk')
const CALCULATOR_SUFFIX = "_Courses"
const MAIN_USER_SUFFIX = "_MainUser"

cloud.init()
const db = cloud.database();
const _ = db.command

async function fetchAssessments(course, semester, collectionName) {
  const result = await db.collection(collectionName).where({
    _id: course
  }).get()
  const data = result.data
  if (data.length == 0) {
    return []
  }
  const data = data[0]
  if (data.academic_detail.semester_available != semester) {
    return []
  } else {
    return data.assessments
  }
}

async function fetchCalculatedResult(event) {
  const selectedCourses = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'timetable',
    // 传递给云函数的参数
    data: {
      "branch": event.branch,
      "method": "getSelectedCourses",
      "openid": event.openid,
    }
  })
  const {course, semester} = event
  const semesterInfo = selectedCourses[semester]
  for (let i = 0; i < semesterInfo.length; i++) {
    const courseInfo = semesterInfo[i]
    if (courseInfo["courseCode"] == course) {
      return courseInfo["results"]
    }
  }
  return []
}

async function setCalculatedResult(event) {
  const {openid, branch} = event
  const selectedCourses = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'timetable',
    // 传递给云函数的参数
    data: {
      "branch": branch,
      "method": "getSelectedCourses",
      "openid": openid,
    }
  })
  const {course, semester, info} = event
  const semesterInfo = selectedCourses[semester]
  for (let i = 0; i < semesterInfo.length; i++) {
    const courseInfo = semesterInfo[i]
    if (courseInfo["courseCode"] == course) {
      courseInfo["results"] = info
    }
  }
  const collectionName = event.branch + MAIN_USER_SUFFIX
  let finalRes = await db.collection(collectionName)
  .where({_openid: openid})
  .update({
    data: {
      selectedCourses: selectedCourses
    }
  })
  return finalRes
}

// 云函数入口函数
exports.main = async (event, context) => {
  const {branch, method, course, semester} = event
  if (branch == undefined 
    || method == undefined
    || course == undefined
    || semester == undefined) {
    return {}
  }
  if (method == 'fetchAssessments') {
    const collectionName = branch + CALCULATOR_SUFFIX
    return await fetchAssessments(course, semester, collectionName)
  }
  if (method == "fetchCalculatedResult") {
    return await fetchCalculatedResult(event)
  }
  if (method == "setCalculatedResult") {
    return await setCalculatedResult(event)
  }
}