// 云函数入口文件
const cloud = require('wx-server-sdk')
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({
    env: cloudbase.SYMBOL_CURRENT_ENV
});
const db = app.database();

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// date1 是now， date2是dueDate
function dateDiff(date1, date2) {
    // 转化为澳洲时间计算
    var timeStamp = date1.getTime() + 2 * 60 * 60 * 1000
    var date1 = new Date(timeStamp)
    var new1 = new Date(date1.getFullYear().toString() + "/" + (date1.getMonth() + 1).toString() + "/" + date1.getDate().toString()).getTime()
    var new2 = new Date(date2.getFullYear().toString() + "/" + (date2.getMonth() + 1).toString() + "/" + date2.getDate().toString()).getTime()
    var diff = parseInt((new2 - new1) / (1000 * 60 * 60 * 24))
    return diff
}
async function getAllData() {
    const MAX_LIMIT = 100
    const dataCount = await db.collection("MainUser").count()
    const total = dataCount.total
    const fetchTimes = Math.ceil(total / MAX_LIMIT)
    const tasks = []
    for (let i = 0; i < fetchTimes; i++) {
        const promise = db.collection("MainUser").skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
    }
    // 等待所有数据取出后返回所有数据
    var response = (await Promise.all(tasks)).reduce((acc, cur) => ({
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
    }))
    var data = response.data
    const now = new Date()
    // 第一次循环，获取所有用户信息
    for (let i = 0; i < data.length; i++) {
        const userAssignments = data[i].userAssignments
        const email = data[i].userEmail
        const emailNotification = data[i].emailNotification
        const openid = data[i]._openid
        // 第二次循环，获取每个用户的所有作业
        for (let j = 0; j < userAssignments.length; j++) {
            const ass = userAssignments[j]
            const dueDate = new Date(ass.date)
            const name = ass.name
            const notifications = ass.notification
            // 忽视due的时间，只计算日期
            var dayDiff = dateDiff(now, dueDate)
            // 检查是否相差正数天
            if (dayDiff >= 0 && emailNotification == true && email != "") {
                if (dayDiff <= 1 && notifications["24"] == 1) {
                    const content = "您的" + name + "将于" + "24小时之后due。"
                    const res = await cloud.callFunction({
                        // 要调用的云函数名称
                        name: 'sendEmail',
                        // 传递给云函数的参数
                        data: {
                            "toAddr": email,
                            "subject": "UQ校园通",
                            "content": content
                        }
                    }).then(res => {

                    })
                    // 设置已经提醒过，提醒过不再二次提醒
                    db.collection('MainUser')
                        .where({
                            "_openid": openid,
                            "userAssignments.name": name
                        })
                        .update({
                            // 将提醒设置为false
                            "userAssignments.$.notification.24": false
                        })
                        .then(res => {
                            console.log(res.data)
                        })
                }
                if (dayDiff <= 2 && notifications["48"] == 1) {
                    const content = "您的" + name + "将于" + "48小时之后due。"
                    const res = await cloud.callFunction({
                        // 要调用的云函数名称
                        name: 'sendEmail',
                        // 传递给云函数的参数
                        data: {
                            "toAddr": email,
                            "subject": "UQ校园通",
                            "content": content
                        }
                    }).then(res => {

                    })
                    // 设置已经提醒过，提醒过不再二次提醒
                    db.collection('MainUser')
                        .where({
                            "_openid": openid,
                            "userAssignments.name": name
                        })
                        .update({
                            // 将提醒设置为false
                            "userAssignments.$.notification.48": false
                        })
                        .then(res => {
                            console.log(res.data)
                        })
                }
                if (dayDiff <= 3 && notifications["72"] == 1) {
                    const content = "您的" + name + "将于" + "72小时之后due。"
                    const res = await cloud.callFunction({
                        // 要调用的云函数名称
                        name: 'sendEmail',
                        // 传递给云函数的参数
                        data: {
                            "toAddr": email,
                            "subject": "UQ校园通",
                            "content": content
                        }
                    }).then(res => {

                    })
                    // 设置已经提醒过，提醒过不再二次提醒
                    db.collection('MainUser')
                        .where({
                            "_openid": openid,
                            "userAssignments.name": name
                        })
                        .update({
                            // 将提醒设置为false
                            "userAssignments.$.notification.72": false
                        })
                        .then(res => {
                            console.log(res.data)
                        })
                }
            }
        }
    }
}
// 云函数入口函数
exports.main = async (event, context) => {
    getAllData()
}