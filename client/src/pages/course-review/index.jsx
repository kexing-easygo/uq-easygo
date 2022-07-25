import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedCourse, setTurnPage, setRelevantCourse } from "../../features/review-slice";
import { AtList, AtListItem, AtSearchBar, AtModalAction, AtIcon} from "taro-ui"
import { AtModalContent, AtModalHeader, AtModal, AtButton} from "taro-ui"
import { debounce } from "../../utils/opt";
import { fetchReviews, fetchHotResearches, fetchCourseInfo, searchCourses } from "../../services/review";
import { getUserProfile } from '../../services/login'


export default function Review() {
  const dispatch = useDispatch();
  const [courseCode, setCourseCode] = useState(''); // 搜索框输入的课程代码
  const { hotCourses, relevantCourse, searchedCourse } = useSelector(state => state.review);
  const { selectedCourses } = useSelector(state => state.course);
  const { loginStatus } = useSelector(state => state.user);
  let courses = []; // 猜你想搜 列表 = 选课 + 热搜课
  const [showModal, setShowModal] = useState(!loginStatus); // 有无登录
  const [showAutocomplete, setAutocomplete] = useState('none'); // 是否展示联想框
  const modalContent = { // 登录提示框 
    title: '尚未登录', 
    onConfirm: () => {
      dispatch(getUserProfile());
      setShowModal(false);
    },
    content: '登录体验更多功能~',
    confirmText: '立即登录'
  };
  
  // 热搜课程列表 
  const courseList = () => {
    // 已选课
    Object.keys(selectedCourses).map(semester => {
      for (let i=0; i<selectedCourses[semester].length; i++) {
        if (courses.length < 10) {
          courses.push(selectedCourses[semester][i].courseCode);
        } else {
          return;
    }}})
    // 热搜课
    hotCourses.map((value) => {
      if (courses.length < 10) {
        if (courses.indexOf(value.courseCode) == -1) {
          courses.push(value.courseCode);
      }} else {
        return;
  }})}

  // 处理搜索的课程
  const handleSearchCourse = () => {
    dispatch(setRelevantCourse([]));
    if (handleLoginStatus()) {
      const param = {
        payload: courseCode,
      }
    dispatch(searchCourses(param));
    setAutocomplete('block');
  }}

  // 处理点击的热搜课程
  const handleClickCourse = (value) => {
    if (handleLoginStatus())
    getData(value);
  }
  
  // 设定为搜索课程 获取相应的课评，课程信息等
  const getData = (course) => {
    const param = {
      courseCode: course,
    }
    dispatch(setSearchedCourse(course));
    // dispatch(fetchCourseInfo(param));
    dispatch(fetchReviews(param));
    setCourseCode('');
    setAutocomplete('none');
  }

   // 没登录 展示提示
  const handleLoginStatus = () => {
    if (!loginStatus) {
      setShowModal(true);
      return false;
    }
    return true;
  } 

  return (
    <View className='selector-container'>
      <NavBar title="课评" backIcon />
      <View className='top-background'>
        <AtSearchBar className='search' 
          placeholder='输入课程代码'
          actionName='搜索'
          value={courseCode}
          onChange={(value) => {setCourseCode(value.toUpperCase());setAutocomplete('none');}}
          onActionClick={debounce(handleSearchCourse, 1000)}
          />
      </View>

      <View className='autocomplete' style={{display:showAutocomplete}}>
        <View style={{display:(searchedCourse? 'none':'block')}}>
          <Text className='no-course'>暂无相关课程</Text>
        </View>
        {relevantCourse.map((courseCode) => {
          return ( 
            <View>
              <Text className='title' onClick={() =>{debounce(handleClickCourse(courseCode), 1000)}}>{courseCode}</Text>
            </View>
        )})}
      </View>

      <View className='courseSuggestion'>
        <View className = 'guess-background'>
          <View className='blue-block'></View>
          <Text className='title'>猜你想搜</Text>
        </View>
        <AtList className='course-top' hasBorder={false} >
          {courseList(), courses.map((value) => {
            return(
              <AtListItem className='course-list' 
              title={value} hasBorder={false} arrow='right'
              onClick={() => {debounce(handleClickCourse(value), 1000);setAutocomplete('none');}} />
          )})}
        </AtList>
      </View>
      
      <AtModal isOpened={showModal} onClose={() => setShowModal(false)}>
        <AtModalHeader>{modalContent.title}</AtModalHeader>
        <AtModalContent>{modalContent.content}</AtModalContent>
        <AtModalAction>
          <AtButton full circle type='primary' size='small' customStyle={{ margin: '24rpx' }}
            onClick={modalContent.onConfirm}>
            {modalContent.confirmText}
          </AtButton>
        </AtModalAction>
      </AtModal>
    </View>
)}