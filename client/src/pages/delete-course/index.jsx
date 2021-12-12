import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtCheckbox } from "taro-ui"
import NavBar from '../../components/navbar'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { deleteCourses } from '../../services/course'

export default function DeleteCourse() {

  const dispatch = useDispatch();
  const { selectedCourses } = useSelector(state => state.course);
  const [options, setOptions] = useState([]);
  const [checkedCourse, setCheckedCourse] = useState([]);
  let semester = Taro.$instance.router.params.semester;

  useEffect(() => {
    const _options = selectedCourses[semester].map(course => ({
      value: course.courseCode,
      label: course.courseCode,
    }))
    setOptions(_options);
  }, [])

  return (
    <>
      <NavBar title="课程管理" backIcon />
      <AtCheckbox options={options} selectedList={checkedCourse} onChange={setCheckedCourse} />
      <View className='delete-btn'>
        <AtButton
          onClick={() => dispatch(deleteCourses({ courses: checkedCourse, semester: semester }))}
          type='secondary'
          customStyle={{
            color: '#FA5151',
            border: '1px solid #FA5151',
            backgroundColor: 'transparent'
          }}
        >
          删除
        </AtButton>
      </View>
    </>
  )
}
