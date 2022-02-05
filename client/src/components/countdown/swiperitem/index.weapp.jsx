import React, { useState, useEffect, memo} from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtSwipeAction, AtProgress } from 'taro-ui'
import { useDispatch } from 'react-redux'
import { deleteCountDown } from '../../../services/countdown'
import {setDetailSheet, setClickedAss} from '../../../features/countdown-slice'
import './index.less'

function SwiperItem(props) {
  const dispatch = useDispatch()
  const { assignmentInfo } = props 
  const { aid, name, date ,percentage, color } = assignmentInfo
  return (
    <>
      <AtSwipeAction 
        key={aid}
        areaWidth={Taro.getSystemInfoSync().screenWidth}
        maxDistance={75}
        autoClose
        options={[
          { 
            text: '🗑️',
            style: {backgroundColor: '#FF0000'} 
          }]}
        onClick={() => {
            console.log(aid);
            dispatch(deleteCountDown(aid))
          }}
        >    
        <View className='container'>
          <View className='item-name'>
            <View className='name'>{name}</View>
            <View className='date'>{date}</View>
            {/* <Text className='date'>{date}</Text> */}
          </View>
          <AtButton className='item-button' onClick={()=>{
              dispatch(setDetailSheet())
              dispatch(setClickedAss(assignmentInfo))
            }}>
              <AtProgress className='item-progress' percent={percentage} strokeWidth={30} color={color} isHidePercent/>
          </AtButton>
        </View>
      </AtSwipeAction>

      {/* ActionSheet Section */}
      {/* <DetailSheet 
        isOpen={detailSheet}
        onClose={()=>setDetailSheet(false)}
        aid={aid}
        name={name}
        date={date}
        time={time}
        color={color}
        type={type} 
      /> */}
    </>
  )
}

export default SwiperItem