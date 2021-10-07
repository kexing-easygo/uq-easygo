const cloud = require('wx-server-sdk')
const MAIN_USER_SUFFIX = "_MainUser"

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

async function createUser(openid, userInfo, collectionName) {
  
  // try {
  db.collection(collectionName)
  .add({
    data : {
      _openid: openid,
      nickName: userInfo.nickName,
      userAssignments: [],
      userInfo: userInfo,
      userEmail: "",
      notification: {
        emailNotification: false,
        wechatNotification: false,
        oneDay: false,
        threeDay: false,
        oneWeek: false,
        location: "AU"
      },
      courseTime: []
    }
  })
  .then(res => {
    console.log(res)
    return res
  })
  // } catch (e) {
  //   console.error(e)
  //   return e
  // }
  
}

async function loginStatus(openid, collectionName) {
  var i =  await db.collection(collectionName).where({
    _openid: openid
  })
  .get()
  return i.data.length == 0? false : true
}

async function getUserInfo(openid, collectionName) {
  var result = await db.collection(collectionName).where({
    _openid: openid
  }).get()
  return result.data[0]
}

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  var branch = event.branch;
  var method = event.method;
  var openid = event.openid;
  if (branch == undefined) {
    return {
      code: -1,
      msg: "缺少branch"
    }
  }
  if (method == undefined) {
    return {
      code: -1,
      msg: "缺少method"
    }
  }
  if (openid == undefined) {
    return {
      code: -1,
      msg: "缺少openid"
    }
  }
  // branch: USYD / UMEL
  if (event.method == "getOpenID") {
    const wxContext = cloud.getWXContext()
    return wxContext.FROM_OPENID;
  }
  var collectionName = branch + MAIN_USER_SUFFIX
  if (event.method == "createUser") {
    var userInfo = event.userInfo;
    return await createUser(openid, userInfo, collectionName);
  }
  if (event.method == "loginStatus") {
    return await loginStatus(openid, collectionName);
  }
  if (event.method == "getUserInfo") {

    return await getUserInfo(openid, collectionName)
  }
}
