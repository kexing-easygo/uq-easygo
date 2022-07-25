// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "cloudbase-prepaid-8eqh90441a925f"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}