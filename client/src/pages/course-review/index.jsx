import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedCourse, setTurnPage } from "../../features/review-slice";
import { AtList, AtListItem, AtSearchBar, AtModalAction} from "taro-ui"
import { AtModalContent, AtModalHeader, AtModal, AtButton} from "taro-ui"
import { debounce } from "../../utils/opt";
import { fetchReviews, fetchHotResearches, fetchCourseInfo } from "../../services/review";
import { getUserProfile } from '../../services/login'


export default function Review() {
  const dispatch = useDispatch();
  const [courseCode, setCourseCode] = useState(''); // 搜索框输入的课程代码
  const { hotCourses, turnPage } = useSelector(state => state.review);
  const { selectedCourses } = useSelector(state => state.course);
  const { loginStatus } = useSelector(state => state.user);
  let courses = []; // 猜你想搜 列表 = 选课 + 热搜课
  const [showModal, setShowModal] = useState(!loginStatus); // 有无登录
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
  const handleSearchCourse = async () => {
    if (handleLoginStatus()) {
      if (courseCode.length == 0 ) {
        await Taro.showToast({
          title: "请输入课程代码",
          icon: "none"
        })
        return;
      } 
      getData(courseCode.slice().replace(/ /g,''));
  }}

  // 处理点击的热搜课程
  const handleClickCourse = async (value) => {
    if (handleLoginStatus())
    getData(value);
  }
  
  // 设定为搜索课程 获取相应的课评，课程信息等
  const getData = (course) => {
    const param = {
      courseCode: course,
    }
    dispatch(setSearchedCourse(course));
    dispatch(fetchCourseInfo(param));
    dispatch(fetchReviews(param));
    setCourseCode('');
  }

   // 没登录 展示提示
  const handleLoginStatus = () => {
    if (!loginStatus) {
      setShowModal(true);
      return false;
    }
    return true;
  }

  useEffect(() => {
    dispatch(fetchHotResearches());
  }, [])
  
  // 跳转页面  课程信息, 课评 全都获取到 才可以
  useEffect(() => {
    if (turnPage.length == 2) {
      Taro.navigateTo({ url: '/pages/review-result/index' });
      dispatch(setTurnPage());
    };
  })

  return (
    <View className='selector-container'>
      <NavBar title="课评" backIcon />
      <View className='top-background'>
      <AtSearchBar className='search' 
        placeholder='输入课程代码'
        actionName='搜索'
        value={courseCode}
        onChange={(value) => {setCourseCode(value.toUpperCase())}}
        onActionClick={debounce(handleSearchCourse, 1000)} />
      </View>
      {/*
      <View className='course-selector input-element'>
        <Input className='review-input' type='text' value={courseCode} placeholder={'课程代码'}
          onInput={event => setCourseCode(event.target.value.toUpperCase())}
          onBlur={e => dispatch(setSearchedCourse(courseCode))} />
        <View className='icon-btn' onClick={debounce(handleSearchCourse, 1000)}> GO </View>
      </View>
      */}
      <View className='courseSuggestion'>
        <Text className='title-icon'>I</Text>
        <Text className='title'>猜你想搜</Text>
        <AtList className='course-top' hasBorder={false} >
          {courseList(), courses.map((value) => {
            return(
              <AtListItem className='course-list' 
              title={value} hasBorder={false} arrow='right'
              onClick={() => {debounce(handleClickCourse(value), 1000)}} />
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