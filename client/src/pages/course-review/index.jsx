import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHotResearches, fetchReviews } from "../../services/review";
import { setSearchedCourse } from "../../features/review-slice";
import { AtList, AtListItem } from "taro-ui"
import { debounce } from "../../utils/opt";

export default function Review() {
  const dispatch = useDispatch()
  const [courseCode, setCourseCode] = useState("CSSE1001")
  const { hotCourses } = useSelector(state => state.review)
  useEffect(() => {
    dispatch(fetchHotResearches())
  }, [])
  const handleSearchCourse = async () => {
    if (courseCode.length == 0) {
      await Taro.showToast({
        title: "请输入课程代码",
        icon: "none"
      })
      return;
    }
    const params = {
      courseName: courseCode,
    }
    dispatch(setSearchedCourse(courseCode));
    dispatch(fetchReviews(params))
  }

  return (
    <View className='selector-container'>
      <NavBar title="课评" backIcon />
      <View className='course-selector input-element'>
        <Input
          className='review-input'
          type='text'
          value={courseCode}
          placeholder={'课程代码'}
          onInput={event => setCourseCode(event.target.value.toUpperCase())}
          onBlur={e => dispatch(setSearchedCourse(courseCode))}
        />
        <View
          className='icon-btn'
          onClick={debounce(handleSearchCourse, 1000)}
        >GO</View>
      </View>
      <View>
        猜你想搜
        <AtList>
          {hotCourses.map((value) => {
            return (
              <AtListItem 
                title={value.courseCode} 
                arrow='right' 
                onClick={() => console.log('e')}
                />
            )
          })}
        </AtList>
      </View>
    </View>
  )
}