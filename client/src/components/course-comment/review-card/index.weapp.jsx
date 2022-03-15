import React ,{useState, useEffect}from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtCard, AtIcon } from "taro-ui"
import OthersReviewAction from '../others-review-action'
import { setClickedReview } from "../../../features/review-slice"
import { fetchSubReviews } from "../../../services/review"
import { useDispatch, useSelector } from 'react-redux'
import { getLocalOpenId } from "../../../services/login"

/*
课评卡片
*/
export default function OthersReview(props) {
  const { review, outstanding} = props;
  const { postDate, postTime, posterName, review_id, studySemester, content, likes,
    numOfComments, openid } = review;
  const { searchedCourse } = useSelector(state => state.review);
  const [selfOpenId, setSelfOpenId]= useState(''); // open id  
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
      reviewId: review_id,
    }
    dispatch(fetchSubReviews(param));
  }

  // 如果是优秀课评 显示星星icon
  const iconShow = () => {
    if (outstanding) {
      return ( 
        <AtIcon prefixClass='icon' value='medal-copy' size='26' color='#FFD233'
          className='' ></AtIcon>
      )
    }
  }

  // 
  const deleteIcon = () => {
    if (openid == selfOpenId) {
      return (
        <AtIcon value='close' size='30' color='#FFFFFF'></AtIcon>
      )
    }
  }

  // 获取 open ID
  useEffect(
    async() => {
      const openid = await getLocalOpenId();
      setSelfOpenId(openid);
    }, []
  )

  return (
    <View>
      {iconShow()}
      {}
      <AtCard note={'编辑于' + postDate + ' ' + postTime} title='' className='review-card' >
        <View className='review-background' onClick={() => {handleClick()}} >
          <Text className='review-author'>
            {handleName(posterName)} - {studySemester}
          </Text>
        </View>
        <View className='review-content' onClick={() => {handleClick()}}>{content}</View>
      </AtCard>
      
      <View className='review-heart'>
        <OthersReviewAction reviewsCount={numOfComments} likesCount={likes.length} 
        review={review} />
      </View>
    </View>
  )
}