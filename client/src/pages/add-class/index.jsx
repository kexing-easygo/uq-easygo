import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import NavBar from '../../components/navbar'
import ColorPicker from '../../components/timetable/color-picker'
import BackTop from '../../components/back-top'
import { searchCourseTime, appendClass } from '../../services/course'
import { AtSearchBar, AtCheckbox, AtButton } from 'taro-ui'
import { getDuplicateCourse } from '../../utils/courses'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { CURRENT_SEMESTER } from '../../utils/constant'

export default function AddClass() {
  const [courseCode, setCourseCode] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');

  const dispatch = useDispatch();
  const { currentClasses } = useSelector(state => state.course);

  const handleSearchCourse = async () => {
    if (courseCode.length === 0)
      return Taro.showToast({ title: '请输入课程代码', icon: 'none' });
    const searchRes = await searchCourseTime(courseCode.toUpperCase(), CURRENT_SEMESTER, 'Internal');
    console.log('add class page', searchRes)
    setSessions(searchRes);
  }

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
    if (duplica.length > 0) {
      Taro.showToast({
        title: `${duplica.join(',')}已被添加过了~`,
        icon: "none",
      })
      return;
    }
    // 将选择的背景色添加到课程JSON中
    const _classes = selectedSessions.map(session => ({
      _id: session._id,
      background: selectedColor,
      remark: ''
    }))
    const data = {
      courseCode: courseCode,
      classes: _classes
    }
    // 调用云函数储存课程
    dispatch(appendClass(data));
  }

  return (
    <View>
      <NavBar title="添加课程" backIcon />
      <AtSearchBar
        actionName="搜索"
        showActionButton
        placeholder="CSSE1001"
        value={courseCode}
        onChange={(value) => setCourseCode(value)}
        onActionClick={handleSearchCourse}
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
