// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment-timezone')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const currentSemester = "Semester 1, 2022"
const UMEL_APP_ID = "wxb3dbe1326db6d6d2"
const UMEL_TEMPLATE_ID = 'WFnXIRQ05rLdFEB3GEEsbA85ylAh1NiRtKvuKJTwADg'

const getTodayDate = (branch) => {
  switch (branch) {
      case "UQ":
          return moment().tz("Australia/Brisbane")
      case "USYD":
          return moment().tz("Australia/Sydney")
      case "UMEL":
          return moment().tz("Australia/Melbourne")
      default:
          return moment().tz("Asia/Shanghai")
  }
}

const reformatTodayDate = (todayDate) => {
  const s = todayDate.format("YYYY-MM-DD HH:mm:ss")
  return moment(s)
}

const notify = async(data) => {
  const currentSemesterCourses = data[currentSemester]
  const todayDate = reformatTodayDate(getTodayDate("UMEL"))
  const todayDateFormatted = todayDate.format("YYYY-MM-DD")
  await Promise.all(currentSemesterCourses.map(async(courseInfo) => {
      const {classes} = courseInfo
      await Promise.all(classes.map(async(singleClassInfo) => {
          const { activitiesDays, start_time, _id } = singleClassInfo
          // 先判断当天是否有本门课程
          if (activitiesDays.includes(todayDate.format("DD/M/YYYY"))) {
              // 获取当前时间戳
              const singleClassStartTime = moment(`${todayDateFormatted} ${start_time}`)
              const diff = singleClassStartTime.diff(todayDate, "minutes")
              if (diff > 0 && diff <= 60) {
                  // 提醒
                  const content = `您的${_id}课程将在${start_time}开始，请做好上课准备。`
                  await cloud.callFunction({
                    // 要调用的云函数名称
                    name: 'email',
                    // 传递给云函数的参数
                    data: {
                      subject: "上课提醒",
                      toAddr: "913248383@qq.com",
                      content: content
                    }
                  })
              }
          }
      }))
  }))
}

const testNotify = async(openid, param) => {
  const {
    content,
    assName,
    dueDate,
    publisher
} = param
  const res = await cloud.openapi({
    appid: UMEL_APP_ID
  }).subscribeMessage.send({
      touser: openid,
      lang: 'zh_CN',
      data: {
          thing1: {
              value: content
          },
          thing2: {
              value: assName
          },
          time3: {
              value: dueDate
          },
          thing4: {
              value: publisher
          }
      },
      templateId: UMEL_TEMPLATE_ID,
      miniprogramState: 'developer'
  })
  // console.log(res)
  return res
}



// 云函数入口函数
exports.main = async (event, context) => {
  const item = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'timetable',
    // 传递给云函数的参数
    data: {
      "branch": "UMEL",
      "method": "getSelectedCourses",
      "openid": "o-B6w5eKnRniFdjywNhRy7XksQpw",
    }
  })
  const res = item["result"]
  await notify(res)
  // const param = {
  //   content: "测试长期订阅",
  //   assName: "测试1",
  //   dueDate: "2022-06-29 12:00",
  //   publisher: "课行校园通"
  // }
  // return await testNotify("o-B6w5eKnRniFdjywNhRy7XksQpw", param)
}