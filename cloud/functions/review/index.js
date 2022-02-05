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

const omitSubReview = (singleReview) => {
    singleReview["numOfComments"] = singleReview.sub_review.length
    delete singleReview["sub_review"]
}

/**
 * add a review to the course
 * @param {Object} reviewObj
 */
async function addReview(collectionName, reviewObj) {
    const dateTime = getDateTime()
    const reviewContent = reviewObj.content
    const reviewobject = {
        review_id: crypto.createHash('sha256').update(reviewContent + dateTime.date + dateTime.time).copy().digest('hex'),
        postDate: dateTime.date,
        postTime: dateTime.time,
        searchTimes: 0,
        ...reviewObj,
    }
    await db.collection(collectionName).where({
        courseCode: reviewObj.courseCode
    }).update({
        data: {
            "review": _.push(reviewobject)
        }
    })
    omitSubReview(reviewobject)
    return reviewobject
}

/**
 * add subreview to the course
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 * @param {Object} subReviewObj
 */
async function addSubReview(collectionName, courseName, reviewId, subReviewObj) {
    const dateTime = getDateTime()
    const { content }= subReviewObj
    const reviewobject = {
        review_id: crypto.createHash('sha256').update(content + dateTime.date + dateTime.time).copy().digest('hex'),
        postDate: dateTime.date,
        postTime: dateTime.time,
        ...subReviewObj
    }
    await db.collection(collectionName).where({
        courseCode: courseName,
        'review.review_id': reviewId
    }).update({
        data: {
            "review.$.sub_review": _.push(reviewobject)
        }
    })
    return reviewobject
}

