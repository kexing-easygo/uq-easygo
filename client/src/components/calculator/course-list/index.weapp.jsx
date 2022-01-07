import React, { useState, useEffect, memo } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAssessments } from '../../../services/calculator'
import { setSearchedCourse, setSearchedSemester } from '../../../features/calculator-slice'
import './index.less'

function CourseList(props) {

  const dispatch = useDispatch();
  const { selectedCourses } = useSelector(state => state.course);
  const [opens, setOpens] = useState([]);

  useEffect(() => {
    setOpens(new Array(Object.keys(selectedCourses).length).fill(false));
  }, [selectedCourses]);

  const toggleAccordion = (value, i) =>
    setOpens(opens.map((open, j) => j === i ? value : open));

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
    <View>
      {Object.keys(selectedCourses).map((semester, i) => {
        console.log(`"在course-list选择的学期: ${semester}"`)
        if (!selectedCourses[semester]) return null;
        return (
          <AtAccordion
            open={opens[i]}
            onClick={(value) => toggleAccordion(value, i)}
            title={semester}
          >
            <AtList hasBorder={false}>
              {selectedCourses[semester].map(course =>
                <AtListItem
                  title={course.courseCode}
                  arrow='right'
                  onClick={() => checkScore(semester, course.courseCode)}
                />)}
            </AtList>
          </AtAccordion>
        )
      })}
    </View>
  )
}

export default memo(CourseList);