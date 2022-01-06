import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { useDispatch } from 'react-redux'
import './index.less'
import { debounce } from '../../../utils/opt'

export default function ReviewSearcher(props) {
  const dispatch = useDispatch();
  const [courseCode, setCourseCode] = useState("CSSE1001")
  const handleSearchCourse = async () => {}
  return (
    <View className='selector-container'>
      <View className='course-selector input-element'>
        <Input
          className='review-input'
          type='text'
          value={courseCode}
          placeholder={'课程代码'}
          onInput={event => setCourseCode(event.target.value.toUpperCase())}
        />
        <View
          className='icon-btn'
          onClick={debounce(handleSearchCourse, 1000)}
        >GO</View>
      </View>
    </View>
  )
}
