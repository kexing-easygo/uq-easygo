// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')
const MAIN_USER_SUFFIX = "_MainUser"


cloud.init()

const db = cloud.database();
const _ = db.command

const generateAid = (assignment) => crypto.createHash('sha256').update(assignment.name + assignment.date + assignment.time).copy().digest('hex')



async function fetchAll(openid, collectionName) {
  // result 是一个用户的文档数据，包含所有字段
  const result = await db.collection(collectionName).where({
    _openid: openid
  }).get()
  const userData = result.data[0]
  let temp = userData.userAssignments
  if (temp.length == 0) return []
  return temp
}

/**
 * 返回用户的提醒设置
 * @param {string} openid openid
 * @param {string} collectionName 数据库名称
 */
const getNotification = async (openid, collectionName) => {
  const res = await db.collection(collectionName)
    .where({
      _openid: openid
    }).get()
  const userData = res.data[0]
  return userData.notification
}

/**
 * 
 * @param {string} openid openid
 * @param {string} collectionName 数据库名称
 * @param {object} notification 前端发送来的被更新过的提醒对象
 * notification字段示例如下：
 * {email: {attributes: [0, 0, 1], enabled: true}, wechat: {attributes: [0, 0, 1], enabled: true}}
 */
const setNotification = async (openid, collectionName, notification) => {
  const res = await db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        notification: notification
      }
    })
  // const assignments = await fetchAll(openid, collectionName)
  // const emailAttributes = notification.email.attributes
  // const wechatAttributes = notification.wechat.attributes
  // assignments.map((ass) => {
  //   if (!ass.default) {
  //     let attributes = ass.attributes
  //     attributes["email"] = emailAttributes
  //     attributes["wechat"] = wechatAttributes
  //   }
  // })
  // await db.collection(collectionName)
  //   .where({
  //     _openid: openid
  //   })
  //   .update({
  //     data: {
  //       userAssignments: assignments
  //     }
  //   })
  return res
}

/**
 * 向用户数据库中添加一条新的作业
 * @param {string} openid openid
 * @param {string} collectionName 集合名称
 * @param {object} assignment 被添加的新作业
 */
const appendAssignments = async (openid, collectionName, assignment) => {
  const currentAssignments = await fetchAll(openid, collectionName)
  const newAssignment = {
    ...assignment,
    attributes: {
      wechat: [0, 0, 0],
      email: [0, 0, 0]
    },
    aid: generateAid(assignment)
  }
  currentAssignments.push(newAssignment)
  await db.collection(collectionName).where({
    _openid: openid
  }).update({
    data: {
      userAssignments: currentAssignments
    }
  })
  return currentAssignments
}

/**
 * 更新某个名称对应的作业信息
 * @param {string} openid openid
 * @param {string} collectionName 集合名称
 * @param {object} updatedAss 待更新的作业
 */
const updateAssignments = async (openid, collectionName, updatedAss) => {
  const currentAssignments = await fetchAll(openid, collectionName)
  const index = currentAssignments.findIndex(ass => ass.aid === updatedAss.aid)
  currentAssignments[index] = updatedAss
  await db.collection(collectionName).where({
    _openid: openid
  }).update({
    data: {
      userAssignments: currentAssignments
    }
  })
  return currentAssignments
}

async function deleteUserAssignments(openid, collectionName, deletedId) {
  const currentAssignments = await fetchAll(openid, collectionName)
  const afterDeleted = currentAssignments.filter(ass => ass.aid != deletedId)
  console.log(afterDeleted)
  await db.collection(collectionName).where({
    _openid: openid
  }).update({
    data: {
      userAssignments: afterDeleted
    }
  })
  return afterDeleted
}




/**
 * 批量添加作业信息
 * @param {string} openid openid
 * @param {string} collectionName 集合名称
 * @param {[object, ...]} assignments 自动添加的作业
 */
const autoAppendAssignments = async (openid, collectionName, assignments) => {
  const currentAssignments = await fetchAll(openid, collectionName)
  const newAssignments = assignments.map((ass) => {
    return {
      ...ass,
      aid: generateAid(ass),
      attributes: {
        email: [0, 0, 0],
        wechat: [0, 0, 0]
      }
    }
  })
  const res = await db.collection(collectionName)
    .where({
      _openid: openid
    })
    .update({
      data: {
        userAssignments: [...currentAssignments, ...newAssignments]
      }
    })
  return res
}


// 云函数入口函数
exports.main = async (event, context) => {
  const {
    branch,
    method,
    openid
  } = event
  if (branch == undefined || method == undefined || openid == undefined) return {
    code: -1,
    msg: "缺少必要参数"
  }
  const collectionName = branch + MAIN_USER_SUFFIX
  if (method == "fetchUserAssignments") {
    const res = await fetchAll(openid, collectionName)
    if (res.length === 0) return {
      "headerItem": {},
      "assignments": []
    }
    const fetchRes = {
      "headerItem": res[0],
      "assignments": res
    }
    return fetchRes
  }
  if (method == "getNotification") return await getNotification(openid, collectionName)
  if (method == "setNotification") {
    const {
      notification
    } = event
    return await setNotification(openid, collectionName, notification)
  }
  if (method == "appendAssignments") {
    const {
      assignment
    } = event
    return await appendAssignments(openid, collectionName, assignment)
  }
  if (method == "deleteUserAssignments") {
    const {
      deletedId
    } = event
    return await deleteUserAssignments(openid, collectionName, deletedId)
  }
  if (method == "updateAssignments") {
    const {
      assignment
    } = event
    return await updateAssignments(openid, collectionName, assignment)
  }
  if (method == "autoAppendAssignments") {
    const {
      assignments
    } = event
    return await autoAppendAssignments(openid, collectionName, assignments)
  }
}