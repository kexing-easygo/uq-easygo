import React, { memo } from 'react'
import { View, Text } from '@tarojs/components'
import { HOURS } from '../../../utils/constant'
import './index.less'
/**
 * 课程表左侧的时间线，无状态组件
 */
export default memo(function TimeBar(props) {
  const { timeZoneStart } = props;
  const timeBar = [];
  for (let i = 0; i < HOURS; i++) {
    timeBar.push(
      <View className="time-point cell">
        <Text>{timeZoneStart + i}</Text>
      </View>
    )
  }
  return <View className="time-bar">{timeBar}</View>
})