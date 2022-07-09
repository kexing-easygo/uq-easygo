// import moment from 'moment'
// 云函数入口文件
var moment = require("moment-timezone");
const cloud = require("wx-server-sdk");
const MAIN_USER_SUFFIX = "_MainUser";
const TIMETABLE_USER_SUFFIX = "_Timetable";
const CURRENT_SEMESTER = "Semester 2, 2022";
const COURSE_CODE_REGEX = /\w{4}\d{4,}/;
const ical = require("cal-parser");
const requestPromise = require("request-promise");
const RANDOM_COLORS = ["#FA5151", "#FFC300", "#07C160", "#1485EE", "#576B95"];

cloud.init();
const CLASS_ID_REGEX = /([A-Za-z]{4,}[0-9]{4,})((_|\-).*)\|.*\|.*/;

const WEEKDAY_MAPPER = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

const db = cloud.database();
const _ = db.command;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const computeDuration = (start, end) => {
  return end.diff(start, "minutes");
};

const getDetailedClassId = (desc) => {
  const items = desc.split(", ");
  let classTitle = `${items[0]}|${items[1]}`;
  const trialing = items[2];
  const trialingNumber = trialing.split(" ")[0];
  return {
    _id: `${classTitle}|${trialingNumber}`,
    subject_code: items[0],
    activity_group_code: items[1],
  };
};

const getClassTimeTest = (timeItem, timezone) => {
  return moment.tz(timeItem, timezone).utc();
};

const getCourseCode = (classTitle) => {
  let res = classTitle.match(CLASS_ID_REGEX);
  return res[1];
};

/**
 * 私有方法
 * 根据class的id，在数据库中搜索到对应的单节课信息。
 * 类似MySQL的外键
 */
async function __fetchClassById(collectionName, classId) {
  const courseId = classId.split("|")[0];
  var res = await fetchCourseInfo(collectionName, courseId);
  return {
    _id: classId,
    subject_code: classId,
    activity_group_code: `${res[classId].activity_group_code}${res[classId].activity_code}`,
    location: res[classId].location,
    day_of_week: res[classId].day_of_week,
    start_time: res[classId].start_time,
    duration: res[classId].duration,
    activitiesDays: res[classId].activitiesDays,
  };
}
/**
 * 私有方法
 * 根据学期返回用户文档中的某一学期所有classes
 */
async function __fetchCourseIdBySemester(openid, branch, semester) {
  const selectedCourses = await getSelectedCourses(
    openid,
    branch + MAIN_USER_SUFFIX
  );
  if (!selectedCourses.hasOwnProperty(semester)) return [];
  const classes = [];
  selectedCourses[semester].forEach((course) =>
    classes.push(...course.classes)
  );
  return classes;
}

/**
 * 根据课程代码，返回某一门课的所有信息
 * 包括所有单节课等
 */
async function fetchCourseInfo(collectionName, courseId) {
  let courseCode = courseId.match(COURSE_CODE_REGEX)[0];
  var res = await db
    .collection(collectionName)
    .where({
      name: courseCode, // 根据courseCode搜索
    })
    .get();
  if (res.data.length == 0) return [];
  return res.data[0][courseId];
}

/**
 * 将对应的课程信息添加到用户的文档中
 */
async function appendUserClasses(event) {
  const { semester, courseCode, classes, openid, branch } = event;
  console.log("Adding class :::", classes);
  const userCollection = branch + MAIN_USER_SUFFIX;
  const timetableCollection = branch + TIMETABLE_USER_SUFFIX;
  // 初始化课程结构
  const selectedCourses = await addSelectedCourses(
    openid,
    userCollection,
    courseCode,
    semester
  );
  const courseIndex = selectedCourses[semester].findIndex(
    (course) => course.courseCode === courseCode
  );
  selectedCourses[semester][courseIndex].classes.push(...classes); // 添加进class list
  await db
    .collection(userCollection)
    .where({
      _openid: openid,
    })
    .update({
      data: {
        selectedCourses: selectedCourses,
      },
    });
  const newClassesInfo = await Promise.all(
    classes.map((cl) =>
      cl.subscribed ? cl : __fetchClassById(timetableCollection, cl._id)
    )
  );
  const merged = newClassesInfo.map((newClass) => ({
    ...newClass,
    ...classes.find((c) => c._id === newClass._id),
  }));
  return merged;
}

