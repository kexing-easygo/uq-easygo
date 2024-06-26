import React, { useEffect, useState } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtList, AtModal, AtAccordion, AtSwipeAction, AtActionSheet, AtActionSheetItem } from "taro-ui"
import NavBar from '../../components/navbar'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { getClassCode } from '../../utils/courses'
import { setManagementClickedClass } from '../../features/course-slice'
import { deleteClass, deleteSemester, fetchSelectedCourses } from '../../services/course'

export default function CourseManagement() {

  const dispatch = useDispatch();
  const { loginStatus } = useSelector(state => state.user);
  const [modalOpened, setModalOpened] = useState(false);
  const { selectedCourses, managementClickedClass, currentSemester } = useSelector(state => state.course);
  const [opens, setOpens] = useState({});     // 控制AtAccordion的开关状态
  const [actionSheetOpen, setActionSheetOpen] = useState(false); // 控制AtActionSheet的开关
  const [managedSemester, setManagedSemester] = useState('');
  const actionOptions = [{
    text: '删除',
    style: {
      backgroundColor: '#FA5151'
    }
  }];

  usePullDownRefresh(() => {
    dispatch(fetchSelectedCourses());
  })

  useEffect(() => {
    let newOpens = {};
    Object.keys(selectedCourses).forEach((semester) => {
      if (!selectedCourses[semester]) return;
      newOpens = {
        ...newOpens,
        [semester]: new Array(selectedCourses[semester].length).fill(false)
      }
    })
    setOpens(newOpens)
  }, [])

  useEffect(() => {
    dispatch(fetchSelectedCourses());
  }, [])

  const toggleAccordion = (semester, value, i) => {
    const opensCp = { ...opens }
    opensCp[semester] = opens[semester].map((open, j) => j === i ? value : open);
    setOpens(opensCp);
  }
  
  const handleDeleteClass = () => {
    const courseCode = managementClickedClass._id.split("_")[0]
    const args = {
      classId: managementClickedClass._id,
      semester: managedSemester,
      courseCode: courseCode
    }
    console.log("deleting class ::: ", args)
    dispatch(deleteClass(args));
    setModalOpened(false);
    dispatch(fetchSelectedCourses());
  }

  return (
    <>
      <NavBar title="课程管理" backIcon />

      {/* 已登录时按照学期展示所有已选课程 */}
      {Object.keys(selectedCourses).map(semester => {
        {console.log(semester);}
        // 本学期选过课程但课程都被删除时不予展示
        if (!selectedCourses[semester] || selectedCourses[semester].length === 0) return null;
        return <View
          key={semester}
          className='semester-card'
        >
          <View className='at-row at-row__justify--between at-row__align--center semester-title info-text'>
            <View className='info-text'>{semester}</View>
            <View className='operation-icons'>
              <Text
                className='at-icon at-icon-add'
                onClick={() => Taro.navigateTo({ url: "/pages/timetable/index" })}
              ></Text>
              <Text
                className='at-icon at-icon-list'
                onClick={() => {
                  setActionSheetOpen(true);
                  setManagedSemester(semester);
                }}
              ></Text>
            </View>
          </View>

          {selectedCourses[semester].map((course, i) =>
            <AtAccordion
              key={course.courseCode}
              title={course.courseCode}
              open={opens[semester] && opens[semester][i]}
              isAnimation={false}
              onClick={(value) => {
                setManagedSemester(semester)
                toggleAccordion(semester, value, i)
              }}
            >
              <View className='accordion-content'>
                {course.classes.map((clas, j) =>
                  <AtList>
                    <AtSwipeAction
                      key={clas._id}
                      maxDistance={100}
                      areaWidth={Taro.getSystemInfoSync().screenWidth}
                      options={actionOptions}
                      onOpened={() => dispatch(setManagementClickedClass(clas))}
                      onClick={() => setModalOpened(true)}
                    >
                      <View className='class-view'>{getClassCode(clas._id)}</View>
                    </AtSwipeAction>
                  </AtList>
                )}
              </View>
            </AtAccordion>)}
        </View>
      })}
      <AtModal
        isOpened={modalOpened}
        cancelText='取消'
        confirmText='确认'
        onClose={() => setModalOpened(false)}
        onCancel={() => setModalOpened(false)}
        onConfirm={handleDeleteClass}
        content='确定要删除吗'
      />
      {/* 未登录时 */}
      {!loginStatus ?
        <View className='info-text empty-page-text center-text'>
          <View>登录后可在本页对已添加的课程进行管理，</View>
          <View>或添加新的课程</View>
        </View> :
        <View
          className='new-semester'
          onClick={() => Taro.navigateTo({ url: "/pages/timetable/index" })}>
          <Text className='at-icon at-icon-add info-text'></Text>
          <Text className='info-text'>添加课程</Text>
        </View>}

      <AtActionSheet
        isOpened={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        onCancel={() => setActionSheetOpen(false)}
        cancelText='取消'>
        <AtActionSheetItem onClick={() => Taro.navigateTo({ url: `/pages/delete-course/index?semester=${managedSemester}` })} >
          管理本学期课程
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => dispatch(deleteSemester(managedSemester))}>
          <Text style={{ color: 'red' }}>删除本学期</Text>
        </AtActionSheetItem>
      </AtActionSheet>
    </>
  )
}
