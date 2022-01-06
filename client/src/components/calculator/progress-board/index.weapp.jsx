// 各项作业占比展示板
import React, { memo } from 'react'
import Taro from '@tarojs/taro'
import { AtActionSheet, AtProgress } from 'taro-ui'
import { useSelector } from 'react-redux'
import { View } from '@tarojs/components'
import './index.less'

function ProgressBoard(props) {
  // const { assessments } = props;
  const { isOpened, setOpened, assessments } = props;
  return (
    <AtActionSheet
    className='progress-board-actionsheet'
    isOpened={isOpened}
    cancelText='收起'
    title='Score Board'
    onCancel={() => setOpened(false)}
    onClose={() => setOpened(false)}
    >
      <View className='ass-board-container'>
         {assessments.map(ass => {
            return <View className='single-ass'>
              <View>{ass.description}</View>
              <AtProgress percent={ass.percent ?? 0} strokeWidth={20} />
            </View>
        }
        )}
      </View>
    </AtActionSheet>
  )
}

export default memo(ProgressBoard);