import React, { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.less'
import { AtIcon } from "taro-ui"
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtToast} from "taro-ui"
import { useDispatch, useSelector } from 'react-redux'
import { updateLikes } from "../../../services/review";
import { setClickedReview, setEditModal } from "../../../features/review-slice"
import { fetchSubReviews } from "../../../services/review"

/*
自己的课评卡片 操作(评论，修改，点赞)
*/
export default function OwnReviewAction(props) {
  const{ reviewsCount, likesCount, review } = props; 
  const { likesReviews, searchedCourse } = useSelector(state => state.review);
  const[showModal, changeModalState] = useState(false); // modal 开关
  const[showToast, changeToastState] = useState(false); // toast 开关
  // 是否点过赞
  const [state, setState] = useState(likesReviews.indexOf(review.review_id) == -1? false: true); 
  const dispatch = useDispatch();

  // 改变图标样式 上传数据
  const changeState = () => {
    changeModalState(false);
    setState(true);
    const param = {
      reviewId: review.review_id,
      courseCode: searchedCourse,
    }
    dispatch(updateLikes(param));
  }

  // 根据是否赞过 弹提示框
  const checkState = () => {
    if (state) {
      changeToastState(true);
    } else {
      changeModalState(true);
    }
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

  // 更新小图标状态
  useEffect(() => {
    setState(likesReviews.indexOf(review.review_id) == -1? false: true)
  })

  return (
    <View className='own-icon-view'>
      <View className='review-icon' 
        onClick={() => {clicking==false? '':handleClick()}}>
        <AtIcon prefixClass='icon' value='comment_vs-copy' size='19' color='#586EA9'
          className='icon' ></AtIcon>
        <Text className='text'>评论({reviewsCount})</Text>
      </View>

      <View className='edit-icon' onClick={() => {dispatch(setEditModal(true))}}>
        <AtIcon prefixClass='icon' value='write-copy' size='22' color='#586EA9'
          className='icon' ></AtIcon>
        <Text className='text'>修改</Text>
      </View>

      <View className='heart-icon' onClick={() => {checkState()}}>
        <AtIcon prefixClass='icon' value={state? 'good-copy':'good-fill-copy'} 
          size={state? '19':'25'}color={state? '#FFB017':'#BDBCBC'}
          className='icon' ></AtIcon>
        <Text className='text'>点赞({likesCount})</Text>
      </View>

      <AtModal isOpened={showModal} onClose={() => changeModalState(false)}>
        <AtModalHeader>温馨提示</AtModalHeader>
        <AtModalContent>
          <Text className='modal-first-line'>评价不能修改</Text>
          <Text className='modal-second-line'>请问确定要给予这个评价吗?</Text>
        </AtModalContent>
        <AtModalAction> 
          <Button onClick={() => changeModalState(false)}>取消</Button> 
          <Button onClick={() => {changeState()}}>确定</Button> 
        </AtModalAction>
      </AtModal>

      <AtToast isOpened={showToast} text='你已经评论过啦' duration='800' hasMask={true}
        onClick={() => changeToastState(false)}
        onClose={() => changeToastState(false)}>
      </AtToast>
    </View>
  )
}
