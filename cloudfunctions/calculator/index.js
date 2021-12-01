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
  if (result.data.length == 0) return [];
  const data = result.data[0];
  return data.academic_detail.semester_available == semester ? data.assessments : [];
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
  const { course, semester } = event
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
  const { openid, branch, course, semester, info } = event;
  const selectedCoursesRes = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'timetable',
    // 传递给云函数的参数
    data: {
      "branch": branch,
      "method": "getSelectedCourses",
      "openid": openid,
    }
  })
  const selectedCourses = selectedCoursesRes.result;
  const courseIndex = selectedCourses[semester].findIndex(_course => _course.courseCode === course);
  selectedCourses[semester][courseIndex].results = info;
  let finalRes = await db.collection(branch + MAIN_USER_SUFFIX)
    .where({ _openid: openid })
    .update({ data: { selectedCourses: selectedCourses } })
  return finalRes;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { branch, method, course, semester } = event
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