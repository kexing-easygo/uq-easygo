// import moment from 'moment'
// 云函数入口文件
var moment = require('moment-timezone');
const cloud = require('wx-server-sdk')
const MAIN_USER_SUFFIX = "_MainUser"
const TIMETABLE_USER_SUFFIX = "_Timetable"
const CURRENT_YEAR = 2021
const COURSE_CODE_REGEX = /\w{4}\d{4,}/

cloud.init()


const db = cloud.database();
const _ = db.command
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    /**
     * 私有方法
     * 根据class的id，在数据库中搜索到对应的单节课信息。
     * 类似MySQL的外键
     */
async function __fetchClassById(collectionName, classId) {
    const courseId = classId.split("|")[0];
    var res = await fetchCourseInfo(collectionName, courseId);
    return {
        "_id": classId,
        "subject_code": classId.split("-")[0],
        "activity_group_code": `${res[classId].activity_group_code}${res[classId].activity_code}`,
        "location": res[classId].location,
        "day_of_week": res[classId].day_of_week,
        "start_time": res[classId].start_time,
        "duration": res[classId].duration,
        "activitiesDays": res[classId].activitiesDays
    };
}
/**
 * 私有方法
 * 根据学期返回用户文档中的某一学期所有classes
 */
async function __fetchCourseIdBySemester(openid, branch, semester) {
    const selectedCourses = await getSelectedCourses(openid, branch + MAIN_USER_SUFFIX);
    if (!selectedCourses.hasOwnProperty(semester)) return [];
    const classes = [];
    selectedCourses[semester].forEach(course => classes.push(...course.classes));
    return classes;
}


/**
 * 根据课程代码，返回某一门课的所有信息
 * 包括所有单节课等
 */
async function fetchCourseInfo(collectionName, courseId) {
    let courseCode = courseId.match(COURSE_CODE_REGEX)[0]
    var res = await db.collection(collectionName).where({
        name: courseCode // 根据courseCode搜索
    }).get();
    return res.data[0][courseId] || [];
}


/**
 * 将对应的课程信息添加到用户的文档中
 */
async function appendUserClasses(event) {
    const { semester, courseCode, classes, openid, branch } = event;
    const userCollection = branch + MAIN_USER_SUFFIX;
    const timetableCollection = branch + TIMETABLE_USER_SUFFIX;
    // 初始化课程结构
    const selectedCourses = await addSelectedCourses(openid, userCollection, courseCode, semester);
    const courseIndex = selectedCourses[semester].findIndex(course => course.courseCode === courseCode);
    selectedCourses[semester][courseIndex].classes.push(...classes); // 添加进class list
    await db.collection(userCollection)
        .where({ _openid: openid })
        .update({ data: { selectedCourses: selectedCourses } });
    const newClassesInfo = await Promise.all(classes.map(cl => __fetchClassById(timetableCollection, cl._id)));
    const merged = newClassesInfo.map(newClass => ({
        ...newClass,
        ...classes.find(c => c._id === newClass._id)
    }))
    return merged;
}


/**
 * 获取用户本学期已选择的class的具体信息和自定义内容
 */
async function fetchUserClasses(openid, branch, semester) {
    const classes = await __fetchCourseIdBySemester(openid, branch, semester);
    const timetableCollection = branch + TIMETABLE_USER_SUFFIX;
    const classesInfo = await Promise.all(classes.map(cl => __fetchClassById(timetableCollection, cl._id)));
    // 与用户自定义的内容合并
    const merged = classesInfo.map(classInfo => ({
        ...classes.find(c => c._id === classInfo._id),
        ...classInfo
    }))
    return merged;
}

async function updateUserClasses(event, collectionName) {
    const { openid, course, semester, classInfo } = event
    const res = await getSelectedCourses(openid, collectionName)
    const semesterInfo = res[semester]
    for (let i = 0; i < semesterInfo.length; i++) {
        let courseInfo = semesterInfo[i]
        if (courseInfo.courseCode == course) {
            let classes = courseInfo.classes
            for (let j = 0; j < classes.length; j++) {
                let singleClass = classes[j]
                if (singleClass["_id"] == classInfo["_id"]) {
                    classes[j] = classInfo
                    break
                }
            }
        }
    }
    const finalRes = await db.collection(collectionName)
        .where({
            _openid: openid
        })
        .update({
            data: {
                selectedCourses: res
            }
        })
    return res
}


async function fetchToday(openid, branch) {
    const allCourses = await fetchUserClasses(openid, branch, "Semester 2, 2021") // 获取所有的课程
    const todayCourses = {
        now: [],
        next: []
    };
    const todayDate = moment.tz('Asia/Shanghai');
    const currentTime = todayDate.get('hour')
    const today = `${todayDate.get('date')}/${todayDate.get('month') + 1}/${todayDate.get('year')}`.split('/').map(n => parseInt(n)).join('/');
    if (allCourses == undefined) return [];
    allCourses.map(course => {
        if (course.activitiesDays.includes(today)) {
            const startTime = parseInt(course.start_time.split(":")[0]);
            const endTime = parseInt(course.end_time.split(":")[0]);
            if (currentTime >= startTime && currentTime < endTime) todayCourses["now"].push(course);
            else if (currentTime <= startTime) todayCourses["next"].push(course);
        }
    })
    const compareCourse = (a, b) =>
        a.start_time.split(":")[0] - b.start_time.split(":")[0];
    todayCourses["next"] = todayCourses["next"].sort((a, b) => compareCourse(a, b));
    return todayCourses;
}

