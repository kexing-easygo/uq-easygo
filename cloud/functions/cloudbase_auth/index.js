const cloud = require('wx-server-sdk')
cloud.init({
  env: "cloudbase-prepaid-8eqh90441a925f"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    errCode: 0,
    errMsg: '',
    auth: JSON.stringify({
      // 自定义安全规则
      "*": {
        "invoke": true
      }
    }),
  }
}