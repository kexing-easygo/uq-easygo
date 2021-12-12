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

// async function getCumulativeGPA(openid, branch) {
//   const selectedCourses = await cloud.callFunction({
//     // 要调用的云函数名称
//     name: 'timetable',
//     // 传递给云函数的参数
//     data: {
//       "branch": branch,
//       "method": "getSelectedCourses",
//       "openid": openid,
//     }
//   })
//   let GPA = 0
//   let numOfSemesters = Object.keys(selectedCourses).length
//   if (numOfSemesters == 0) return 0
//   Object.keys(selectedCourses).forEach(function (semester) {
//     const semesterInfo = selectedCourses[semester]
//     // 计算单学期的GPA
//     let semesterGPA = 0
//     let totalUnits = 0
//     for (let i = 0; i < semesterInfo.length; i++) {
//       const courseInfo = semesterInfo[i]
//       const calculatorResults = courseInfo["results"]
//       const courseCode = courseInfo["courseCode"]
//       // 计算某门课的GPA
//       semesterGPA += getCourseGPA(calculatorResults)
//       if (branch in ["USYD", "UMEL"]) {
//         // 加权
//         const res = await db.collection(branch + CALCULATOR_SUFFIX)
//         .where({
//           _id: courseCode
//         }).get()
//         const units = parseFloat(res.data[0].academic_detail.credits)
//         semesterGPA = semesterGPA * units
//         totalUnits += units
//       }
//     }
//     GPA += semesterGPA / totalUnits
//   })
//   return GPA / numOfSemesters
// }
// /**
//  * 计算并返回一节course的GPA
//  * @param {*} calculatorResults object
//  */
// function getCourseGPA(calculatorResults) {
//   let courseGPA = 0
//   for (let j = 0; j < calculatorResults.length; j++) {
//     const assessmentInfo = calculatorResults[j]
//     let percent = assessmentInfo["percent"]
//     let weight = parseFloat(assessmentInfo["weight"].replace("%", ""))
//     let score = percent * weight
//     courseGPA += score
//   }
//   if (courseGPA < 50) {
//     return FAIL
//   } else if (courseGPA < 65) {
//     return PASS
//   } else if (courseGPA < 75) {
//     return CREDIT
//   } else if (courseGPA < 85) {
//     return DISTINCTION
//   } 
//   return HIGH_DISTINCTION
// }


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
  if (method == "getCumulativeGPA") {
    const {openid, branch} = event
    return await getCumulativeGPA(openid, branch)
  }
}