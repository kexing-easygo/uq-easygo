import React, { memo, useState, useEffect } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { toggleModal, addScore, addTotalScore, calcPercent, getResults } from '../../../features/calculator-slice'
import { AtList, AtListItem, AtButton, AtInputNumber, AtTag, AtInput } from "taro-ui"
import { AtFloatLayout } from "taro-ui"
import './index.less'

function ScoreModal(props) {
  const { click } = props
  const { showModal } = useSelector(state => state.calculator);
  const [ score, setScore ] = useState()
  const [ totalScore, setTotalScore ] = useState()
  const dispatch = useDispatch();
  useEffect(() => {
    setScore(click.score)
    setTotalScore(click.totalScore)
  }, [click])

  const calculatePercentage = () => {
    let res = parseFloat((click.score / click.totalScore * 100).toFixed(1)) || 0
    if (res > 100) Taro.showToast({ title: "分子不能大于分母", icon: "none" })
    return res > 100 ? 100 : res
  }

  const handleCalculate = (name = "calculate") => {
    if (totalScore === undefined || totalScore === 0) {
      Taro.showToast({ title: "无效的分母", icon: "none" })
      return;
    }
    if (score === undefined) setScore(0)
    dispatch(addScore(score))
    dispatch(addTotalScore(totalScore))
    dispatch(calcPercent())
    if (name === "confirm") dispatch(toggleModal(false))          
  }

  const ScoreInput = () =>
  
    <View
      className='at-row'
      style={"font-size: 35rpx; justify-content: space-around; margin-top: 20rpx; "}>
      <AtInput
        name='score'
        title=''
        type='digit'
        placeholder='得分'
        border={false}
        value={score}
        onChange={(value, event) => value}
        onBlur={(value, event) => {setScore(parseFloat(event.detail.value))}}
      >
      </AtInput>
      <View className="division">
        {`\/`}
      </View>
      <AtInput
          name='totalScore'
          title=''
          type='digit'
          placeholder='总分'
          border={false}
          value={totalScore}
          onChange={(value, event) => value}
          onBlur={(value, event) => {setTotalScore(parseFloat(event.detail.value))}}
      >
      </AtInput>
      <View
        className="equals"
        >=</View>
      <AtTag>{calculatePercentage()}%</AtTag>
    </View>

  return (
    <AtFloatLayout
      className='score-modal'
      isOpened={showModal}
      title="作业详情"
      onClose={() => dispatch(toggleModal(false))}>
        <>
          <AtList>
            <AtListItem title='类型' note={click.description} extraText={click.assessment_type} />
            <AtListItem title='日期' extraText={click.date} />
            <AtListItem title='占比' extraText={click.weight} />
            <AtListItem title='时长' extraText={click.length} />
            <AtListItem title='分数' note={<ScoreInput />} />
          </AtList>
          <View className='score-option at-row'>
            <AtButton
              type='secondary'
              onClick={() => {
                dispatch(addScore());
                dispatch(addTotalScore());
              }}
              customStyle={{
                color: '#FA5151',
                border: '1px solid #FA5151',
                // backgroundColor: 'transparent'#78A4FA

              }}
            >
              清除
              </AtButton>
              <AtButton
                type='primary'
                onClick={handleCalculate}
                >
              计算
              </AtButton>
            
              <AtButton
                customStyle={{
                  color: '#7F7F7F',
                  border: '1px solid #78A4FA',
                  backgroundColor: 'transparent'
                }}
              onClick={() => {
                handleCalculate("confirm")
                      
              }}
            >
              确定
              </AtButton>
              
          </View>
        </>
    </AtFloatLayout>
  )
}

export default memo(ScoreModal);