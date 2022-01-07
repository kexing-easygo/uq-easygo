import React from 'react'
import { View, Text } from '@tarojs/components'
import { WEEK_DAYS, NUMBERS } from '../../../utils/constant'
import './index.less'

/**
   * 课程表第一行的星期数
   * @param {object} props 
   */
export default function WeekDays(props) {
  const { selectedDay, dates, currentMonth } = props;
  const weekDays = [...Array(5).keys()].map((d, i) => {
    return (
      <View className='at-col week-day-view'>
        <View className='cell'>
          <View className={i === 0 ? 'start-view date' : 'date'}>
            <View className={selectedDay === i ? "selected" : ""} >
              <View>{WEEK_DAYS[d]}</View>
              <View>{dates[d]}</View>
            </View>
          </View>
        </View>
      </View>
    );
  })
  weekDays.unshift(
    <View className="month-view">
      <Text>{NUMBERS[currentMonth]}</Text>
      <Text>月</Text>
      <View className="triangle"></View>
    </View>
  )
  return <View className='at-row week-days'>{weekDays}</View>
}