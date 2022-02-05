// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')
const moment = require('moment-timezone');

cloud.init()

const db = cloud.database();
const _ = db.command

const ONE_DAY_INDEX = 0
const THREE_DAY_INDEX = 1
const ONE_WEEK_INDEX = 2
const MAX_LIMIT = 100

const sendTemplate = async (openid, param) => {
    const {
        content,
        assName,
        dueDate,
        publisher
    } = param
    try {
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
            templateId: '3xHIgiW1ROp8ig_32dTjPqVjNVsY-J4e6dekyW2Wn7U',
            miniprogramState: 'developer'
        })
        return res
    } catch (err) {
        return err
    }
}

const sendEmail = (param) => {
    const {
        subject,
        toAddr,
        content
    } = param
    const config = {
        host: 'smtp.163.com',
        port: 25,
        auth: {
            user: 'uqeasygo@163.com',
            pass: 'KPHYSPDXOUFWENEU'
        }
    }
    const transporter = nodemailer.createTransport(config)
    const mail = {
        from: '课行校园通 <uqeasygo@163.com>',
        subject: subject,
        to: toAddr,
        text: content
    }
    console.log("Sending email to:", toAddr)
    transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

/**
 * 获取某个用户数据库内所有用户的数据
 */
async function __fetchAll(collectionName) {
    const res = await db.collection(collectionName).count()
    const totalDocuments = res.total
    const fetchTimes = Math.ceil(totalDocuments / MAX_LIMIT)
    const tasks = []
    for (let i = 0; i < fetchTimes; i++) {
        const promise = db.collection(collectionName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
    }
    // 等待所有数据取出后返回所有数据
    const response = (await Promise.all(tasks)).reduce((acc, cur) => ({
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
    }))
    const data = response.data
    return data
}

const formatDate = (dateObject, type) => {
    if (type == "date") {
        return dateObject.format("YYYY-M-D")
    } else {
        return dateObject.format("HH:mm")
    }
}


const calcCountdown = (singleCountdown, classMode) => {
    let todayDate = moment.tz('Australia/Brisbane')
    if (classMode == "中国境内") {
        todayDate = moment.tz('Asia/Shanghai')
    }
    if (singleCountdown["default"] == true) {
        // 默认作业，更新时间
        if (singleCountdown["name"] == "CSSE1001 A1 (示例)") {
            singleCountdown["date"] = formatDate(todayDate.clone().add(4, "d"), "date")
        } else {
            singleCountdown["date"] = formatDate(todayDate.clone().add(29, "d"), "date")
        }
    } else {
        let date = "999";
        let diff = 999;
        // 如果用户作业中存在时间不确定的，默认为999
        if (singleCountdown["date"] !== "TBD") {
            // 计算时间差
            date = singleCountdown["date"]
            let time = singleCountdown["time"]
            let d1 = moment(`${date} ${time}`)
            diff = d1.diff(todayDate, 'days')
        }
        singleCountdown["diff"] = diff
    }
}


const push = async (collectionName) => {
    const data = await __fetchAll(collectionName)
    for (let i = 0; i < data.length; i++) {
        let item = data[i]
        const openid = item._openid
        const classMode = item.classMode
        const email = item.userEmail
        const assignments = item.userAssignments
        await Promise.all(assignments.map(async (assignment, val) => {
            if (assignment.hasOwnProperty("default")) {

            }
            calcCountdown(assignment, classMode)
            const diff = assignment.diff
            if (item.notification.wechat.enabled == true) {
                let values = item.notification.wechat.attributes
                let assValues = assignment.attributes.wechat
                let wxParam = {}
                if (values[ONE_WEEK_INDEX] == 1 && diff <= 7 && assValues[ONE_WEEK_INDEX] == 0) {
                    // send wechat 
                    wxParam = {
                        content: `7天提醒:作业${assignment.name}即将在${diff}天内截止`,
                        assName: assignment.name,
                        dueDate: assignment.date + " " + assignment.time,
                        publisher: "课行校园通"
                    }
                    await sendTemplate(openid, wxParam)
                    assValues[ONE_WEEK_INDEX] = 1
                }
                if (values[THREE_DAY_INDEX] == 1 && diff <= 3 && assValues[THREE_DAY_INDEX] == 0) {
                    // send wechat 
                    console.log("sending 1")
                    wxParam = {
                        content: `3天提醒:作业${assignment.name}即将在${diff}天内截止`,
                        assName: assignment.name,
                        dueDate: assignment.date + " " + assignment.time,
                        publisher: "课行校园通"
                    }
                    await sendTemplate(openid, wxParam)
                    assValues[THREE_DAY_INDEX] = 1
                }
                if (values[ONE_DAY_INDEX] == 1 && diff <= 1 && assValues[ONE_DAY_INDEX] == 0) {
                    // send wechat
                    wxParam = {
                        content: `1天提醒:作业${assignment.name}即将在${diff}天内截止`,
                        assName: assignment.name,
                        dueDate: assignment.date + " " + assignment.time,
                        publisher: "课行校园通"
                    }
                    await sendTemplate(openid, wxParam)
                    assValues[ONE_DAY_INDEX] = 1
                }
            }
            if (item.notification.email.enabled == true) {
                let values = item.notification.email.attributes
                let assValues = assignment.attributes.email
                let content = ""
                let emailParam = {}

                if (values[ONE_WEEK_INDEX] == 1 && diff <= 7 && assValues[ONE_WEEK_INDEX] == 0) {
                    // send email 
                    content = `7天提醒：您的作业：${assignment.name}还有不到${diff}天就要due了，抓紧时间写！`
                    emailParam = {
                        subject: "作业提醒",
                        toAddr: email,
                        content: content
                    }
                    sendEmail(emailParam)
                    assValues[ONE_WEEK_INDEX] = 1
                }
                if (values[THREE_DAY_INDEX] == 1 && diff <= 3 && assValues[THREE_DAY_INDEX] == 0) {
                    // send email 
                    content = `3天提醒：您的作业：${assignment.name}还有不到${diff}天就要due了，抓紧时间写！`
                    emailParam = {
                        subject: "作业提醒",
                        toAddr: email,
                        content: content
                    }
                    console.log("sending 2")
                    sendEmail(emailParam)
                    assValues[THREE_DAY_INDEX] = 1
                }
                if (values[ONE_DAY_INDEX] == 1 && diff <= 1 && assValues[ONE_DAY_INDEX] == 0) {
                    // send email
                    content = `1天提醒：您的作业：${assignment.name}还有不到${diff}天就要due了，抓紧时间写！`
                    emailParam = {
                        subject: "作业提醒",
                        toAddr: email,
                        content: content
                    }
                    sendEmail(emailParam)
                    assValues[ONE_DAY_INDEX] = 1
                }
            }
        }))
    }
    // const item = data[0]

    await db.collection(collectionName)
        .where({
            _openid: openid
        })
        .update({
            data: {
                userAssignments: assignments
            }
        })
}


// 云函数入口函数
exports.main = async (event, context) => {
    push("Test_MainUser")
}