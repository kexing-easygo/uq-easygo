import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { AtList, AtListItem } from "taro-ui"

export default function ReviewInfoPage() {
  const dispatch = useDispatch()
  const { reviews, searchedCourse, searchedSemester } = useSelector(state => state.review)
  // console.log("课程评价为:::", reviews)
  return (
    <View>
      <NavBar title={searchedCourse} backIcon />
      <AtList>
        {reviews.map((singleReview) => {
          return (
            <AtListItem
              note={singleReview.postDate}
              title={singleReview.posterName}
              extraText={singleReview.content}
            />
          )
        })}
        
      </AtList>
    </View>
  )
}