async function getSelectedCourses(openid, collectionName) {
    const result = await db.collection(collectionName)
        .where({ _openid: openid })
        .get()
    return result.data[0].selectedCourses;

}
/**
 * delete the all assgiment in that semester
 * @param {*} openid 
 * @param {*} semester 
 * @param {*} userCollection 
 */
async function deleteWholeSemester(openid, semester, userCollection) {
    db.collection(userCollection)
        .where({ _openid: openid }).update({
            data: {
                userAssignments: _.pull({
                    semester: _.eq(semester)
                })
            }
        })
}
/**
 * 用户在某个学期选择某门课的时间后，将该门课添加至用户的
 * selectedCourses字段内
 */
async function addSelectedCourses(openid, collectionName, courseCode, semester) {
    const selectedCourses = await getSelectedCourses(openid, collectionName);
    if (!selectedCourses.hasOwnProperty(semester)) {
        // 如果本学期不存在，推送新的学期和课程进去
        selectedCourses[semester] = [{
            courseCode: courseCode,
            results: [],
            classes: []
        }];
    } else {
        const semesterInfo = selectedCourses[semester];
        const courseIndex = semesterInfo.findIndex(course => course.courseCode === courseCode);
        if (courseIndex >= 0) return selectedCourses; // 本学期已经存在这门课了
        semesterInfo.push({
            courseCode: courseCode,
            results: [],
            classes: []
        })
    }
    await db.collection(collectionName)
        .where({ _openid: openid })
        .update({ data: { selectedCourses: selectedCourses } });
    return selectedCourses;
}

/**
 * 删除整节course
 * @param {string} openid 
 * @param {string} userCollection 
 * @param {string} courseCode 
 * @param {string} semester 
 */
async function deleteSelectedCourse(openid, userCollection, courseCode, semester) {
    const selectedCourses = await getSelectedCourses(openid, userCollection);
    if (!selectedCourses.hasOwnProperty(semester)) return;
    selectedCourses[semester] = selectedCourses[semester].filter(course => course.courseCode !== courseCode);
    return await db.collection(userCollection)
        .where({ _openid: openid })
        .update({ data: { selectedCourses: selectedCourses } });
}

/**
 * 删除已选课程对应学期中该course的某节class
 * @param {string} courseCode 课程代码
 * @param {string} semester e.g. "Semester 2, 2021"
 * @param {string} classId e.g. "INFO1113-S2C-ND-CC|LAB|01"
 * @param {string} collectionName timetable collection
 */
async function deleteUserClass(openid, courseCode, semester, classId, userCollection) {
    const selectedCourses = await getSelectedCourses(openid, userCollection);
    const courseIndex = selectedCourses[semester].findIndex(course => course.courseCode === courseCode);
    const afterDeleted = selectedCourses[semester][courseIndex].classes.filter(cl => cl._id !== classId);
    selectedCourses[semester][courseIndex].classes = afterDeleted;
    // 更新class list
    return await db.collection(userCollection)
        .where({ _openid: openid })
        .update({ data: { selectedCourses: selectedCourses } });
}



async function deleteWholeSemester(openid, semester, userCollection) {
    let selectedCourses = await getSelectedCourses(openid, userCollection);
    // delete selectedCourses.`${semester}`
    selectedCourses[semester] = []
    return await db.collection(userCollection)
        .where({ _openid: openid })
        .update({ data: { selectedCourses: selectedCourses } });
}

async function fetchCurrentSemester(openid, collectionName) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        }).get()
    return res.data[0].currentSemester
}

async function updateCurrentSemester(openid, collectionName, currentSemester) {
    const res = await db.collection(collectionName)
        .where({
            _openid: openid
        })
        .update({
            data: {
                currentSemester: currentSemester
            }
        })
    return res
}

// 云函数入口函数
exports.main = async(event, context) => {
    var branch = event.branch
    var method = event.method
    if (branch == undefined || method == undefined) {
        return {
            data: "缺少必须的元素"
        }
    }
    const { openid } = event
    var semester = event.semester == undefined ? "" : event.semester
    if (method == "fetchCourseInfo") {
        return await fetchCourseInfo(branch + TIMETABLE_USER_SUFFIX, event.courseId)
    }

    const userCollection = branch + MAIN_USER_SUFFIX
    if (method == "appendUserClasses") {
        return await appendUserClasses(event)
    }
    if (method == "fetchToday") {
        return await fetchToday(openid, branch)
    }

    if (method == "fetchUserClasses") {
        return await fetchUserClasses(openid, branch, semester)
    }
    if (method == "updateUserClass") {
        return await updateUserClasses(event, userCollection)
    }

    if (method == "getSelectedCourses") {
        return await getSelectedCourses(openid, userCollection)
    }
    if (method == "addSelectedCourses") {
        var course = event.course
        var semester = event.semester
        return await addSelectedCourses(openid, userCollection, course, semester)
    }
    if (method == "deleteSelectedCourse") {
        const { courseCode, semester } = event;
        return await deleteSelectedCourse(openid, userCollection, courseCode, semester)
    }

    if (method === "deleteUserClass") {
        const { openid, courseCode, semester, classId } = event;
        return await deleteUserClass(openid, courseCode, semester, classId, userCollection);
    }

    if (method == "deleteWholeSemester") {
        const { openid, semester } = event;
        return await deleteWholeSemester(openid, semester, userCollection)
    }
    const { currentSemester } = event
    if (method == "fetchCurrentSemester") {
        return fetchCurrentSemester(openid, userCollection)
    }
    if (method == "updateCurrentSemester") {
        return updateCurrentSemester(openid, userCollection, currentSemester)
    }
}