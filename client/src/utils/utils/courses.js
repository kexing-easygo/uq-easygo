import { BRANCH_NAME, DAY_OF_WEEK } from './constant';
import { computeEndTime, formatDates, removeZero } from './time'

/**
 * 根据接口返回的有效日期，判断当周是否有课
 * @param {array} courses - 所有的课程
 * @param {date} dates - 日期对象数组
 */
export const computeAvailableCourses = (courses, dates) => {
  if (courses == null || courses.length == 0) return [];
  const formatedDate = formatDates(dates).map(date => removeZero(date));
  const isActive = (activitiesDays, formatedDate) => {
    if (!activitiesDays) return;
    for (let date of formatedDate) {
      if (activitiesDays.includes(date)) return true;
    }
    return false;
  }
  console.log('computing avail', courses)
  const availCourses = courses.filter(course => isActive(course.activitiesDays, formatedDate))
  return availCourses;
}

/**
 * 检查已经添加过的课程
 * @param {array} currentClasses 
 * @param {array} newClasses 
 */
export const getDuplicateCourse = (currentClasses, newClasses) => {
  if (currentClasses == null || newClasses == null) return[];
  const newCoursesId = newClasses.map(newCourse => newCourse._id);
  const duplica = currentClasses.filter(course => newCoursesId.includes(course._id));
  return duplica.map(dup => dup.activity_group_code);
}

/**
 * 用于检测所有课程中发生冲突的两节课，
 * @param {array} currentClasses 
 */
export const computeClashCourses = (currentClasses) => {
  if (currentClasses == null) return[];
  const clashes = [];
  const getTimePoint = startTime => parseInt(startTime.split(":")[0]);
  // 按照开始时间升序排列
  currentClasses.sort((a, b) =>
    DAY_OF_WEEK[a.day_of_week] === DAY_OF_WEEK[b.day_of_week] ?
      getTimePoint(a.start_time) - getTimePoint(b.start_time) : DAY_OF_WEEK[a.day_of_week] - DAY_OF_WEEK[b.day_of_week]);
  for (let i = 1; i < currentClasses.length; i++) {
    if (currentClasses[i].day_of_week !== currentClasses[i - 1].day_of_week) continue;
    let end_time = computeEndTime(currentClasses[i - 1].start_time, currentClasses[i - 1].duration)
    if (getTimePoint(currentClasses[i].start_time) < getTimePoint(end_time)) {
      clashes.push([currentClasses[i]._id, currentClasses[i - 1]._id]);
    }
  }
  return clashes;
}

/**
 * 根据分数获得对应的GPA等级
 * @param {number} score 
 */
export const getGPALevel = score => {
  switch (BRANCH_NAME) {
    case "UMEL":
      if (score < 50) return "F"
      if (score < 65) return "P"
      if (score < 70) return "H3"
      if (score < 75) return "H2B"
      if (score < 80) return "H2A"
      return "H1"
  }
}

/**
 * 获取无重复的课程代码
 * @param {array} courses 
 */
export const getUniqueCourse = courses => Array.from(new Set(courses.map(course => course.subject_code)));

/**
 * 根据校区返回对应上课模式，用于拼接Timetable搜索的关键字
 * @param {mode} mode 上课模式
 */
const transformClassMode = (mode) => {
  switch (BRANCH_NAME) {
    case "UMEL":
      return "U_1"
    case "USYD":
      return mode == "中国境内"? "RE" : "CC"
    case "UQ":
      return mode == "中国境内"? "STLUC_EX" : "STLUC_IN"
    default:
      return ""
  }
}

/**
 * 根据校区返回对应学期编号，用于拼接Timetable搜索的关键字
 * @param {sem} sem 学期编号
 */
const transformSemester = (sem) => {
  switch (BRANCH_NAME) {
    case "UMEL":
      return sem == "Summer Semester" ? "SUM" : "SM1"
    case "USYD":
      return sem == "Summer Semester" ? "S1CIJA-BM" : "S1C-ND"
    case "UQ":
      return "S1"
    default:
      return ""
  }
}
/**
 * 根据课程代码、所在学期和上课模式，拼接发给后端的courseId
 * @param {string} courseCode 课程代码，字母+数字
 * @param {string} semester 所在学期
 * @param {string} classMode 上课模式
 */
export const getCourseId = (courseCode, semester, classMode) => {
  let mode = transformClassMode(classMode)
  let sem = transformSemester(semester)
  switch (BRANCH_NAME) {
    case "UMEL":
      return `${courseCode}_${mode}_${sem}`
    case "USYD":
      return `${courseCode}-${sem}-${mode}`
    case 'UQ':
      return `${courseCode}_${sem}_${mode}`
    default:
      return ""
  }
}

/**
 * 根据classId，解析易理解的class名字
 * @param {string} classId 单节课的classId
 */
export const getClassCode = (classId) => {
  let classCode = '';
  let res = classId.match(/\|([A-Za-z]{3,})(\d?)\|(\d{1,})/);
  classCode = res[2] == "" ? `${res[1]} ${res[3]}` : `${res[1]} ${res[2]}`
  return classCode;
}