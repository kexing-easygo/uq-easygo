import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { setClickedAss, toggleModal } from '../../../features/calculator-slice'

export default function AssessmentList(props) {

  const dispatch = useDispatch();
  const { assessments } = useSelector(state => state.calculator);

  return (
    <View className='ass-list-container'>
      <AtList>
        <AtListItem className='list-header' title={'输入作业得分'}/>
        {assessments.map((ass, i) =>
          <AtListItem
            title={ass.description}
            note={ass.assessment_type}
            // extraText={ass.weight}
            arrow='right'
            onClick={() => {
              dispatch(setClickedAss(i));
              dispatch(toggleModal(true));
            }}
          />)}
      </AtList>
    </View>
  )
}
