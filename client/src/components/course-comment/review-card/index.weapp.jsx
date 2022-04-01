import React ,{useState, useEffect}from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.less'
import { AtCard, AtIcon, AtModal, AtModalHeader, AtModalContent } from "taro-ui"
import { AtModalAction } from "taro-ui"
import OthersReviewAction from '../others-review-action'
import { setClickedReview } from "../../../features/review-slice"
import { fetchSubReviews, deleteReview } from "../../../services/review"
import { useDispatch, useSelector } from 'react-redux'
import { getLocalOpenId } from "../../../services/login"
import OwnReviewAction from '../own-review-action'

/*
课评卡片 (课评结果页+追评页主评)
*/
export default function ReviewCard(props) {
  const { review, type } = props; //type 用于控制页面跳转
  const { postDate, postTime, posterName, review_id, studySemester, isOutstanding} = review;
  const { content, likes, numOfComments, openid, avatarUrl } = review;
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
    if (selfOpenId == openid && type=='review-page') {
      return '我';
    }
    let bytes = 0;
    for (let i=0; i<name.length; i++) {
      if (name[i].charCodeAt(0) > 255) {
        bytes += 2;
      } else {
        bytes ++;
      }
      if (bytes > 9 && type == 'review-page') {
        return name.substring(0,i) + '...';
      } else if (bytes > 7 && type == 'double-review-page') {
        return name.substring(0,i) + '...';
      }
    }
    return name;
  }

   // 获取sub review   设置clicked review
   const handleClick = () => {
    if (type=='review-page') {
      dispatch(setClickedReview(review));
      const param = {
        courseCode: searchedCourse,
        reviewId: review_id,
      }
      dispatch(fetchSubReviews(param));
    }
  }

  // 如果是优秀课评 显示星星icon
  const iconShow = () => {
    if (isOutstanding) {
      return ( 
        <AtIcon prefixClass='icon' value='medal-copy' size='30' color='#FFD233'
          className='outstanding-icon' ></AtIcon>
      )
    }
  }

  // 如果是自己写的课评 显示‘X' （删除）
  const deleteIcon = () => {
    if (openid == selfOpenId && type == 'review-page') {
      return (
        <AtIcon value='close' size='16' color='#FFFFFF' className='delete-icon'
        onClick={() => {changeCancelModalState(true)}}></AtIcon>
      )
    }
  }

  // 显示 评论+点赞 or 评论+修改+点赞
  const operationShow = () => {
    if (openid == selfOpenId && type=='review-page') {
      return (
        <View className='own-review'>
        <OwnReviewAction reviewsCount={numOfComments} likesCount={likes.length} 
        review={review} />
        </View>
      )
    } else {
      return (
        <View className='others-review'>
        <OthersReviewAction reviewsCount={numOfComments} likesCount={likes.length} 
        review={review} type={type} />
        </View>
      )
    }
  }

  // 追评页面 显示头像
  const photoShow = () => {
    if (type == 'double-review-page') {
      return (
        <View className='author-view'>
          <Image src={avatarUrl} className='author-photo' ></Image>
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
    <View className='cards' 
      style={type=='double-review-page' ? {marginLeft:'24px'}:''} >
      {iconShow()}
      {deleteIcon()}
      {photoShow()}
      <View style={type=='double-review-page' ? {marginTop:'12px'}:{marginTop:'10px'}} >
        <AtCard note={'编辑于' + postDate + ' ' + postTime} title='' 
        className={type=='double-review-page' ? 'review-card shadow': 'review-card'} >
          <View className='review-background' onClick={() => {handleClick()}} >
            <Text className='review-author'>
              {handleName(posterName)} - {studySemester}
            </Text>
          </View>
          <View className='review-content' onClick={() => {handleClick()}}>{content}</View>
        </AtCard>
      </View>
      {operationShow()}

      <AtModal isOpened={showCancelModal} onClose={() => changeCancelModalState(false)}>
        <AtModalHeader>温馨提示</AtModalHeader>
        <AtModalContent>请问确定要删除此评论吗?</AtModalContent>
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