import React, { memo, useEffect } from 'react'
import { View } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import { toggleModal, addScore, addTotalScore, calcPercent, getResults } from '../../../features/calculator-slice'
import { AtList, AtListItem, AtButton, AtInputNumber, AtTag, AtInput } from "taro-ui"
import { AtFloatLayout } from "taro-ui"
import './index.less'

function ScoreModal(props) {

  const dispatch = useDispatch();
  const { assessments, clickedAss, showModal } = useSelector(state => state.calculator);
  const ScoreInput = () =>
    <View
      className='at-row at-row__justify--end at-row__align--center'
      style={{ fontSize: '35rpx' }}>
      <AtInputNumber
        min={0}
        step={1}
        value={assessments[clickedAss].score ?? 0}
        onBlur={e=>dispatch(addScore(parseFloat(e.detail.value)))}
      />
      <View>{`\/`}</View>
      <AtInputNumber
        min={0}
        step={1}
        value={assessments[clickedAss].totalScore ?? 0}
        onBlur={e=>dispatch(addTotalScore(parseFloat(e.detail.value)))}
      />

      <View>=</View>
      <AtTag>{parseFloat((assessments[clickedAss].score / assessments[clickedAss].totalScore * 100).toFixed(1)) || 0}%</AtTag>
    </View>

  return (
    <AtFloatLayout
      className='score-modal'
      isOpened={showModal}
      title="作业详情"
      onClose={() => dispatch(toggleModal(false))}>
      {typeof clickedAss === 'number' &&
        <>
          <AtList>
            <AtListItem title='类型' note={assessments[clickedAss].description} extraText={assessments[clickedAss].assessment_type} />
            <AtListItem title='日期' extraText={assessments[clickedAss].date} />
            <AtListItem title='占比' extraText={assessments[clickedAss].weight} />
            <AtListItem title='时长' extraText={assessments[clickedAss].length} />
            <AtListItem title='分数' note={<ScoreInput />} />
          </AtList>
          <View className='score-option at-row'>
            <AtButton
              type='secondary'
              onClick={() => {
                dispatch(addScore((0)));
                dispatch(addTotalScore(0));
              }}
            >
              清除
              </AtButton>
            <AtButton
              type='primary'
              onClick={() => {
                dispatch(toggleModal(false))
                dispatch(calcPercent())
              }}
            >
              确认
              </AtButton>

          </View>
        </>
      }
    </AtFloatLayout>
  )
}

export default memo(ScoreModal);