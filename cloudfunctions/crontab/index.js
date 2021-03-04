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

async function template(title, dayDiff, duetime, openid, username) {
    var tt = String(duetime.getFullYear()) + "." + String(duetime.getMonth() + 1) + "." + String(duetime.getDate()) + " "
    tt += String(duetime.getHours()) + ":" + String(duetime.getMinutes())
    var res = await cloud.callFunction({
        name: "sendTemplate",
        data: {
            "作业名称": title,
            "截至日期": tt,
            "提醒内容": "要交作业啦！",
            "发布人员": "UQ校园通团队",
            "openid": openid,
        }
    })
    if (res.result.errCode != 0) {
        console.log("用户%s拒绝接受订阅通知", username)
    }
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
    if (location == "AU") {
        var hours = date1.getHours()
        date1.setHours(hours + 2) // 澳洲差两个小时
    }
    var diff = parseFloat((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
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

    // 第一次循环，获取所有用户信息
    for (let i = 0; i < data.length; i++) {
        var userAssignments = data[i].userAssignments
        var email = data[i].userEmail
        var openid = data[i]._openid
        // debug
        // var userName = data[i].userInfo.nickName
        if (data[i].notification) {
            const notification = data[i].notification
            if (notification.location) {
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
        if (data[i].userInfo) {
            var username = data[i].userInfo.nickName
        }
        // 第二次循环，获取每个用户的所有作业

        // console.log("用户：%s有几项作业，分别为", userName)
        for (let j = 0; j < userAssignments.length; j++) {
            var ass = userAssignments[j]
            var date = ass.date
            var time = ass.time
            var dueDate = processDateTime(date, time)
            var name = ass.name
            // 忽视due的时间，只计算日期
            var now = new Date()
            var dayDiff = dateDiff(now, dueDate, location)
            // 检查是否相差正数天
            // debug
            // if (openid == "oe4Eh5fXV7Oo2l6dIpQCNII3XFIw") {
            // if (ass["oneDayEmail"] == 1) ass["oneDayEmail"] = 0
            // if (ass["threeDayEmail"] == 1) ass["threeDayEmail"] = 0
            // if (ass["oneWeekEmail"] == 1) ass["oneWeekEmail"] = 0
            // if (ass["oneDayWe"] == 1) ass["oneDayWe"] = 0
            // if (ass["threeDayWe"] == 1) ass["threeDayWe"] = 0
            // if (ass["oneWeekWe"] == 1) ass["oneWeekWe"] = 0

            if (dayDiff >= 0) {
                if (emailNotification == true && email != '') {
                    if (dayDiff <= 1 && oneDay == 1) {
                        if (ass["oneDayEmail"] != 1) {
                            send(email, name, "oneDay")
                            ass["oneDayEmail"] = 1
                        }
                    }
                    if (dayDiff <= 3 && threeDay == 1) {
                        if (ass["threeDayEmail"] != 1) {
                            send(email, name, "threeDay")
                            ass["threeDayEmail"] = 1
                        }
                    }
                    if (dayDiff <= 7 && oneWeek == 1) {
                        if (ass["oneWeekEmail"] != 1) {
                            send(email, name, "oneWeek")
                            ass["oneWeekEmail"] = 1
                        }
                    }
                }
                //用户接收订阅
                if (wechatNotification == true) {
                    if (dayDiff <= 1 && oneDay == 1) {
                        if (ass["oneDayWe"] != 1) {
                            template(name, dayDiff, dueDate, openid, username)
                            ass["oneDayWe"] = 1
                        }
                    }
                    if (dayDiff <= 3 && threeDay == 1) {
                        if (ass["threeDayWe"] != 1) {
                            template(name, dayDiff, dueDate, openid, username)
                            ass["threeDayWe"] = 1
                        }
                    }
                    if (dayDiff <= 7 && oneWeek == 1) {
                        if (ass["oneWeekWe"] != 1) {
                            template(name, dayDiff, dueDate, openid, username)
                            ass["oneWeekWe"] = 1
                        }
                    }
                }
            }
            // }
        }
        // 把用户作业更新上去
        db
        .collection("MainUser")
        .where({
            _openid: openid
        })
        .update({
            userAssignments: userAssignments
        })
        // console.log(res)
    }
}
// 云函数入口函数
exports.main = async (event, context) => {
    getAllData()
}