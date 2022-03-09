import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { AtList } from "taro-ui"
import NavBar from '../../components/navbar'
import './index.less'
import UncheckedList from '../../components/unchecked-reviews'
export default function CheckReviews() {

  const getReviews = () =>{
    return [{
      reviewID:'01',
      courseCode:"csse1001",
      date:"2022.2.3",
      time:"11:00",
      content:"这也是内容区 可以随意定义功能",
    },
    {
      courseCode:"csse2002",
      date:"2022.2.4",
      time:"12:00",
      content:"这也是内容区 可以随意定义功能2",
    }]
  }

  return (
    <View className=''>
      <NavBar title="客评审查" backIcon />
      <View className="uncheckedReviews">
        {getReviews().map((data)=>{
          return <UncheckedList review={data}/>
        })}
        {getReviews().map((data)=>{
          return <UncheckedList review={data}/>
        })}
        {getReviews().map((data)=>{
          return <UncheckedList review={data}/>
        })}
        {getReviews().map((data)=>{
          return <UncheckedList review={data}/>
        })}
      </View>
      
      <View className='info-text center-text'>
        客评
      </View>
    </View>
  )
}
