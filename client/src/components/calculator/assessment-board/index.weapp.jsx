import React, { memo } from 'react'
import Taro from '@tarojs/taro'
import { AtProgress } from 'taro-ui'
import { useSelector } from 'react-redux'
import { View } from '@tarojs/components'
import './index.less'

function AssessmentBoard(props) {
  const { assessments } = useSelector(state => state.calculator);
  return (
    <View>
      <View className='ass-board-container'>
        {assessments.map(ass => {
          return <View className='single-ass'>
            <View>{ass.description}</View>
            <AtProgress percent={ass.percent ?? 0} strokeWidth={20} />
          </View>
        }
        )}
      </View>
    </View>
  )
}

export default memo(AssessmentBoard);