/**
 * 获取用户本学期已选择的class的具体信息和自定义内容
 */
async function fetchUserClasses(openid, branch, semester) {
  const classes = await __fetchCourseIdBySemester(openid, branch, semester);
  const timetableCollection = branch + TIMETABLE_USER_SUFFIX;
  const classesInfo = await Promise.all(
    classes.map((cl) =>
      cl.subscribed == undefined
        ? __fetchClassById(timetableCollection, cl._id)
        : cl
    )
  );
  // 与用户自定义的内容合并
  const merged = classesInfo.map((classInfo) => ({
    ...classes.find((c) => c._id === classInfo._id),
    ...classInfo,
  }));
  return merged;
}

async function updateUserClasses(event, collectionName) {
  const { openid, course, semester, classInfo } = event;
  const res = await getSelectedCourses(openid, collectionName);
  const semesterInfo = res[semester];
  for (let i = 0; i < semesterInfo.length; i++) {
    let courseInfo = semesterInfo[i];
    if (courseInfo.courseCode == course) {
      let classes = courseInfo.classes;
      for (let j = 0; j < classes.length; j++) {
        let singleClass = classes[j];
        if (singleClass["_id"] == classInfo["_id"]) {
          classes[j] = classInfo;
          break;
        }
      }
    }
  }
  const finalRes = await db
    .collection(collectionName)
    .where({
      _openid: openid,
    })
    .update({
      data: {
        selectedCourses: res,
      },
    });
  return res;
}

const reformatTodayDate = (today) => {
  const temp = today.clone();
  const monthNumber = temp.get("month") + 1;
  const dateNumber = temp.get("date");
  const month =
    monthNumber.toString().length === 1
      ? `${0}${monthNumber}`
      : `${monthNumber}`;
  const date =
    dateNumber.toString().length === 1 ? `${0}${dateNumber}` : `${dateNumber}`;
  const today1 = `${temp.get("year")}-${month}-${date}`;
  return today1;
};

const getStartTime = (today, course, branch) => {
  const { start_time } = course;
  const today1 = reformatTodayDate(today);
  const startTimeDateString = `${today1} ${start_time}`;
  if (branch == "UQ") {
    return moment.tz(startTimeDateString, "Australia/Brisbane");
  } else if (branch == "USYD") {
    return moment.tz(startTimeDateString, "Australia/Sydney");
  } else if (branch == "UMEL") {
    return moment.tz(startTimeDateString, "Australia/Melbourne");
  }
};

const reformatHourAndMinutes = (momentTime) => {
  const hours = momentTime.get("hour") === 0 ? "00" : momentTime.get("hour");
  const minutes =
    momentTime.get("minutes") === 0 ? "00" : momentTime.get("minutes");
  return `${hours}:${minutes}`;
};

const getEndTime = (today, course, branch) => {
  const startTime = getStartTime(today, course, branch);
  const { duration } = course;
  return startTime.clone().add(parseInt(duration), "minutes");
};

