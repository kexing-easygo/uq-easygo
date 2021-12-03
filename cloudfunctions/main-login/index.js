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
  const res = await db.collection(collectionName)
  .add({
    data : {
      _openid: openid,
      nickName: userInfo.nickName,
      userAssignments: [],
      userInfo: userInfo,
      userEmail: "",
      notification: {
        wechat: {
          enabled: false,
          attributes: [
            0,
            0,
            0
          ]
        },
        email: {
          enabled: false,
          attributes: [
            0,
            0,
            0
          ]
        }
      },
      selectedCourses: {},
      classMode: ""
    }
  })
  return res
  
}

async function loginStatus(openid, collectionName) {
  var i =  await db.collection(collectionName).where({
    _openid: openid
  })
  .get()
  return i.data.length == 0? false : true
}

async function getUserInfo(openid, collectionName) {
  const result = await db.collection(collectionName).where({
    _openid: openid
  }).get()
  const res = result.data[0]
  return {
    ...res.userInfo,
    ...res.userEmail,
    ...res.userMobile
  }
}


async function updateClassMode(openid, collectionName, mode) {
  var res = await db.collection(collectionName)
  .where({
    _openid: openid
  })
  .update({
    data: {
      classMode: mode
    }
  })
  return res
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
  if (method == "updateClassMode") {
    var mode = event.classMode
    return await updateClassMode(openid, collectionName, mode)
  }
}
