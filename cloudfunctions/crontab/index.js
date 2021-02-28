// 云函数入口文件
const cloud = require('wx-server-sdk')
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({
    // env: cloudbase.SYMBOL_CURRENT_ENV
    env: "uqeasygo1"
});
const db = app.database();

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

async function template(title, time, duetime, openid) {
    var tt = String(duetime.getFullYear()) + "年" + String(duetime.getMonth() + 1) + "月" + String(duetime.getDate()) + "日"
    var res = await cloud.callFunction({
        name: "sendTemplate",
        data: {
            "作业标题": title,
            "时间": String(time.getFullYear()) + "年" + String(time.getMonth() + 1) + "月" + String(time.getDate()) + "日",
            "截止时间": tt,
            "提醒内容": "您的作业项目即将due。",
            "备注": "UQ校园通团队",
            "openid": openid,
        }
    })
    console.log(res)
}

async function send(email, name, type) {
    var content = name + "还有"
    if (type == "oneDay") {
        content += "1天"
    } else if (type == "threeDay") {
        content += "3天"
    } else if (type == "oneWeek") {
        content = content + "1周"
    }
    content += "就due啦！要抓紧写哦！！！\n\nUQ校园通团队"
    var res = await cloud.callFunction({
        // 要调用的云函数名称
        name: 'sendEmail',
        // 传递给云函数的参数
        data: {
            "toAddr": email,
            "subject": "作业提醒",
            "content": content
        }
    })
}

// date1 是now， date2是dueDate
function dateDiff(date1, date2, location) {
    var timeStamp = date1.getTime()
    if (location == "AU") {
        // 转化为澳洲时间计算
        timeStamp += 2 * 60 * 60 * 1000
    } 
    var date1 = new Date(timeStamp)
    var new1 = new Date(date1.getFullYear().toString() + "/" + (date1.getMonth() + 1).toString() + "/" + date1.getDate().toString()).getTime()
    var new2 = new Date(date2.getFullYear().toString() + "/" + (date2.getMonth() + 1).toString() + "/" + date2.getDate().toString()).getTime()
    var diff = parseInt((new2 - new1) / (1000 * 60 * 60 * 24))
    return diff
}

function processDateTime(date, time) {
    var string = date + "T" + time + ":00"
    return new Date(string)
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
        const openid = data[i]._openid
        if (data[i].notification) {
            const notification = data[i].notification
            if (notification.location)  {
                var location = notification.location
            }
            if (notification.oneDay) {

                var oneDay = notification.oneDay
            }
            if (notification.threeDay) {

                var threeDay = notification.threeDay
            }
            if (notification.oneWeek) {

                var oneWeek = notification.oneWeek
            }
            if (notification.emailNotification) {

                var emailNotification = notification.emailNotification
            }
            if (notification.wechatNotification) {

                var wechatNotification = notification.wechatNotification
            }
        }
        // 第二次循环，获取每个用户的所有作业
        for (let j = 0; j < userAssignments.length; j++) {
            const ass = userAssignments[j]
            const date = ass.date
            const time = ass.time
            var dueDate = processDateTime(date, time)
            const name = ass.name
            // 忽视due的时间，只计算日期
            var dayDiff = dateDiff(now, dueDate, location)
            // 检查是否相差正数天
            if (dayDiff >= 0) {
                if (emailNotification == true && email != '') {
                    if (dayDiff <= 1 && oneDay == 1) {
                        send(email, name, "oneDay")
                    }
                    if (dayDiff <= 3 && threeDay == 1) {
                        send(email, name, "threeDay")
                    }
                    if (dayDiff <= 7 && oneWeek == 1) {
                        send(email, name, "oneWeek")
                    }
                }
                // 用户接收订阅
                if (wechatNotification == true) {
                    if (dayDiff <= 1 && oneDay == 1) {
                        template(name, now, dueDate, openid)
                        
                    }
                    if (dayDiff <= 3 && threeDay == 1) {
                        template(name, now, dueDate, openid)
                    }
                    if (dayDiff <= 7 && oneWeek == 1) {
                        template(name, now, dueDate, openid)
                    }
                    
                }
            }
        }
    }
}
// 云函数入口函数
exports.main = async (event, context) => {
    getAllData()
}