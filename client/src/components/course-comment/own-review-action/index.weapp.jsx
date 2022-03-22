import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtCard, AtIcon } from "taro-ui"
import { clipIcon } from '../../../assets/images/review-icons.json'
import { useDispatch, useSelector } from 'react-redux'
import { setEditModal } from "../../../features/review-slice";
import Divider from '../divider'
import { fetchSubReviews } from "../../../services/review";

/*
自己的课评卡片 操作(评论，修改，点赞)
*/
export default function OwnReview(props) {
  const { review, color } = props;
  const dispatch = useDispatch();
  const [showCancelModal, changeCancelModalState] = useState(false); // modal 开关
  const { searchedCourse } = useSelector(state => state.review);
  
   // 获取sub review   设置clicked review
   const handleClick = () => {
    const param = {
      courseCode: searchedCourse,
      reviewId: review.review_id,
    }
    dispatch(fetchSubReviews(param));
  }
  
  return (
    <View>
      <View className='own-review-heart'>
        <View className='own-icon-view'>
          <View className='edit-icon' onClick={() => {dispatch(setEditModal(true))}}>
            <AtIcon value='edit' size='20' color='rgb(133, 130, 130)' className='icon'></AtIcon>
            <Text className='text'>修改</Text>
          </View>
        </View>
      </View>
    </View>
  )
}