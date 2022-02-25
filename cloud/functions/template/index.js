// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

const UQ_TEMPLATE_ID = '3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U'
const USYD_TEMPLATE_ID = 'rfESwtmr4JlaNCNgMuXNbMKS6Tc8pto2w1slBHM_pSQ'
const UMEL_TEMPLATE_ID = 'WFnXIRQ05rLdFEB3GEEsbA85ylAh1NiRtKvuKJTwADg'

const UQ_ADMIN_OPENID = "oe4Eh5T-KoCMkEFWFa4X5fthaUG8"
const UMEL_ADMIN_OPENID = "o-B6w5eKnRniFdjywNhRy7XksQpw"
const USYD_ADMIN_OPENID = ""

const sendTemplate = async (openid, param, branch) => {
  const {
      content,
      assName,
      dueDate,
      publisher
  } = param
  let templateId = UMEL_TEMPLATE_ID
  const res = await cloud.openapi.subscribeMessage.send({
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
      templateId: templateId,
      miniprogramState: 'developer'
  })
  console.log(res)
  return res
  // } catch (err) {
      // return err
  // }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext)
  // 跨账号调用时，由此拿到来源方小程序/公众号 AppID
  console.log(wxContext.FROM_APPID)
  // 跨账号调用时，由此拿到来源方小程序/公众号的用户 OpenID
  console.log(wxContext.FROM_OPENID)
  // return context
  const assignment = {
    name: "测试1",
    date: "2022-02-27",
    time: "00:00"
  }
  const diff = 1
  const wxParam = {
    content: `3天提醒:作业${assignment.name}即将在${diff}天内截止`,
    assName: assignment.name,
    dueDate: assignment.date + " " + assignment.time,
    publisher: "课行校园通"
  }
  return await sendTemplate(UMEL_ADMIN_OPENID, wxParam, "")
}