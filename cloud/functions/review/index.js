// 云函数入口文件
const cloud = require('wx-server-sdk')
const util = require('util')
const crypto = require('crypto')
const REVIEW_SUFFIX = "_review"

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

// get the date and time information
function getDateTime() {
    let date_ob = new Date();

    // current date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    return {
        date: util.format("%s-%s-%s", year, month, date),
        time: util.format("%s:%s:%s", hours, minutes, seconds)
    }
}
/**
 * add a review to the course
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} poster_name 
 * @param {*} reviewContent 
 */
async function addReview(collectionName, courseName, poster_name, reviewContent) {
    const dateTime = getDateTime()
    var reviewobject = {
        review_id: crypto.createHash('sha256').update(reviewContent + dateTime.date + dateTime.time).copy().digest('hex'),
        post_date: dateTime.date,
        post_time: dateTime.time,
        poster_name: poster_name,
        review: reviewContent
    }
    return await db.collection(collectionName).where({
        course_name: courseName
    }).update({
        data: {
            "review": _.push(reviewobject)
        }
    })
}

/**
 * add subreview to the course
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 * @param {*} poster_name 
 * @param {*} reviewContent 
 */
async function addSubReview(collectionName, courseName, reviewId, poster_name, reviewContent) {
    const dateTime = getDateTime()
    var reviewobject = {
        review_id: crypto.createHash('sha256').update(reviewContent + dateTime.date + dateTime.time).copy().digest('hex'),
        post_date: dateTime.date,
        post_time: dateTime.time,
        poster_name: poster_name,
        review: reviewContent
    }
    return await db.collection(collectionName).where({
        course_name: courseName,
        'review.review_id': reviewId
    }).update({
        data: {
            "review.$.sub_review": _.push(reviewobject)
        }
    })
}

/**
 * get all review of a course
 * @param {*} collectionName 
 * @param {*} courseName 
 */
async function getAllReview(collectionName, courseName) {
    let course = await db.collection(collectionName).where({
        course_name: courseName,
    }).get()
    return course.data[0].review
}
// 云函数入口函数
exports.main = async (event, context) => {
    const { branch, method } = event
    if (branch == undefined || method == undefined) {
        return {}
    }
    const collectionName = branch + REVIEW_SUFFIX

    if (method == "addReview") {
        const { courseName, poster_name, reviewContent } = event
        return await addReview(collectionName, courseName, poster_name, reviewContent)
    }

    if (method == "addSubReview") {
        const { courseName, poster_name, reviewContent, reviewId } = event
        return await addSubReview(collectionName, courseName, reviewId, poster_name, reviewContent)
    }

    if (method == "getAllReview") {
        const { courseName } = event
        return await getAllReview(collectionName, courseName)
    }
}