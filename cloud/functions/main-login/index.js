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
      userMobile: "",
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
      classMode: "",
      cardsInfo: {
        todayClasses: 1,
        recentAssignments: 1,
        newActivities: 1
      }
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
  var result = await db.collection(collectionName).where({
    _openid: openid
  }).get()
  return result.data[0]
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

async function manageCards(openid, collectionName, cardsInfo) {
  const res = await db.collection(collectionName)
  .where({_openid: openid})
  .update({
    data: {
      cardsInfo: cardsInfo
    }
  })
  return res
}

async function getCardsInfo(openid, collectionName) {
  const res =  await db.collection(collectionName)
  .where({_openid: openid})
  .get()
  return res.data[0].cardsInfo
}

async function updateEmail(openid, collectionName, email) {
  const res = await db.collection(collectionName)
  .where({_openid: openid})
  .update({
    data: {
      userEmail: email
    }
  })
  return res
}

async function updateMobile(openid, collectionName, mobile) {
  const res = await db.collection(collectionName)
  .where({_openid: openid})
  .update({
    data: {
      userMobile: mobile
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
  const {branch, method} = event
  if (branch == undefined || method == undefined) {
    return {}
  }
  // branch: USYD / UMEL
  if (event.method == "getOpenID") {
    const wxContext = cloud.getWXContext()
    return wxContext.FROM_OPENID;
  }
  const collectionName = branch + MAIN_USER_SUFFIX
  const {openid} = event
  if (method == "createUser") {
    const {userInfo} = event
    return await createUser(openid, userInfo, collectionName);
  }
  if (method == "loginStatus") {
    return await loginStatus(openid, collectionName);
  }
  if (method == "getUserInfo") {
    return await getUserInfo(openid, collectionName)
  }
  if (method == "updateClassMode") {
    const { mode } = event
    return await updateClassMode(openid, collectionName, mode)
  }
  if (method == "getCardsInfo") {
    return await getCardsInfo(openid, collectionName)
  }
  if (method == "manageCards") {
    const { cardsInfo } = event
    return await manageCards(openid, collectionName, cardsInfo)
  }
  if (method == "updateEmail") {
    const {email} = event
    return await updateEmail(openid, collectionName, email)
  }
  if (method == "updateMobile") {
    const {mobile} = event
    return await updateMobile(openid, collectionName, mobile)
  }
}
