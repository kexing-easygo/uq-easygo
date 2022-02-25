import { getLocalOpenId } from './login'
import Taro from '@tarojs/taro'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'
import { CURRENT_SEMESTER } from '../utils/constant'
import { getCourseId } from '../utils/courses'
import { computeEndTime } from '../utils/time'

/*******************************************
 * 变量名约定
 * course表示某节课程，如INFO1113, MATH1005
 * class表示某课程中的小课，如Tut或Lab
 *******************************************/

/**
 * 获取用户已选择过的所有课程
 */
export const fetchCurrentClasses = createAsyncThunk(
  'courses/fetchCurrentClasses',
  async (semester) => {
    console.log('fetcing courses...');
    const _openId = await getLocalOpenId();
    const courses = await callCloud('timetable', 'fetchUserClasses', { openid: _openId, semester: semester });
    return courses.result;
  }
)

export const fetchSelectedCourses = createAsyncThunk(
  'courses/fetchSelectedCourses',
  async () => {
    console.log('fetching selected courses...')
    const selectedCourses = await callCloud('timetable', 'getSelectedCourses', { openid: await getLocalOpenId() });
    console.log('selected', selectedCourses.result);
    return selectedCourses.result;
  }
)

/**
 * 获取当前正在上的课以及下一节课
 */
export const getTodayCourses = async () => {
  try {
    const openId = await getLocalOpenId();
    const res = await callCloud('timetable', 'fetchToday', { openid: openId });
    console.log("获取当前课程完成，为: ", res.result)
    return res.result;
  } catch (err) {
    console.log('获取当前课程失败', err);
    return [];
  }
}

/**
 * 根据用户输入的课程代码搜索课程相关信息，获取可选择的session
 * 返回结果为所有session的数组
 * 
 * 传入option的格式必须为JSON数组，包含value, label和desc
 * label为实际显示的内容，value为选择的值
 * 
 * @param {string} courseCode 
 */
export const searchCourseTime = async (courseCode, semester, classMode) => {
  await Taro.showToast({
    title: "搜索中",
    icon: "loading",
    duration: 5000
  })
  let courseTime = []
  try {
    const _courseId = getCourseId(courseCode, semester, classMode);
    console.log('course id', _courseId);
    const searchRes = await callCloud('timetable', 'fetchCourseInfo', { courseId: _courseId });
    console.log('search course res: ', searchRes);
    Taro.hideToast() // 搜索完成关闭Loading
    // 处理数据格式
    courseTime = Object.keys(searchRes.result).map(classId => {
      let classInfo = searchRes.result[classId];
      let _activityGroupCode = `${classInfo.activity_group_code}_${classInfo.activity_code}`;
      let _activitiesDays = classInfo.activitiesDays;
      let _location = classInfo.location;
      let _dayOfWeek = classInfo.day_of_week;
      let _startTime = classInfo.start_time;
      let _duration = classInfo.duration;
      let _endTime = computeEndTime(_startTime, _duration);
      // session model中需要的字段信息
      return {
        "value": {
          "_id": classId,
          "subject_code": courseCode,
          "activity_group_code": _activityGroupCode,
          "location": _location,
          "day_of_week": _dayOfWeek,
          "start_time": _startTime,
          "end_time": _endTime,
          "duration": _duration,
          "activitiesDays": _activitiesDays
        },
        "label": `${_activityGroupCode} ${_dayOfWeek} ${_startTime}-${_endTime}`,
        "desc": `Location: ${_location}`
      }
    });
  } catch (err) {
    console.log(err);
    Taro.showToast({
      title: "没有找到这门课哦，请重新搜素或者联系我们~",
      icon: "none",
    })
  }
  return courseTime;
}

/**
 * 添加新的class，携带学期，课程代码，需要添加的classID
 * 以及用户自定义的背景颜色和备注
 * @param {array} classes 将要添加的课程list
 */
export const appendClass = createAsyncThunk(
  'courses/appendClass',
  async ({ courseCode, classes, semester }) => {
    const args = {
      openid: await getLocalOpenId(),
      semester: semester,
      courseCode: courseCode.toUpperCase(),
      classes: classes
    }
    const appendRes = await callCloud('timetable', 'appendUserClasses', args);
    return appendRes.result;
  }
)

/**
 * 根据classId删除学期中该course的某节class
 * @param {string} courseCode
 * @param {string} classId
 * @param {string} semester
 */
export const deleteClass = createAsyncThunk(
  'courses/deleteClass',
  async ({ courseCode, classId, semester }) => {
    const args = {
      openid: await getLocalOpenId(),
      semester: semester,
      courseCode: courseCode.toUpperCase(),
      classId: classId
    }
    await callCloud('timetable', 'deleteUserClass', args);
    return classId;
  }
)

export const updateClass = createAsyncThunk(
  'courses/updateClass',
  async ({ courseCode, semester, classInfo }, { getState }) => {
    const { currentClasses } = getState().course;
    const args = {
      openid: await getLocalOpenId(),
      course: courseCode,
      semester: semester,
      classInfo: classInfo
    }
    await callCloud('timetable', 'updateUserClass', args);
    const updated = {
      ...currentClasses.find(cl => cl._id === classInfo._id),
      ...classInfo
    }
    return updated;
  }
)

/**
 * 删除某学期选中的course，
 * 更新selectedCourses，可能需要更新currentClasses
 */
export const deleteCourses = createAsyncThunk(
  'courses/deleteCourses',
  async ({ courses, semester }) => {
    const openId = await getLocalOpenId();
    await Promise.all(courses.map(courseCode => {
      const params = {
        openid: openId,
        courseCode: courseCode,
        semester: semester
      }
      return callCloud('timetable', 'deleteSelectedCourse', params);
    }));
    return { courses, semester }
  }
)

export const deleteSemester = createAsyncThunk(
  'courses/deleteSemester',
  async (semester) => {
    const res = await callCloud('timetable', 'deleteWholeSemester', {
      openid: await getLocalOpenId(),
      semester: semester
    });
    return semester;
  }
)

export const fetchCurrentSemester = createAsyncThunk(
  "course/fetchCurrentSemester",
  async () => {
    try {
      const _openId = await getLocalOpenId();
      const res = await callCloud('timetable', 'fetchCurrentSemester', { 
        openid: _openId 
      });
      return res.result;
    } catch (err) {
      console.log('获取当前学期失败', err);
      return "Summer Semester"
    }

  }
)

export const updateCurrentSemester = createAsyncThunk(
  'courses/updateCurrentSemester',
  async (sem) => {
    const _openId = await getLocalOpenId();
    try {
      await callCloud('timetable', 'updateCurrentSemester', {
        openid: _openId,
        currentSemester: sem
      })
      return sem
    } catch (err) {
      console.log(err)
      return "Summer Semester"
    }
  }
)