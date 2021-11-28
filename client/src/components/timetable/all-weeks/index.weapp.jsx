import React from 'react'
import { View, ScrollView } from '@tarojs/components'
import { NUMBERS, WEEKS_NO, BREAK } from '../../../utils/constant'
import { AtButton } from 'taro-ui'
import './index.less'
/**
 * 课程表上方可滚动选择周数的选择器
 * @param {object} props 
 */
export default function AllWeeks(props) {
  const { currentWeek, setCurrentWeek } = props;
  const weeks = [];
  for (let i = 1; i <= WEEKS_NO; i++) {
    let weekNo = i > BREAK ? i - 1 : i;
    weeks.push(
      <View className="week-btn-view">
        <View className='scroll-center-view' id={i === currentWeek && 'current'}>
          <AtButton
            type={i === currentWeek ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setCurrentWeek(i)}
          >
            {i === BREAK ? 'Break' : `第${NUMBERS[weekNo]}周`}
          </AtButton>
        </View>
      </View>
    )
  }
  return (
    <ScrollView
      className='all-weeks'
      scrollIntoView='current'
      scrollX
    >
      {weeks}
    </ScrollView>
  );
}