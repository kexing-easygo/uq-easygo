import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtCard } from "taro-ui"
import OthersReviewAction from '../others-review-action'
import { setClickedReview } from "../../../features/review-slice"
import { fetchSubReviews } from "../../../services/review"
import { useDispatch, useSelector } from 'react-redux'

/*
别人写的课评卡片
*/
export default function OthersReview(props) {
  const { review, color } = props;
  const { searchedCourse } = useSelector(state => state.review);
  const dispatch = useDispatch();

  // 处理超长名字
  const handleName = (name) => {
    let bytes = 0;
    for (let i=0; i<name.length; i++) {
      if (name[i].charCodeAt(0) > 255) {
        bytes += 2;
      } else {
        bytes ++;
      }
      if (bytes > 9) {
        return name.substring(0,i) + '...';
      }
    }
    return name;
  }

   // 获取sub review   设置clicked review
   const handleClick = () => {
    dispatch(setClickedReview(review));
    const param = {
      courseCode: searchedCourse,
      reviewId: review.review_id,
    }
    dispatch(fetchSubReviews(param));
  }

  return (
    <View>
      <AtCard note={'编辑于' + review.postDate + ' ' + review.postTime} title='' className='review-card' >
        <View className='review-background' style={{backgroundColor:color}}
        onClick={() => {handleClick()}} >
          <Text className='review-author'>
            {handleName(review.posterName)} - {review.studySemester}
          </Text>
        </View>
        <View className='review-content' onClick={() => {handleClick()}}>{review.content}</View>
      </AtCard>
      
      <View className='review-heart'>
        <OthersReviewAction reviewsCount={review.numOfComments} likesCount={review.likes.length} 
        review={review} />
      </View>
    </View>
  )
}