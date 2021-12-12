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
  let level = '';
  switch (true) {
    case score === 0:
      level = 0;
      break;
    case score < 45:
      level = 'Fail';
      break;
    case score < 50:
      level = 3;
      break;
    case score < 65:
      level = 4;
      break;
    case score < 75:
      level = 5;
      break;
    case score < 85:
      level = 6;
      break;
    case score < 100:
      level = 7;
      break;
    default:
      level = 0;
  }
  return level;
}

/**
 * 获取无重复的课程代码
 * @param {array} courses 
 */
export const getUniqueCourse = courses => Array.from(new Set(courses.map(course => course.subject_code)));

export const getCourseId = (courseCode, semester, classMode, time = 'STLUC') => {
  const _semester = `S${semester[9]}`;
  const _classMode = classMode === 'Internal' ? 'IN' : 'EX';
  return `${courseCode}_${_semester}_${time}_${_classMode}`;
}

export const getClassCode = (classId, branch = BRANCH_NAME) => {
  let classCode = '';
  switch(branch) {
    case 'USYD':
      let res = classId.match(/\|([A-Za-z]{3,})\|(\d{2,})/);
      classCode = `${res[1]} ${res[2]}`;
      break;
    case 'UQ':
      res = classId.split("|")
      classCode = `${res[1]} ${res[2]}`
      break
    default:
      classCode = 'error';
  }
  return classCode;
}