// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: 'oe4Eh5T-KoCMkEFWFa4X5fthaUG8',
        // page: 'index',
        lang: 'zh_CN',
        data: {
          thing10: {
            value: event.作业标题
          },
          date2: {
            value: "2021-02-20"
          },
          date8: {
            value: "2021-02-25"
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