const fetchToday = async (openid, branch) => {
  const res = await cloud.callFunction({
    // 要调用的云函数名称
    name: "main-login",
    // 传递给云函数的参数
    data: {
      branch: branch,
      method: "getUserInfo",
      openid: openid,
    },
  });
  // 获取用户的上课模式和当前学期
  const currentSemester = await fetchCurrentSemester(
    openid,
    branch + MAIN_USER_SUFFIX
  );
  const { classMode } = res.result;
  const allCourses = await fetchUserClasses(openid, branch, currentSemester); // 获取所有的课程
  const todayCourses = {
    next: [],
  };
  let tz = "Asia/Shanghai";
  if (classMode === "澳洲境内") {
    if (branch === "UQ") {
      tz = "Australia/Brisbane";
    } else if (branch === "USYD") {
      tz = "Australia/Sydney";
    } else if (branch == "UMEL") {
      tz = "Australia/Melbourne";
    }
  }
  const todayDate = moment.tz(tz);
  const currentTime = todayDate.get("hour");
  const today = `${todayDate.get("date")}/${
    todayDate.get("month") + 1
  }/${todayDate.get("year")}`
    .split("/")
    .map((n) => parseInt(n))
    .join("/");
  if (allCourses == undefined) return [];
  allCourses.map((course) => {
    if (course.activitiesDays.includes(today)) {
      // startTime和endTime默认为澳洲院校当地时间
      let startTime = getStartTime(todayDate, course, branch);
      let endTime = getEndTime(todayDate, course, branch);
      // 考虑到如果是国内的同学，要再转成国内时间
      if (tz == "Asia/Shanghai") {
        startTime = startTime.clone().tz(tz);
        endTime = endTime.clone().tz(tz);
      }
      course["start_time"] = reformatHourAndMinutes(startTime);
      course["end_time"] = reformatHourAndMinutes(endTime);
      if (currentTime <= startTime.get("hour"))
        todayCourses["next"].push(course);
    }
  });
  const compareCourse = (a, b) =>
    a.start_time.split(":")[0] - b.start_time.split(":")[0];
  todayCourses["next"] = todayCourses["next"].sort((a, b) =>
    compareCourse(a, b)
  );
  return todayCourses;
};

async function getSelectedCourses(openid, collectionName) {
  const result = await db
    .collection(collectionName)
    .where({
      _openid: openid,
    })
    .get();
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
    .where({
      _openid: openid,
    })
    .update({
      data: {
        userAssignments: _.pull({
          semester: _.eq(semester),
        }),
      },
    });
}
/**
 * 用户在某个学期选择某门课的时间后，将该门课添加至用户的
 * selectedCourses字段内
 */
async function addSelectedCourses(
  openid,
  collectionName,
  courseCode,
  semester
) {
  const selectedCourses = await getSelectedCourses(openid, collectionName);
  if (!selectedCourses.hasOwnProperty(semester)) {
    // 如果本学期不存在，推送新的学期和课程进去
    selectedCourses[semester] = [
      {
        courseCode: courseCode,
        results: [],
        classes: [],
      },
    ];
  } else {
    const semesterInfo = selectedCourses[semester];
    const courseIndex = semesterInfo.findIndex(
      (course) => course.courseCode === courseCode
    );
    if (courseIndex >= 0) return selectedCourses; // 本学期已经存在这门课了
    semesterInfo.push({
      courseCode: courseCode,
      results: [],
      classes: [],
    });
  }
  await db
    .collection(collectionName)
    .where({
      _openid: openid,
    })
    .update({
      data: {
        selectedCourses: selectedCourses,
      },
    });
  return selectedCourses;
}

/**
 * 删除整节course
 * @param {string} openid
 * @param {string} userCollection
 * @param {string} courseCode
 * @param {string} semester
 */
async function deleteSelectedCourse(
  openid,
  userCollection,
  courseCode,
  semester
) {
  const selectedCourses = await getSelectedCourses(openid, userCollection);
  if (!selectedCourses.hasOwnProperty(semester)) return;
  selectedCourses[semester] = selectedCourses[semester].filter(
    (course) => course.courseCode !== courseCode
  );
  return await db
    .collection(userCollection)
    .where({
      _openid: openid,
    })
    .update({
      data: {
        selectedCourses: selectedCourses,
      },
    });
}

