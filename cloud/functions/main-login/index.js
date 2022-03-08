const cloud = require('wx-server-sdk');
const MAIN_USER_SUFFIX = "_MainUser"

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

function GetDateStr(AddDayCount) {
    var dd = new Date();
    //获取AddDayCount天后的日期
    dd.setDate(dd.getDate() + AddDayCount);
    var y = dd.getFullYear();
    //获取当前月份的日期，不足10补0
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
    //获取当前几号，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
}

// 默认作业的倒计时时间
var d1 = GetDateStr(3)
var d2 = GetDateStr(29)
// 默认作业
const DEFAULT_ASSIGNMENTS = [{
        'aid': "default1",
        'color': '#576B95',
        'name': "CSSE1001 A1 (示例)",
        "date": d1,
        "time": "00:00",
        "default": true,
        "type": "Assessment"
    },
    {
        'aid': "default2",
        'color': '#576B95',
        'name': "点我查看更多",
        "date": d2,
        "time": "00:00",
        "default": true,
        "type": "Exam"
    }
]

async function createUser(openid, userInfo, collectionName) {
    const status = await loginStatus(openid, collectionName)
    if (status) return
    const res = await db.collection(collectionName)
        .add({
            data: {
                _openid: openid,
                nickName: userInfo.nickName,
                userAssignments: DEFAULT_ASSIGNMENTS,
                userInfo: userInfo,
                userEmail: "",
                userMobile: "",
                currentSemester: "Semester 1, 2022",
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
                classMode: "中国境内",
                cardsInfo: {
                    todayClasses: 1,
                    recentAssignments: 1,
                    newActivities: 1
                },
                classNotify: false
            }
        })
    return res

}


async function loginStatus(openid, collectionName) {
    const i = await db.collection(collectionName).where({
            _openid: openid
        })
        .get()
    return i.data.length == 0 ? false : true
}

async function getUserInfo(openid, collectionName) {
    const result = await db.collection(collectionName).where({
        _openid: openid
    }).get()
    const res = result.data[0]
    return {
        ...res.userInfo,
        userEmail: res.userEmail,
        userMobile: res.userMobile,
        classMode: res.classMode
    }
}


async function updateClassMode(openid, collectionName, mode) {
    const res = await db.collection(collectionName)
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
        .where({
            _openid: openid
        })
        .update({
            data: {
                cardsInfo: cardsInfo
            }
        })
    return res
}

async function getCardsInfo(openid, collectionName) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        })
        .get()
    return res.data[0].cardsInfo
}

async function updateEmail(openid, collectionName, email) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        })
        .update({
            data: {
                userEmail: email
            }
        })
    return res
}

async function updateMobile(openid, collectionName, mobile) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        })
        .update({
            data: {
                userMobile: mobile
            }
        })
    return res
}

/**
 * get the card information of the user
 * @param {*} openid 
 * @param {*} collectionName 
 */
async function getCardsInfo(openid, collectionName) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        }).get()
    return res.data[0].cardsInfo
}

/**
 * update the card information of the user
 * @param {*} openid 
 * @param {*} collectionName 
 * @param {*} cardsInfo 
 */
async function manageCards(openid, collectionName, cardsInfo) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        }).update({
            data: {
                cardsInfo: cardsInfo
            }
        })
    return res
}

async function updateEmail(openid, collectionName, email) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        }).update({
            data: {
                userEmail: email
            }
        })
    return res
}



async function updateMobile(openid, collectionName, mobile) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        }).update({
            data: {
                userMobile: mobile
            }
        })
    return res
}

const getClassNotify = async (openid, collectionName) => {
    const result = await db.collection(collectionName)
        .where({
            _openid: openid
        })
        .get()
    const res = result.data[0]
    return res.classNotify
}

/**
 * 
 * @param {string} openid 用户的openid
 * @param {string} collectionName 集合名称
 * @param {Boolean} value true或者false，用户设置是否上课提醒
 */
const updateClassNotify = async (openid, collectionName, value) => {
    return await db.collection(collectionName)
        .where({
            _openid: openid
        }).update({
            data: {
                classNotify: value
            }
        })
}

exports.main = async (event, context) => {
    const {
        branch,
        method
    } = event
    if (branch == undefined || method == undefined) {
        return {}
    }
    // let openid = ''
    const wxContext = cloud.getWXContext()
    // branch: USYD / UMEL
    // switch (branch) {
    //     case "UQ":
    //         openid = wxContext.OPENID;
    //         break;
    //     default:
    //         openid = wxContext.FROM_OPENID;
    //         break
    // }
    if (event.method == "getOpenID") {
        return wxContext.FROM_OPENID
    }
    const collectionName = branch + MAIN_USER_SUFFIX
    const {
        openid
    } = event
    if (method == "createUser") {
        const {
            userInfo
        } = event
        return await createUser(openid, userInfo, collectionName);
    }
    if (method == "loginStatus") {
        return await loginStatus(openid, collectionName);
    }
    if (method == "getUserInfo") {
        return await getUserInfo(openid, collectionName)
    }
    if (method == "updateClassMode") {
        const {
            classMode
        } = event
        return await updateClassMode(openid, collectionName, classMode)
    }
    if (method == "getCardsInfo") {
        return await getCardsInfo(openid, collectionName)
    }
    if (method == "manageCards") {
        const {
            cardsInfo
        } = event
        return await manageCards(openid, collectionName, cardsInfo)
    }
    if (method == "updateEmail") {
        const {
            email
        } = event
        return await updateEmail(openid, collectionName, email)
    }
    if (method == "updateMobile") {
        const {
            mobile
        } = event
        return await updateMobile(openid, collectionName, mobile)
    }
    let testOpenId = wxContext.OPENID
    if (method == "updateClassNotify") {
        const {
            classNotifyValue
        } = event
        return await updateClassNotify(testOpenId, collectionName, classNotifyValue)
    }
    if (method == "getClassNotify") {
        return await getClassNotify(testOpenId, collectionName)
    }
}