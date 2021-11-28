import React, { memo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import SessionModal from '../session-modal';
import { useSelector, useDispatch } from 'react-redux'
import { logo } from '../../../assets/images/profile.json'
import './index.less'
import { updateClashes } from '../../../features/course-slice';

export default memo(function CourseTable(props) {
  const dispatch = useDispatch();
  const { availCourses } = useSelector(state => state.course);
  useEffect(() => dispatch(updateClashes([...availCourses])), [availCourses]);

  return (
    <View className="course-table-view" id="course-container" >
      {availCourses.length === 0 &&
        <>
          <Image src={logo} mode="widthFix" />
          <Text className='info-text'>本周无课</Text>
        </>}
      {availCourses.map(session =>
        <SessionModal key={`${session._id}`} sessionInfo={session} />)}
    </View>
  )
})
