import React, { useState, useEffect, memo } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAccordion, AtList, AtListItem } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAssessments } from '../../../services/calculator'
import { setSearchedCourse } from '../../../features/calculator-slice'

function CourseList(props) {

  const dispatch = useDispatch();
  const { currentClasses } = useSelector(state => state.course);
  const [opens, setOpens] = useState([]);
  const selectedCourse = {
    'Semester 2, 2021': ['AMME5060', 'BMET5790', 'CSYS5040'],
    'Semester 1, 2021': ['XXXX', 'XXXX', 'XXXX'],
    'Semester 1, 2022': ['COMP9444', 'COMP9417', 'COMP9900'],
  }

  useEffect(() => {
    setOpens(new Array(Object.keys(selectedCourse).length).fill(false));
  }, [currentClasses]); // should be selectedCourse

  const toggleAccordion = (value, i) =>
    setOpens(opens.map((open, j) => j === i ? value : open));

  const checkScore = async (semester, courseCode) => {
    const params = {
      courseCode: courseCode,
      semester: semester
    }
    dispatch(setSearchedCourse(courseCode));
    dispatch(fetchAssessments(params));
  }

  return (
    <View>
      {Object.keys(selectedCourse).map((semester, i) =>
        <AtAccordion
          open={opens[i]}
          onClick={(value) => toggleAccordion(value, i)}
          title={semester}
        >
          <AtList hasBorder={false}>
            {selectedCourse[semester].map(course =>
              <AtListItem
                title={course}
                arrow='right'
                onClick={() => checkScore(semester, course)}
              />)}
          </AtList>
        </AtAccordion>)
      }
    </View>
  )
}

export default memo(CourseList);