import React, { memo, useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { AtActivityIndicator, AtCard } from 'taro-ui'
import { useSelector } from 'react-redux'
import { getTodayCourses } from '../../../services/course'
import { alert } from '../../../assets/images/icon.json'
// import { CURRENT_SEMESTER } from '../../../utils/constant'


function TodayCourse(props) {
  const { currentSemester } = useSelector(state => state.course)
  const CURRENT_SEMESTER = currentSemester
  const { loginStatus } = useSelector(state => state.user);
  const { currentClasses, selectedCourses } = useSelector(state => state.course);
  const [currentCourse, setCurrentCourse] = useState([]);
  const [nextCourse, setNextCourse] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  // 若已登录，获取用户信息和今日课程
  useEffect(() => {
    (async () => {
      if (loginStatus) {
        const todayCourse = await getTodayCourses();
        if (todayCourse?.next.length === 0) {
          setIsLoading(false);
          return;
        }
        setNextCourse(todayCourse.next)
      }
      setIsLoading(false);
    })()
  }, [loginStatus])

  const CourseCell = props => {
    const { course } = props;
    return (
      <View className='next-course course-cell'>
        <View className='course-time'>{course.start_time} - {course.end_time}</View>
        <View className='course-info'>
          {`${course.subject_code} ${course.activity_group_code}`}
        </View>
      </View>)
  }

  return (

    <AtCard title='今日课程'>
      <View className='card-content today-course'>
        {isLoading ?
          <View className='course-cell'>
            <AtActivityIndicator
              isOpened={isLoading}
              mode='center'
              content='加载中...'
            ></AtActivityIndicator>
          </View> :
          <View className='following-course-view'>
            {currentCourse.length > 0 &&
              <View className='current-course'>
                <Image src={alert} className='alert-icon' />
                {currentCourse.map(cc =>
                  <View className='course-cell'>
                    <View className='course-time'>{cc.start_time} - {cc.end_time}</View>
                    <View className='course-info'>
                      {`${cc.subject_code} ${cc.activity_group_code}`}
                    </View>
                  </View>)}
              </View>
            }
            {nextCourse.length > 0 &&
              (currentCourse.length === 0 ?
                nextCourse.map(cc => <CourseCell course={cc} />) :
                <CourseCell course={nextCourse[0]} />)}
            {currentCourse.length === 0 && nextCourse.length === 0 &&
              <View className='course-cell info-text'>
                {loginStatus ?
                  (!selectedCourses[CURRENT_SEMESTER] ?
                    '你还没有选课哦，快去课程表添加课程吧' :
                    (selectedCourses[CURRENT_SEMESTER].length === 0 ?
                      '你还没有选课哦，快去课程表添加课程吧' : '今日无课')) :
                  '登录后体验更多功能'}
              </View>}
          </View>}
      </View>
    </AtCard>
  )
}

export default memo(TodayCourse);