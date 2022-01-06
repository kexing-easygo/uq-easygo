import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { fetchAssessments } from '../../../services/calculator'
import { useDispatch, useSelector } from 'react-redux'
import './index.less'
import { setSearchedCourse } from '../../../features/calculator-slice'
import { debounce } from '../../../utils/opt'
import SemesterSelector from '../../semesters-selector'
import CourseListTest from '../course-list-test'
import {SEARCHBAR_DEFAULT_PLACEHOLDER, CURRENT_SEMESTER} from '../../../config.json'
/**
 * 计算器中选择学期和课程代码
 * @param {object} props 
 */
export default function CalculatorSelector(props) {

  const dispatch = useDispatch();
  const { currentSemester } = useSelector(state => state.course)
  // const [semester, setSemester] = useState(CURRENT_SEMESTER); // 默认值应为当前学期
  const [courseCode, setCourseCode] = useState(SEARCHBAR_DEFAULT_PLACEHOLDER);
  // const [toggleActionSheet, setToggleActionSheet] = useState(false);
  const semester = currentSemester
  const handleSearchAssessment = async () => {
    // if (semester.length === 0) {
    //   await Taro.showToast({
    //     title: "请选择学期",
    //     icon: "none"
    //   })
    //   return;
    // }
    if (courseCode.length === 0) {
      await Taro.showToast({
        title: "请填写课程代码",
        icon: "none"
      })
      return;
    }
    const params = {
      course: courseCode,
      semester: semester
    }
    dispatch(setSearchedCourse(courseCode));
    dispatch(fetchAssessments(params));
  }

  return (
    <View className='selector-container'>
      {/* <View className='semester-selector input-element'>
        <Input
          className='calculator-input'
          placeholder={'Semester 2, 2021'}
          value={semester}
          disabled
        />
        <View
          className='icon-btn'
          onClick={() => setToggleActionSheet(true)}>
          <AtIcon className="at-fab__icon at-icon at-icon-menu"></AtIcon>
        </View>
      </View> */}

      <View className='course-selector input-element'>
        <Input
          className='calculator-input'
          type='text'
          value={courseCode}
          placeholder={'课程代码'}
          onInput={event => setCourseCode(event.target.value.toUpperCase())}
        />
        <View
          className='icon-btn'
          onClick={debounce(handleSearchAssessment, 1000)}
        >GO</View>
      </View>
      {/* <SemesterSelector
        isOpened={toggleActionSheet}
        setOpened={setToggleActionSheet}
        semester={semester}
        setSemester={setSemester}
      /> */}
      <CourseListTest semester={semester} />
    </View>
  )
}
