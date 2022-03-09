import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtButton } from "taro-ui"
import './index.less'


export default function UncheckedList(props) {
  const {reviewID,courseCode,date,time,content} = props.review

  const handleNotPass = () =>{
    console.log("not pass"+reviewID)
  }

  const handlePass = () =>{
    console.log("pass"+reviewID)
  }

  return (
    <AtCard title={`${courseCode} ${date} ${time}`} className='uncheckedReview'>
      <View  className='uncheckedReview__content'>
        {content}
      </View>
      <View className='uncheckedReview__buttons'>
        <AtButton onClick={handlePass} size='small' type='primary'>通过</AtButton>
        <AtButton onClick={handleNotPass} size='small' type='secondary'>未通过</AtButton>
      </View>
    </AtCard>
  )
}
