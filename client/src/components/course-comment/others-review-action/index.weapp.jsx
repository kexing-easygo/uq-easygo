import React, { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.less'
import { AtIcon } from "taro-ui"
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtToast} from "taro-ui"
import { useDispatch, useSelector } from 'react-redux'
import { updateLikes } from "../../../services/review";
import { setClickedReview } from "../../../features/review-slice"
import { fetchSubReviews } from "../../../services/review"

/*
别人的课评卡片 操作(评论，点赞)
*/
export default function OthersReviewAction(props) {
  // clicking 用于阻止 double-review页面  点击课评卡片or评论时 页面跳转
  const{ type, reviewsCount, likesCount, review } = props; 
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

  // 随着点赞 or not  调节点赞icon+text的位置
  const changePosition = () => {
    if (state) {
      return {iconMarginTop:'-1px', iconMarginRight:'98px',
      textMarginTop:'-21px', textMarginRight:'44px'};
    } else {
      return {iconMarginTop:'-2px', iconMarginRight:'98px',
      textMarginTop:'-24px', textMarginRight:'43px'};
    }
  }

  // 更新小图标状态
  useEffect(() => {
    setState(likesReviews.indexOf(review.review_id) == -1? false: true)
  })

  return (
    <View className='icon-view'>
      <View className='review-icon' 
        onClick={() => {type=='double-review-page' ? '':handleClick()}}>
        <AtIcon prefixClass='icon' value='comment_vs-copy' size='19' color='#586EA9'
          className='icon' ></AtIcon>
        <Text className='text'>评论({reviewsCount})</Text>
      </View>

      <View className='heart-icon' onClick={() => {checkState()}}>
        <AtIcon prefixClass='icon' value={state? 'good-copy':'good-fill-copy'} 
          size={state? '19':'23'} color={state? '#FFB017':'#BDBCBC'}
          className='icon'></AtIcon>
        <Text className='text'>点赞({likesCount})</Text>
      </View>

      <AtModal isOpened={showModal} onClose={() => changeModalState(false)}>
        <AtModalHeader>温馨提示</AtModalHeader>
        <AtModalContent>
          <Text>请问确定要点赞此评论吗?</Text>
        </AtModalContent>
        <AtModalAction> 
          <Button onClick={() => changeModalState(false)}>取消</Button> 
          <Button onClick={() => {changeState()}}>确定</Button> 
        </AtModalAction>
      </AtModal>

      <AtToast isOpened={showToast} text='评价不能修改哦～' duration='800' hasMask={true}
        onClick={() => changeToastState(false)}
        onClose={() => changeToastState(false)}>
      </AtToast>
    </View>
  )
}