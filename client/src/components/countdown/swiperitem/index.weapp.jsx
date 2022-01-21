import React, { useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtSwipeAction, AtProgress } from 'taro-ui'
import { useDispatch } from 'react-redux'
import { deleteCountDown } from '../../../services/countdown'
import {setItemDetail} from '../../../features/countdown-slice'
import './index.less'

export default function SwiperItem(props) {
  const dispatch = useDispatch()
  const {showSheet, aid, name, date, time ,percentage, color, type} = props
  
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
            <Text>{name}</Text>
            <Text>{date}</Text>
          </View>
          <AtButton className='item-button' onClick={()=>{showSheet(true); dispatch(setItemDetail(props))}}>
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