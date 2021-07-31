// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: "uqeasygo1"
});

const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const sum =  await db.collection('MainUser').where ({
    courseTime: {
      classTime: _.exists(true)
    }
  }).count()
  // const sum = await db.collection('MainUser').count()

  return {
    sum: sum,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}