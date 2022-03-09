import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'
import { useSelector } from 'react-redux'
import Divider from '../divider'

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
    <View className='course-card'>
      <View className='title-background'>
        <Text className='title-course'>{handleInfo(unit_name)}</Text>
      </View>
      <View className='lines'>
        <Text className='title'>Credits</Text>  
        <View className='contents'>
          <Text className='content'>{handleInfo(credits)}</Text>
        </View>
      </View>
      <Divider width='100%' />
      <View className='lines'>
        <Text className='title'>Mode</Text>  
        <View className='contents'>
          <Text className='content'>{handleInfo(attandence_mode)}</Text>
        </View>
      </View>
      <Divider width='100%' />
      <View className='lines'>
        <Text className='title'>Semester(s)</Text>  
        <View className='contents'>
          <Text className='content'>
            {handleInfo(semester_available)=='Not available'? 'Not available':changeSemester()}
          </Text>
        </View>
      </View>
      <View className='note-background'>
        <View className='note'><Text>更多详情请参考官方ECP</Text></View>
      </View>
    </View>
  )
}