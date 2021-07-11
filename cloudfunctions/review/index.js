// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('CourseReview').where({
      course_name: _.neq("CSSE1001")
    }).remove()
  } catch(e) {
    console.error(e)
  }
}