import React, { useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.less'
import { AtCard, AtModal, AtModalHeader, AtModalContent } from "taro-ui"
import { AtModalAction, AtIcon } from "taro-ui"
import OthersReviewAction from '../others-review-action'
import { clipIcon } from '../../../assets/images/review-icons.json'
import { useDispatch, useSelector } from 'react-redux'
import { setEditModal, setClickedReview } from "../../../features/review-slice";
import Divider from '../divider'
import { deleteReview, fetchSubReviews } from "../../../services/review";

/*
自己写的课评卡片
*/
export default function OwnReview(props) {
  const { review, color } = props;
  const dispatch = useDispatch();
  const [showCancelModal, changeCancelModalState] = useState(false); // modal 开关
  const { searchedCourse } = useSelector(state => state.review);
  
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
  
  // 删除时 传入API的数据
  const deleteData = {
    reviewId: review.review_id,
    courseCode: searchedCourse,
  }

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
      <Image src={clipIcon} className='clipIcon' />
      <AtCard note={'编辑于' + review.postDate + ' ' + review.postTime} title='' className='own-review-card' >
        <View className='own-review-background' style={{backgroundColor:color}}
           onClick={() => {handleClick()}} >
          <Text className='own-review-author'>
            {handleName(review.posterName)} - {review.studySemester}
          </Text>
        </View>
        <View className='own-review-content' onClick={() => {handleClick()}}>
          {review.content}
        </View>
      </AtCard>
      
      <View className='own-review-heart'>
        <View className='own-icon-view'>
          <Divider width='100.2%' className='divider'/>
          <View className='edit-icon' onClick={() => {dispatch(setEditModal(true))}}>
            <AtIcon value='edit' size='20' color='rgb(133, 130, 130)' className='icon'></AtIcon>
            <Text className='text'>修改</Text>
          </View>
          <View className='delete-icon' onClick={() => {changeCancelModalState(true)}}>
            <AtIcon value='trash' size='20' color='rgb(133, 130, 130)' className='icon'></AtIcon>
            <Text className='text'>删除</Text>
          </View> 
          
          <AtModal isOpened={showCancelModal} onClose={() => changeCancelModalState(false)}>
            <AtModalHeader>温馨提示</AtModalHeader>
            <AtModalContent>请问确定要删除这个评价吗?</AtModalContent>
            <AtModalAction> 
              <Button onClick={() => changeCancelModalState(false)}>取消</Button> 
              <Button onClick={() => {dispatch(deleteReview(deleteData));changeCancelModalState(false)}}>
                确定
              </Button> 
            </AtModalAction>
          </AtModal>
        </View>
        <OthersReviewAction reviewsCount={review.numOfComments} likesCount={review.likes.length} 
        review={review} />
      </View>
    </View>
  )
}