// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event)
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        lang: 'zh_CN',
        data: {
          thing10: {
            value: event.作业标题
          },
          date2: {
            value: event.时间
          },
          date8: {
            value: event.截止时间
          },
          thing3: {
            value: event.提醒内容
          },
          thing9: {
            value: event.备注
          }
        },
        templateId: 'YWEyy0vIoy9kdb12oU9Nr5YvizOF0Z1b3x7lwdZ8AFI',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }

}