// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
    // db.collection('Timetable')
    // .doc('5b00f970606e6b4c06f314cd336be027')
    // .update({
    //   data: {
    //     course: "COMS4104"
    //   },
    //   success: function(res) {
    //     console.log(res.data)
    //   }
    // })
  const countResult = await db.collection('Timetable').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Timetable').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  // 等待所有数据取出后返回所有数据
  var response = (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
  var data = response.data
  for (let i = 0; i < data.length; i++) {
    keys = Object.keys(data[i]);
    for (let j = 0; j < keys.length; j++) {
      var key = keys[j];
      if (key != '_id') {
        // 课程名称
        var course = key.split("_")[0];
        db.collection('Timetable')
        .doc(data[i]._id)
        .update({
          data: {
            course: course
          },
          success: function(res) {
            console.log(res.data)
          }
        })
        break
      }
    }
  }
}
