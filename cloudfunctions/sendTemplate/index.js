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
          thing1: {
            value: event.提醒内容
          },
          thing2: {
            value: event.作业名称
          },
          time3: {
            value: event.截至日期
          },
          thing4: {
            value: event.发布人员
          }
        },
        templateId: '3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }

}