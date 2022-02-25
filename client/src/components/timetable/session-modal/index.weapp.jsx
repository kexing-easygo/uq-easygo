import React, { memo, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { DAY_OF_WEEK } from '../../../utils/constant'
import { getClickedCourse } from '../../../features/course-slice'
import { useDispatch, useSelector } from 'react-redux'
import { getCourseCode } from "../../../utils/courses";

import './index.less'
/**
 * 课程模块
 * @param {object} props 
 */
export default memo(function SessionModal(props) {
  const { sessionInfo } = props;
  const cellHeight = '7.7%';
  const [leftForward, setLeftForward] = useState(0); // 默认为0，若冲突则向左偏移模块宽度的一半
  const [halfWidth, setHalfWidth] = useState(false);
  const dispatch = useDispatch();
  const { clashCourses, availCourses } = useSelector(state => state.course);

  useEffect(() => {
    // 检测当前课程id是否在clash范围内
    const index = clashCourses.flat(Infinity).findIndex(id => id === sessionInfo._id);
    if (index >= 0) { // 和其他节课冲突
      setHalfWidth(true);
      if (index % 2 === 0) setLeftForward(0.5);
    } else {
      setHalfWidth(false);
      setLeftForward(0);
    }
  }, [clashCourses]);

  /**
   * 绝对定位使当前课程模块相对于CourseTable组件移动
   * 根绝props计算top和left的相对位移距离
   */
  const computePosition = () => {
    const position = {};
    const startTime = sessionInfo.start_time.split(":").map(time => parseInt(time));
    position.top = `calc(${(startTime[0] + (startTime[1] / 60) - 8)} * ${cellHeight})`;
    position.left = `calc(${DAY_OF_WEEK[sessionInfo.day_of_week] - 1 + leftForward} * 20%)`;
    position.height = `calc(${sessionInfo.duration / 60} * ${cellHeight})`
    return position;
  }

  /**
   * 计算Modal的背景颜色和宽高
   */
  const computeModalStyle = () => {
    return {
      backgroundColor: sessionInfo.background,
      width: halfWidth ? '50%' : '100%',
      height: '90%'
    }
  }
  return (
    <View className="session-modal"
      style={computePosition()}
      onClick={() => dispatch(getClickedCourse(sessionInfo))}
    >
      <View className="center-view at-col" style={computeModalStyle()}>
        <View className="text-hidden">
          {getCourseCode(sessionInfo.subject_code)} 
        </View>
        <View className="text-hidden">
          {sessionInfo.activity_group_code}
        </View>
        {/* <View className="text-hidden">
          {sessionInfo.location}
        </View> */}
      </View>
    </View>
  );
})