/**
 * 删除已选课程对应学期中该course的某节class
 * @param {string} courseCode 课程代码
 * @param {string} semester e.g. "Semester 2, 2021"
 * @param {string} classId e.g. "INFO1113-S2C-ND-CC|LAB|01"
 * @param {string} collectionName timetable collection
 */
async function deleteUserClass(
  openid,
  courseCode,
  semester,
  classId,
  userCollection
) {
  const selectedCourses = await getSelectedCourses(openid, userCollection);
  const courseIndex = selectedCourses[semester].findIndex(
    (course) => course.courseCode === courseCode
  );
  const afterDeleted = selectedCourses[semester][courseIndex].classes.filter(
    (cl) => cl._id !== classId
  );
  selectedCourses[semester][courseIndex].classes = afterDeleted;
  // 更新class list
  return await db
    .collection(userCollection)
    .where({
      _openid: openid,
    })
    .update({
      data: {
        selectedCourses: selectedCourses,
      },
    });
}

async function deleteWholeSemester(openid, semester, userCollection) {
  let selectedCourses = await getSelectedCourses(openid, userCollection);
  // delete selectedCourses.`${semester}`
  selectedCourses[semester] = [];
  return await db
    .collection(userCollection)
    .where({
      _openid: openid,
    })
    .update({
      data: {
        selectedCourses: selectedCourses,
      },
    });
}

const generateRandomIndex = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};

const shuffule = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

/**
 * analyse the calendar information which read from the stream, return an array of the class time
 * @param {*} calender
 */
function _analyseData(calender) {
  const coursesTime = [];
  const classes = [];
  calender.forEach((element) => {
    const descriptionValue = element.description.value;
    if (descriptionValue.indexOf("zoom.us") !== -1) {
      return;
    }
    const { _id, subject_code, activity_group_code } = getDetailedClassId(
      element.description.value
    );
    const { dtstart, dtend } = element;
    const startTimeRaw = getClassTimeTest(dtstart.value, dtstart.params.tzid);
    const endTimeRaw = getClassTimeTest(dtend.value, dtend.params.tzid);
    const duration = computeDuration(startTimeRaw, endTimeRaw);
    const startTime = startTimeRaw.format("HH:mm");
    const activityDay = startTimeRaw.format("D/M/YYYY");
    const weekdayNumber = WEEKDAY_MAPPER[startTimeRaw.isoWeekday()];
    if (classes.includes(_id)) {
      coursesTime[coursesTime.length - 1].activitiesDays.push(activityDay);
    } else {
      classes.push(_id);
      const classTimeItem = {
        _id: _id,
        location: element.location.value,
        activitiesDays: [activityDay],
        start_time: startTime,
        duration: duration,
        day_of_week: weekdayNumber,
        activity_group_code: activity_group_code,
        subject_code: _id,
      };
      coursesTime.push(classTimeItem);
    }
  });
  const newRes = {};
  for (let i = 0; i < coursesTime.length; i++) {
    const item = coursesTime[i];
    const classCode = getCourseCode(item["_id"]);
    if (newRes[classCode] === undefined) {
      newRes[classCode] = [];
    }
    item["subscribed"] = true;
    newRes[classCode].push(item);
  }
  return newRes;
}

/**
 * send the request based on the calendar url, and store the analysed information to db
 * @param {*} openid
 * @param {*} timetableLink
 * @param {*} userCollection
 */
