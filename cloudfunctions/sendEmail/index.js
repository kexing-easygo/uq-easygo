/* 发送邮件的云函数，调用时需要指明：
 * 1. 发送给谁
 * 2. 主题和内容
 */

const cloud = require('wx-server-sdk')
const cloudbase = require("@cloudbase/node-sdk");
var nodemailer = require('nodemailer')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const app = cloudbase.init({
    env: cloudbase.SYMBOL_CURRENT_ENV
});
const db = app.database();

// date1 是now， date2是dueDate
function dateDiff(date1, date2) {
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
        // 第二次循环，获取每个用户的所有作业
        for (let j = 0; j < userAssignments.length; j++) {
            const ass = userAssignments[j]
            const dueDate = new Date(ass.date)
            const name = ass.name
            const notifications = ass.notification
            // 忽视due的时间，只计算日期
            var dayDiff = dateDiff(now, dueDate)
            // 检查notification各项数值
            if (email != "") {
                if (notifications["24"] == 1) {
                    const content = "您的" + name + "将于" + "24小时之后due。"
                    sendEmail(email, "作业提醒", content)
                    db.collection('todos')
                        .where({ done: false })
                        .update({
                            // 表示将 done 字段置为 true
                            done: true
                        })
                        .then(res => {
                            console.log(res.data)
                        })
                }
                if (notifications["48"] == 1) {
                    const content = "您的" + name + "将于" + "48小时之后due。"
                    sendEmail(email, "作业提醒", content)
                    db.collection('todos')
                        .where({ done: false })
                        .update({
                            // 表示将 done 字段置为 true
                            done: true
                        })
                        .then(res => {
                            console.log(res.data)
                        })
                }
                if (notifications["72"] == 1) {
                    const content = "您的" + name + "将于" + "72小时之后due。"
                    sendEmail(email, "作业提醒", content)
                    db.collection('todos')
                        .where({ done: false })
                        .update({
                            // 表示将 done 字段置为 true
                            done: true
                        })
                        .then(res => {
                            console.log(res.data)
                        })
                }
            }
        }
    }
}

async function sendEmail(toAddr, subject, content) {
    var config = {
        host: 'smtp.163.com',
        port: 25,
        auth: {
            user: 'uqeasygo@163.com',
            pass: 'KPHYSPDXOUFWENEU'
        }
    }
    var transporter = nodemailer.createTransport(config)
    var mail = {
        from: 'UQ校园通 <uqeasygo@163.com>',
        subject: subject,
        to: toAddr,
        text: content
    }
    transporter.sendMail(mail)
}
// 云函数入口函数
exports.main = async (event, context) => {
    if (event.type == "sendEmail") {
        console.log(event)
        sendEmail(event.toAddr, event.subject, event.content)
    } else {
        getAllData()
    }
}