/**
 * delete the review, include the sub review
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 */
async function deleteReview(collectionName, courseName, reviewId) {
    return await db.collection(collectionName).where({
        courseCode: courseName,
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
        courseCode: courseName,
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
 * @param {*} subReviewId 
 * @param {*} subReviewObj
 */
async function updateSubReview(collectionName, courseName, reviewId, subReviewId, subReviewObj) {
    const  {posterName, content} = subReviewObj
    const dateTime = getDateTime()
    const res = await db.collection(collectionName).where({
        courseCode: courseName
    }).get()
    const reviews = res.data[0].review
    const reviewIndex = reviews.findIndex(c => c.review_id == reviewId)
    const subReviews = reviews[reviewIndex].sub_review
    const subReviewIndex = subReviews.findIndex(c1 => c1.review_id == subReviewId)
    const updatedSubreview = subReviews[subReviewIndex]
    updatedSubreview.posterName = posterName
    updatedSubreview.content = content
    updatedSubreview.postDate = dateTime.date
    updatedSubreview.postTime = dateTime.time
    await db.collection(collectionName).where({
        courseCode: courseName
    }).update({
        data: {
            review: reviews
        }
    })
    return updatedSubreview
}

/**
 * update the main review
 * @param {*} collectionName 
 * @param {*} courseName 
 * @param {*} reviewId 
 * @param {*} reviewContent 
 */
async function updateReview(collectionName, courseName, reviewId, updateObj) {
    const { content, studySemester, mark, posterName } = updateObj
    const dateTime = getDateTime()
    await db.collection(collectionName).where({
        courseCode: courseName,
        "review.review_id": reviewId
    }).update({
        data: {
            "review.$.content": content,
            "review.$.studySemester": studySemester,
            "review.$.mark": mark,
            "review.$.posterName": posterName,
            "review.$.postDate": dateTime.date,
            "review.$.postTime": dateTime.time
        }
    })
    const res = await db.collection(collectionName).where({
        courseCode: courseName,
    }).get()
    const reviews = res.data[0].review
    const index = reviews.findIndex(c => c.review_id == reviewId)
    const singleReview = reviews[index]
    omitSubReview(singleReview)
    return singleReview
}

const updateLikes = async(collectionName, courseName, reviewId, openid) => {
    return await db.collection(collectionName).where({
        courseCode: courseName,
        "review.review_id": reviewId
    }).update({
        data: {
            "review.$.likes": _.push(openid)
        }
    })
}


const updateReviewDimension = async(collectionName, courseName, dimensionIndex, openid) => {
    const res =  await db.collection(collectionName).where({
        courseCode: courseName,
    }).get()
    const dimensions = res.data[0].dimensions
    dimensions[dimensionIndex].push(openid)
    return await db.collection(collectionName).where({
        courseCode: courseName,
    }).update({
        data: {
            dimensions: dimensions
        }
    })
}


/**
 * 返回某门课所有评价以及其他维度参数。返回的每条评价里，不携带sub_review字段，以numOfComments替代
 * 代表有多少条追评。
 * @param {string} collectionName 集合名称
 * @param {string} courseName 课程名称
 */
async function getAllReview(collectionName, courseName) {
    let course = await db.collection(collectionName).where({
        courseCode: courseName,
    }).get()
    let res = course.data
    if (res.length == 0) return {
        reviews: [], 
        dimensions: [0, 0, 0, 0]
    }
    let reviews = res[0].review
    const newReviews = reviews.map((singleReview) => {
        omitSubReview(singleReview)
        return singleReview
    })
    newReviews.sort((r1, r2) => {
        if (r1.postDate + r1.postTime < r2.postDate + r2.postTime) return 1
        if (r1.postDate + r1.postTime > r2.postDate + r2.postTime) return -1
        return 0
    })
    return {
        reviews: newReviews, 
        dimensions: res[0].dimensions
    }
}   


/**
 * 返回某条主评的所有追评
 * @param {string} collectionName 集合名称
 * @param {string} courseName 课程名称
 * @param {string} reviewId 主评id
 */
const getAllSubReview = async(collectionName, courseName, reviewId) => {
    const res = await await db.collection(collectionName).where({
        courseCode: courseName,
    }).get()
    const reviews = res.data[0].review
    const index = reviews.findIndex(c => c.review_id == reviewId)
    const subReviews = reviews[index].sub_review
    subReviews.sort((r1, r2) => {
        if (r1.postDate + r1.postTime < r2.postDate + r2.postTime) return 1
        if (r1.postDate + r1.postTime > r2.postDate + r2.postTime) return -1
        return 0
    })
    return subReviews
}


/**
 * 返回某门课的基本课程信息
 * @param {string} collectionName 集合名称
 * @param {string} courseName 课程名称
 */
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
        const { courseCode, reviewId, subReviewObj } = event
        return await addSubReview(collectionName, courseCode.toUpperCase(), reviewId, subReviewObj)
    }
    if (method == "deleteReview") {
        const { reviewId, courseCode } = event
        return await deleteReview(collectionName, courseCode.toUpperCase(), reviewId)
    }

    if (method == "deleteSubReview") {
        const { reviewId, courseCode, subReviewId } = event
        return await deleteSubReview(collectionName, courseCode.toUpperCase(), reviewId, subReviewId)
    }

    if (method == "updateReview") {
        const { reviewId, courseCode, updatedObj } = event
        return await updateReview(collectionName, courseCode.toUpperCase(), reviewId, updatedObj)
    }

    if (method == "updateReviewDimensions") {
        const { courseCode, dimensionIndex, openid } = event
        return await updateReviewDimension(collectionName, courseCode.toUpperCase(), dimensionIndex, openid)
    }

    if (method == "updateLikes") {
        const { courseCode, reviewId, likes } = event
        return await updateLikes(collectionName, courseCode.toUpperCase(), reviewId, likes)
    }

    if (method == "updateSubReview") {
        const { reviewId, subReviewId, courseCode, subReviewObj } = event
        return await updateSubReview(collectionName, courseCode.toUpperCase(), reviewId, subReviewId, subReviewObj)
    }
    if (method == "getAllReview") {
        const { courseCode } = event
        return await getAllReview(collectionName, courseCode.toUpperCase())
    }

    if (method == "getAllSubReview") {
        const { courseCode, reviewId } = event
        return await getAllSubReview(collectionName, courseCode, reviewId)
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

    if (method == "updateReviewDimension") {
        const {courseCode, dimensionIndex, openid} = event
        return await updateReviewDimension(collectionName, courseCode, dimensionIndex, openid)
    }
}