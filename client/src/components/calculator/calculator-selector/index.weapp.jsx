import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { fetchAssessments } from '../../../services/calculator'
import { useDispatch, useSelector } from 'react-redux'
import './index.less'
import { setSearchedCourse } from '../../../features/calculator-slice'
import { debounce } from '../../../utils/opt'
import CourseListTest from '../course-list-test'
import {SEARCHBAR_DEFAULT_PLACEHOLDER} from '../../../config.json'
/**
 * 计算器中选择学期和课程代码
 * @param {object} props 
 */
export default function CalculatorSelector(props) {

  const dispatch = useDispatch();
  const { currentSemester } = useSelector(state => state.course)
  const [courseCode, setCourseCode] = useState("");
  const semester = currentSemester
  const handleSearchAssessment = async () => {
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
      <View className='course-selector input-element'>
        <Input
          className='calculator-input'
          type='text'
          value={courseCode}
          placeholder={SEARCHBAR_DEFAULT_PLACEHOLDER}
          onInput={event => setCourseCode(event.target.value.toUpperCase())}
          onConfirm={debounce(handleSearchAssessment, 500)}
        />
        <View
          className='icon-btn'
          onClick={debounce(handleSearchAssessment, 500)}
        >GO</View>
      </View>
      <CourseListTest semester={semester} />
    </View>
  )
}
