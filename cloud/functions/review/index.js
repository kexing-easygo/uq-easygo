// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')
const moment = require('moment-timezone');
const REVIEW_SUFFIX = "_Review"
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command

// get the date and time information
function getDateTime() {
    date_obj = moment().tz('Asia/Shanghai').format(DATE_FORMAT)
    const date = date_obj.split(" ")[0]
    const time = date_obj.split(" ")[1]
    return {
        date: date,
        time: time
    }
}
/**
 * add a review to the course
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} posterName 
 * @param {*} reviewContent 
 */
async function addReview(collectionName, reviewObj) {
    const dateTime = getDateTime()
    const reviewContent = reviewObj.reviewContent
    var reviewobject = {
        review_id: crypto.createHash('sha256').update(reviewContent + dateTime.date + dateTime.time).copy().digest('hex'),
        post_date: dateTime.date,
        post_time: dateTime.time,
        ...reviewObj,
    }
    return await db.collection(collectionName).where({
        courseCode: reviewObj.courseCode
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
 * delete the review, include the sub review
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 */
async function deleteReview(collectionName, courseName, reviewId) {
    return await db.collection(collectionName).where({
        course_name: courseName,
    }).update({
        data: {
            review: _.pull({
                review_id: _.eq(reviewId)
            })
        }
    })
}

/**
 * delete the sub review based on the main review_id and the sub review_id
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 * @param {*} subReviewId 
 */
async function deleteSubReview(collectionName, courseName, reviewId, subReviewId) {
    return await db.collection(collectionName).where({
        course_name: courseName,
        "review.review_id": reviewId
    }).update({
        data: {
            "review.$.sub_review": _.pull({
                review_id: _.eq(subReviewId)
            })
        }
    })
}

/**
 * update the sub review based on the main review_id and the sub review_id
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 * @param {*} subReviewId 
 * @param {*} reviewContent 
 */
async function updateSubReview(collectionName, courseName, reviewId, subReviewId, reviewContent) {
    return await db.collection(collectionName).where({
        course_name: courseName,
        "review.sub_review.review_id": subReviewId,
    }).update({
        data: {
            "review.$.sub_review.$[].review": reviewContent
        }
    })
}

/**
 * update the main review
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 * @param {*} reviewContent 
 */
async function updateReview(collectionName, courseName, reviewId, reviewContent) {
    return await db.collection(collectionName).where({
        course_name: courseName,
        "review.review_id": reviewId
    }).update({
        data: {
            "review.$.review": reviewContent
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
        courseCode: courseName,
    }).get()
    if (course.data.length > 0) {
        return course.data[0].review
    } else {
        return {
            "errMsg": "No reviews",
            "review": false
        }
    }
}

const getCourseDetail = async(collectionName, courseName) => {
    const res = await db.collection(collectionName).where({
        _id: courseName,
    }).get()
    if (res.data.length === 0) return {}
    else {
        return {
            ...res.data[0].academic_detail,
            ...res.data[0].enrolment_rule
        }
    }
}   


async function topSearch(collectionName, topNumber) {
    let courses = await db.collection(collectionName).orderBy("searchTimes", "desc").limit(topNumber).get()
    return courses.data
}

// 云函数入口函数
exports.main = async (event, context) => {
    const { branch, method } = event
    if (branch == undefined || method == undefined) {
        return {}
    }
    const collectionName = branch + REVIEW_SUFFIX //branch + REVIEW_SUFFIX

    if (method == "addReview") {
        const { reviewObj } = event
        return await addReview(collectionName, reviewObj)
    }

    if (method == "addSubReview") {
        const { courseCode, posterName, reviewContent, reviewId } = event
        return await addSubReview(collectionName, courseCode.toUpperCase(), reviewId, posterName, reviewContent)
    }
    if (method == "deleteReview") {
        const { reviewId, courseCode, reviewContent } = event
        return await deleteReview(collectionName, courseCode.toUpperCase(), reviewId)
    }

    if (method == "deleteSubReview") {
        const { reviewId, courseCode, subReviewId } = event
        return await deleteSubReview(collectionName, courseCode.toUpperCase(), reviewId, subReviewId)
    }

    if (method == "updateReview") {
        const { reviewId, courseCode, reviewContent } = event
        return await updateReview(collectionName, courseCode.toUpperCase(), reviewId, reviewContent)
    }

    if (method == "updateSubReview") {
        const { reviewId, subReviewId, courseCode, reviewContent } = event
        return await updateSubReview(collectionName, courseCode.toUpperCase(), reviewId, subReviewId, reviewContent)
    }
    if (method == "getAllReview") {
        const { courseCode } = event
        return await getAllReview(collectionName, courseCode.toUpperCase())
    }
    if (method == "getCourseDetail") {
        const { courseCode } = event
        return await getCourseDetail(branch + "_Courses", courseCode)
    }

    if (method == "topSearch") {
        let { topNumber } = event
        if (topNumber == undefined) {
            topNumber = 10
        }
        return await topSearch(collectionName, topNumber)
    }
}