async function autoAddTimetable(openid, timetableLink, branch) {
  return requestPromise(timetableLink).then(async (req) => {
    const parsed = ical.parseString(req);
    const events = parsed.events;
    const data = _analyseData(events);
    const res = [];
    shuffule(RANDOM_COLORS);
    const numOfCourses = Object.keys(data).length;
    let colors = RANDOM_COLORS.slice(0, numOfCourses);
    await Promise.all(
      Object.keys(data).map(async (key, index) => {
        let classes = data[key];
        let selectedColor = colors[index];
        // 按照add-class规则添加字段
        classes.map((_class) => {
          _class["background"] = selectedColor;
          _class["remark"] = "";
        });
        // 手动构建selectedCourses
        res.push({
          classes: classes,
          courseCode: key,
          results: [],
        });
      })
    );
    const currentSelectedCourses = await getSelectedCourses(
      openid,
      branch + MAIN_USER_SUFFIX
    );
    // 覆盖本学期已经添加的所有课程
    currentSelectedCourses[CURRENT_SEMESTER] = res;
    // console.log(currentSelectedCourses)
    const finalRes = await db
      .collection(branch + MAIN_USER_SUFFIX)
      .where({
        _openid: openid,
      })
      .update({
        data: {
          selectedCourses: currentSelectedCourses,
        },
      });
    return currentSelectedCourses;
  });
}

async function fetchCurrentSemester(openid, collectionName) {
  const res = await db
    .collection(collectionName)
    .where({
      _openid: openid,
    })
    .get();
  return res.data[0].currentSemester;
}

async function updateCurrentSemester(openid, collectionName, currentSemester) {
  const res = await db
    .collection(collectionName)
    .where({
      _openid: openid,
    })
    .update({
      data: {
        currentSemester: currentSemester,
      },
    });
  return res;
}

// 云函数入口函数
exports.main = async (event, context) => {
  // var branch = event.branch
  // var method = event.method
  const { branch, method } = event;
  if (branch == undefined || method == undefined) {
    return {
      data: "缺少必须的元素",
    };
  }
  const { openid } = event;
  // let openid = ''
  //   const wxContext = cloud.getWXContext()
  //   // branch: USYD / UMEL
  //   switch (branch) {
  //       case "UQ":
  //           openid = wxContext.OPENID;
  //           break;
  //       default:
  //           openid = wxContext.FROM_OPENID;
  //           break
  //   }
  var semester = event.semester == undefined ? "" : event.semester;
  if (method == "fetchCourseInfo") {
    return await fetchCourseInfo(
      branch + TIMETABLE_USER_SUFFIX,
      event.courseId
    );
  }

  const userCollection = branch + MAIN_USER_SUFFIX;
  if (method == "appendUserClasses") {
    return await appendUserClasses(event);
  }
  if (method == "fetchToday") {
    return await fetchToday(openid, branch);
  }

  if (method == "fetchUserClasses") {
    return await fetchUserClasses(openid, branch, semester);
  }
  if (method == "updateUserClass") {
    return await updateUserClasses(event, userCollection);
  }

  if (method == "getSelectedCourses") {
    return await getSelectedCourses(openid, userCollection);
  }
  if (method == "addSelectedCourses") {
    var course = event.course;
    var semester = event.semester;
    return await addSelectedCourses(openid, userCollection, course, semester);
  }
  if (method == "deleteSelectedCourse") {
    const { courseCode, semester } = event;
    return await deleteSelectedCourse(
      openid,
      userCollection,
      courseCode,
      semester
    );
  }

  if (method === "deleteUserClass") {
    const { openid, courseCode, semester, classId } = event;
    return await deleteUserClass(
      openid,
      courseCode,
      semester,
      classId,
      userCollection
    );
  }

  if (method == "deleteWholeSemester") {
    const { openid, semester } = event;
    return await deleteWholeSemester(openid, semester, userCollection);
  }

  if (method == "autoAddTimetable") {
    const { openid, timetableLink } = event;
    return await autoAddTimetable(openid, timetableLink, branch);
  }
  const { currentSemester } = event;
  if (method == "fetchCurrentSemester") {
    return await fetchCurrentSemester(openid, userCollection);
  }
  if (method == "updateCurrentSemester") {
    return await updateCurrentSemester(openid, userCollection, currentSemester);
  }
};
