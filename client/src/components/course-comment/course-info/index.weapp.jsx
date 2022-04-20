import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'
import { useSelector } from 'react-redux'

/*
课程信息
*/
export default function CourseInfo() {
  const { courseInfo } = useSelector(state => state.review);
  const {attandence_mode, credits, unit_name, semester_available} = courseInfo;

  // 如果没有Prequisities 显示None
  const changePrequisities = () => {
    if (prequisites == '' || prequisites == null || prequisites == undefined) {
      return 'None';
    } else {
      return prequisites;
    }
  }

  // 处理Lecturer、Faculty、Title、semester  如果没有 显示Not available
  const handleInfo = (value) => {
    if (value == undefined || value == '' || value == null) {
      return 'Not available';
    } else {
      return value;
    }
  }

  // 处理semester格式
  const changeSemester = () => {
    let text = '';
    for (let i=0; i<semester_available.length; i++) {
      text += semester_available[i].substring(0, 10);
      text += ', ';
    }
    return text.substring(0, text.length-2)
  }


  return (
    <View className='course-card-wraper'>
      <View className='course-title'>
        <Text className='title-course'>{handleInfo(unit_name)}</Text>
      </View>
      <View className='course-card'>
        <View className='lines'>
          <View className='line-title'>Credits</View>  
          <View className='line-content'>{handleInfo(credits)}</View>
        </View>
        <View className='lines'>
          <View className='line-title'>Mode</View>  
          <View className='line-content'>{handleInfo(attandence_mode)}</View>
        </View>
        <View className='lines'>
          <View className='line-title'>Semester(s)</View>  
          <View className='line-content'>{handleInfo(semester_available)=='Not available'? 'Not available':changeSemester()}
          </View>
        </View>
        <View className='note'>更多详情请参考官方ECP</View>
      </View>
    </View>
  )
}