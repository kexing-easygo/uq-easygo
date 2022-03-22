import React ,{useState, useEffect}from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.less'
import { AtCard, AtIcon, AtModal, AtModalHeader, AtModalContent } from "taro-ui"
import { AtModalAction } from "taro-ui"
import OthersReviewAction from '../others-review-action'
import OwnReviewAction from '../own-review-action'
import { setClickedReview } from "../../../features/review-slice"
import { fetchSubReviews } from "../../../services/review"
import { useDispatch, useSelector } from 'react-redux'
import { getLocalOpenId } from "../../../services/login"
import { deleteReview } from "../../../services/review";

/*
课评卡片
*/
export default function OthersReview(props) {
  const { review, outstanding} = props;
  const { postDate, postTime, posterName, review_id, studySemester} = review;
  const { content, likes, numOfComments, openid } = review;
  const { searchedCourse } = useSelector(state => state.review);
  const [selfOpenId, setSelfOpenId]= useState(''); // open id  
  const dispatch = useDispatch();
  const [showCancelModal, changeCancelModalState] = useState(false); // modal 开关

  // 删除时 传入API的数据
  const deleteData = {
    reviewId: review_id,
    courseCode: searchedCourse,
  } 
  
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
        <AtIcon prefixClass='icon' value='medal-copy' size='30' color='#FFD233'
          className='outstanding-icon' ></AtIcon>
      )
    }
  }

  // 如果是自己写的课评 显示‘X' （删除）
  const deleteIcon = () => {
    if (openid == selfOpenId) {
      return (
        <AtIcon value='close' size='16' color='#FFFFFF' className='delete-icon'
        onClick={() => {changeCancelModalState(true)}}></AtIcon>
      )
    }
  }

  // 显示 评论+点赞 or 评论+修改+点赞
  const operationShow = () => {
    if (openid == selfOpenId) {
      return (
        <View className='review-heart'>
        <OthersReviewAction reviewsCount={numOfComments} likesCount={likes.length} 
        review={review} />
        </View>
      )
    } else {
      return (
        <View className='review-heart'>
        <OthersReviewAction reviewsCount={numOfComments} likesCount={likes.length} 
        review={review} />
        </View>
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
    <View className='cards'>
      {iconShow()}
      {deleteIcon()}
      <AtCard note={'编辑于' + postDate + ' ' + postTime} title='' className='review-card' >
        <View className='review-background' onClick={() => {handleClick()}} >
          <Text className='review-author'>
            {handleName(posterName)} - {studySemester}
          </Text>
        </View>
        <View className='review-content' onClick={() => {handleClick()}}>{content}</View>
      </AtCard>
      {operationShow()}

      <AtModal isOpened={showCancelModal} onClose={() => changeCancelModalState(false)}>
        <AtModalHeader>温馨提示</AtModalHeader>
        <AtModalContent>请问确定要删除这个评价吗?</AtModalContent>
        <AtModalAction> 
          <Button onClick={() => changeCancelModalState(false)}>取消</Button> 
          <Button onClick={() => {dispatch(deleteReview(deleteData));
            changeCancelModalState(false)}}>
            确定
          </Button> 
        </AtModalAction>
      </AtModal>
    </View>
  )
}