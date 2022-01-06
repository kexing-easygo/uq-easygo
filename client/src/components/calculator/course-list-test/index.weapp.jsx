import { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { AtButton } from 'taro-ui'
import { View } from '@tarojs/components'
import { setSearchedCourse, setSearchedSemester } from '../../../features/calculator-slice'
import { fetchAssessments } from '../../../services/calculator'

import './index.less'

function CourseListTest(props) {
  const dispatch = useDispatch();
  const {selectedCourses} = useSelector(state => state.course)
  const semester = props.semester

  const checkScore = async (semester, courseCode) => {
    const params = {
      course: courseCode,
      semester: semester
    }
    dispatch(setSearchedSemester(semester));
    dispatch(setSearchedCourse(courseCode));
    dispatch(fetchAssessments(params));
  }
  return (
    <View className='course-list-wrapper'>
      {selectedCourses[semester].map(course => {
        return (
          <AtButton 
            type='secondary'
            onClick={() => checkScore(semester, course.courseCode)}>
            {course.courseCode}
          </AtButton>
        )
      })}
    </View>
  )
}

export default memo(CourseListTest)