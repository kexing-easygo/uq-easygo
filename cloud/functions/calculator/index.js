// 云函数入口文件
const cloud = require('wx-server-sdk')
const CALCULATOR_SUFFIX = "_Courses"
const MAIN_USER_SUFFIX = "_MainUser"
const FAIL = 3
const PASS = 4
const CREDIT = 5
const DISTINCTION = 6
const HIGH_DISTINCTION = 7



cloud.init()
const db = cloud.database();
const _ = db.command

async function fetchAssessments(course, semester, collectionName) {
  const result = await db.collection(collectionName).where({
    _id: course
  }).get()
  if (result.data.length == 0) return [];
  const data = result.data[0];
  const semestersAvailable = data.academic_detail.semester_available
  if (semestersAvailable.includes(semester)) return data.assessments
  return []
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

const determineLevel = (res, branch) => {
  switch (branch) {
      case "UQ":
          if (res < 50) return 3
          else if (res < 65) return 4
          else if (res < 75) return 5
          else if (res < 75) return 6
          return 7
      default:
          return res
  }
}

/**
 * 计算当前学期用户的GPA
 * @param {string} openid openid
 * @param {string} branch 院校分支
 * @param {string} semester 学期，一般为当前学期
 */
const getCumulativeGPA = async(openid, branch, semester) => {
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
  const semesterCourses = selectedCourses[semester]
  if (semesterCourses === undefined || semesterCourses === []) return 0
  let semesterGPA = 0
  let totalUnits = 0.0
  await Promise.all(semesterCourses.map(async(courseInfo) => {
      // 单节课GPA
      let singleCourseRes = 0
      const { courseCode, results } = courseInfo
      results.map((result) => {
          let weight = result.weight.replace("%, ")
          weight = parseFloat(result.weight)
          let percent = result.percent
          let singleItemScore = percent / 100 * weight
          singleCourseRes += singleItemScore
      })
      const res = await db.collection(branch + "_Courses").where({
        _id: courseCode
      }).get()
      let units = 12.5
      if (res.data.length > 0) units = parseFloat(res.data[0].academic_detail.credits)
      totalUnits += units
      const courseGPA = determineLevel(singleCourseRes, branch)
      semesterGPA += courseGPA * units
  }))
  const totalGPA = (semesterGPA / totalUnits).toFixed(2)
  return totalGPA
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { branch, method } = event
  if (branch == undefined
    || method == undefined) {
    return {}
  }
  if (method == 'fetchAssessments') {
    const collectionName = branch + CALCULATOR_SUFFIX
    const { course, semester } = event
    return await fetchAssessments(course, semester, collectionName)
  }
  if (method == "fetchCalculatedResult") {
    return await fetchCalculatedResult(event)
  }
  if (method == "setCalculatedResult") {
    return await setCalculatedResult(event)
  }
  if (method == "getCumulativeGPA") {
    const { openid, semester } = event
    return await getCumulativeGPA(openid, branch, semester)
  }
}