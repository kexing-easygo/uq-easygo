import React, { memo, useState, useEffect} from 'react'

import { View, Text } from '@tarojs/components'
import {AtButton, AtProgress} from 'taro-ui'
import './index.less'

function ProgressBoardNew(props) {
  const { assessments, percentage, level, state } = props 
  const [display, setDisplay] = useState(false)
  const color = "#88A9FF"
  return (
    <View className="container">
      <View className='gpa-header'>
        <View className='txt'>GPA</View>
        <AtProgress className='gpa-progress' percent={percentage} strokeWidth={30} color={color} isHidePercent/>
        <View 
          class='progress-level'
          style={"left: " + state * 100 + "%; "}
          >{level}</View>
        <AtButton onClick={() => {
          if (display) {setDisplay(false)} else setDisplay(true)}}>
            {display ? "收起" : "查看更多"}
            </AtButton>
      </View>
      <View className="item-board" style={display? '':'display: none'}>
        {assessments.map((ass, i) => {
          return <View className='item'>
              <View className='txt'>{ass.description.substring(0, 3) + "..."}</View>
              <AtProgress className='gpa-progress' 
                percent={ass.percent ?? 0} 
                strokeWidth={30} 
                color={color} 
                isHidePercent/>
              <View className='txt'>{ass.percent ?? 0}%</View>
            </View>
        })}
      </View>
    </View>
  )
}

export default ProgressBoardNew;