import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import NavBar from '../../components/navbar'
import ColorPicker from '../../components/timetable/color-picker'
import BackTop from '../../components/back-top'
import { searchCourseTime, appendClass } from '../../services/course'
import { AtSearchBar, AtCheckbox, AtButton, AtNoticebar } from 'taro-ui'
import { computeAvailableCourses, getDuplicateCourse } from '../../utils/courses'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { CURRENT_SEMESTER, SEMESTERS, SEARCHBAR_DEFAULT_PLACEHOLDER } from '../../utils/constant'
import SemesterSelector from '../../components/semesters-selector'
import { setCurrentSemester } from '../../features/course-slice'
import { current } from '@reduxjs/toolkit'
export default function AddClass() {
  const [courseCode, setCourseCode] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#FA5151');
  // 兼容两个学期
  // const [semester, setSemester] = useState('Semester 2, 2021'); // 默认值应为当前学期
  // const [toggleActionSheet, setToggleActionSheet] = useState(false);
  // 
  const dispatch = useDispatch();
  const { currentClasses, currentSemester } = useSelector(state => state.course);
  const CURRENT_SEMESTER = currentSemester

  const { classMode } = useSelector(state => state.user);

  const handleSearchCourse = async () => {
    if (courseCode.length === 0)
      return Taro.showToast({ title: '请输入课程代码', icon: 'none' });
    const searchRes = await searchCourseTime(courseCode.toUpperCase(), CURRENT_SEMESTER, classMode);
    console.log('add class page', searchRes)
    setSessions(searchRes);
    // 已经选过的课自动被勾选
    const selectedID = currentClasses.map(c => c._id)
    const sessions = searchRes.filter(course => selectedID.includes(course.value._id))
    setSelectedSessions(sessions.map(c => c.value))
  }

  // useEffect(() => {
  //   setSelectedSessions([])
  // }, [sessions]);

  const handleConfirm = () => {
    if (selectedColor === '') {
      // 提示未选颜色
      Taro.showToast({
        title: "未选择颜色",
        icon: "none",
      })
      return;
    }
    if (selectedSessions.length === 0) {
      // 提示尚未选课
      Taro.showToast({
        title: "尚未选课",
        icon: "none",
      })
      return;
    }
    // 检查课程是否已被添加过
    const duplica = getDuplicateCourse(currentClasses, selectedSessions);
    const _classes = selectedSessions.filter(course => !duplica.includes(course?.activity_group_code)).map(session => ({
      _id: session._id,
      background: selectedColor,
      remark: '',
      activitiesDays: session.activitiesDays,
      start_time: session.start_time
    }))
    // 将选择的背景色添加到课程JSON中
    const data = {
      courseCode: courseCode,
      classes: _classes,
      semester: CURRENT_SEMESTER
    }
    // 调用云函数储存课程
    dispatch(appendClass(data));
    Taro.navigateBack()
  }

  return (
    <View>
      <NavBar title="添加课程" backIcon />
      <AtNoticebar
        close
        icon='volume-plus'>
        当前搜索出来的均为{currentSemester}的课哦～可以在个人中心-基本设置修改所在学期
      </AtNoticebar>
      <AtSearchBar
        actionName="搜索"
        showActionButton
        placeholder={SEARCHBAR_DEFAULT_PLACEHOLDER}
        value={courseCode}
        onChange={(value) => setCourseCode(value.toUpperCase())}
        onActionClick={handleSearchCourse}
        onConfirm={handleSearchCourse}
      />
      <View className="at-row at-row__align--center inner-container">
        <View className="at-col at-col-1 at-col--auto set-color">设置颜色</View>
        <ColorPicker handleSelection={setSelectedColor} />
      </View>
      {sessions.length > 0 &&
        <View>
          <AtCheckbox
            options={sessions}
            selectedList={selectedSessions}
            onChange={(value) => setSelectedSessions(value)}
          />
          <View className="confirm-view">
            <AtButton
              type='primary'
              onClick={handleConfirm}
            >
              确定
            </AtButton>
          </View>
        </View>}
      <BackTop />
    </View>
  )
}
