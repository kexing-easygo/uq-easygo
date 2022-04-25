import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtCard } from "taro-ui"
import OthersReviewAction from '../others-review-action'
import { useDispatch, useSelector } from 'react-redux'

/*
点击的课评（追评页面）
*/
export default function ClickedReview() {
  const { clickedReview } = useSelector(state => state.review);
  const { postDate, postTime, posterName, studySemester, content } = clickedReview
  const { review_id, likes, numOfComments, avatarUrl } = clickedReview;

  // 处理超长名字
  const handleName = () => {
    let bytes = 0;
    for (let i=0; i<posterName.length; i++) {
      if (posterName[i].charCodeAt(0) > 255) {
        bytes += 2;
      } else {
        bytes ++;
      }
      if (bytes > 8) {
        return posterName.substring(0,i) + '...';
      }
    }
      return posterName;
  }

  return (
    <View className='clicked-review'>
      <View className='author-view'><Image src={avatarUrl} className='author-photo' ></Image></View>
      <AtCard note={'编辑于' + postDate + ' ' + postTime} title='' className='review-card'>
        <View className='review-background' >
          <Text className='review-author'>{handleName()} - {studySemester}</Text>
        </View>
        <View className='review-content'>{content}</View>
      </AtCard>
      
      <View className='review-heart'>
        <OthersReviewAction reviewsCount={numOfComments} likesCount={likes.length} 
         review={clickedReview} type={'double-review'} />
      </View>
    </View>
  )
}
