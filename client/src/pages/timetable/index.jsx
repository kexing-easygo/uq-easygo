import React, { useState, useEffect, useMemo } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton, AtFab, AtModalAction, AtModalContent, AtModalHeader, AtNoticebar } from 'taro-ui'
import NavBar from '../../components/navbar'
import TimeBar from '../../components/timetable/time-bar'
import AllWeeks from '../../components/timetable/all-weeks'
import WeekDays from '../../components/timetable/week-days'
import CourseTable from '../../components/timetable/course-table'
import SessionDetails from '../../components/timetable/session-details'
import { getDates, formatDates, getCurrentWeek, getDatesByWeek } from '../../utils/time'
import { useSelector, useDispatch } from 'react-redux'
import { getAvailableCourse } from '../../features/course-slice'
import { getUserProfile } from '../../services/login'
import { AtModal } from "taro-ui"
import './index.less'
import { AU_TIME_ZONE } from '../../utils/constant'
import { fetchCurrentClasses } from '../../services/course'

export default function TimeTable() {

  const dispatch = useDispatch();
  const { currentClasses, currentSemester, startDate } = useSelector(state => state.course);
  const CURRENT_SEMESTER = currentSemester
  const { loginStatus, classMode } = useSelector(state => state.user);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [dates, setDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showModal, setShowModal] = useState(!loginStatus || classMode === '');
  const [modalContent, setModalContent] = useState({
    title: '尚未登录',
    onConfirm: () => {
      dispatch(getUserProfile());
      setShowModal(false);
    },
    content: '登录体验更多功能~',
    confirmText: '立即登录'
  });

  /**
   * 课程表的初始化
   */
  const initialize = async () => {
    // 根据当前日期计算课程表日期和月份
    let today = new Date();
    let currentMonth = today.getMonth() + 1;
    let currentWeek = getCurrentWeek(startDate);
    let _dates = getDates(today);
    let selectedDay = today.getDay() === 0 ? 6 : today.getDay() - 1;
    setCurrentWeek(currentWeek);
    setCurrentMonth(currentMonth);
    setDates(formatDates(_dates, 'mm-dd'));
    setSelectedDay(selectedDay);
  }

  /**
   * 根据用户的登录状态和设置模式展示不同提示
   * @param {funciton} callback 
   */
  const handleLoginStatus = () => {
    if (!loginStatus) {
      setShowModal(true);
      return false;
    } else if (classMode === '') {
      setModalContent({
        title: '尚未设置上课模式',
        onConfirm: () => {
          Taro.navigateTo({ url: '/pages/basic-setting/index' });
          setShowModal(false);
        },
        content: '设置上课模式才能显示对应时区功能哦~',
        confirmText: '立即前往'
      });
      setShowModal(true);
      return false;
    }
    return true;
  }

  // 下拉刷新，重置回当前日期和课程
  usePullDownRefresh(() => {
    initialize();
    if (handleLoginStatus()) dispatch(fetchCurrentClasses(CURRENT_SEMESTER));
  });

  useEffect(() => {
    initialize();
    if (handleLoginStatus()) dispatch(fetchCurrentClasses(CURRENT_SEMESTER));
  }, []);

  // 登录后或上课模式发生变化时，初始化界面，获取日期，周数，月份数以及获取课程
  useEffect(() => initialize(), [classMode]);
  useEffect(() => handleLoginStatus(), [loginStatus]);

  // 切换week时计算对应日期，或添加/删除课程时，展示当周有效课程
  useEffect(() => {
    // 计算该周的日期
    const _dates = getDatesByWeek(currentWeek, startDate);
    setDates(formatDates(_dates, 'mm-dd'));
    setCurrentMonth(_dates[0].getMonth() + 1);
    if (!handleLoginStatus()) return;
    // 计算该周有效课程
    dispatch(getAvailableCourse({ currentClasses: currentClasses, dates: _dates }));
  }, [currentWeek, currentClasses]);

  /**
   * 点击浮动按钮后跳转至课程添加页面
   */
  const handleClickFab = () => {
    if (handleLoginStatus())
      Taro.navigateTo({ url: '/pages/add-class/index' })
  }

  return (
    <View className="container">
      <NavBar title="课程表" backIcon />
      {classMode === '中国境内' && <AtNoticebar
        close
        icon='volume-plus'>
        当前上课时间展示为北京时间哦~
      </AtNoticebar>}
      {classMode === '澳洲境内' && <AtNoticebar
        close
        icon='volume-plus'>
        当前上课时间展示为澳洲当地院校时间哦~
      </AtNoticebar>}
      <AllWeeks currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
      {/* 周一到周五以及对应日期 */}
      <WeekDays selectedDay={selectedDay} dates={dates} currentMonth={currentMonth} />
      <View className="time-course-view">
        {/* 左侧的时间列 */}
        <TimeBar timeZoneStart={classMode === '中国境内' ? (AU_TIME_ZONE === 'AEDT' ? 5 : 6) : 8} />
        {/* 课程表主体 */}
        <CourseTable />
      </View>

      <AtFab className="fab" size="small" onClick={handleClickFab}>
        <Text className="at-fab__icon at-icon at-icon-add"></Text>
      </AtFab>
      <SessionDetails />
      <AtModal
        isOpened={showModal}
        onClose={() => setShowModal(false)}
      >
        <AtModalHeader>{modalContent.title}</AtModalHeader>
        <AtModalContent>
          {modalContent.content}
        </AtModalContent>
        <AtModalAction>
          <AtButton
            full
            circle
            type='primary'
            size='small'
            onClick={modalContent.onConfirm}
            customStyle={{ margin: '24rpx' }}
          >
            {modalContent.confirmText}
          </AtButton>
        </AtModalAction>
      </AtModal>
    </View>
  )
}
