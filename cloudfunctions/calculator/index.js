// 云函数入口文件
const cloud = require('wx-server-sdk')
const CALCULATOR_SUFFIX = "_Courses"

cloud.init()
const db = cloud.database();
const _ = db.command

async function fetchAssessments(course, semester, collectionName) {
  // try {
  var result = await db.collection(collectionName).where({
    _id: course
  }).get()
  var data = result.data
  if (data.length == 0) {
    return {
      "code": -1,
      "msg": "cannot find course with given unit code", 
      "data": []
    }
  }
  var data = data[0]
  if (data.academic_detail.semester_available != semester) {
    return {
      "code": -2,
      "msg": "this course is not available in this semester", 
      "data": []
    }
  } else {
      return data.assessments
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  var branch = event.branch
  var method = event.method
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
  var collectionName = branch + CALCULATOR_SUFFIX
  if (method == 'fetchAssessments') {
    var course = event.course
    var semester = event.semester
    return await fetchAssessments(course, semester, collectionName)
  }
}