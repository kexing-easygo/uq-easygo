import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { AtList, AtNoticebar, AtIcon } from "taro-ui"
import AddSubReview from '../../components/course-comment/add-sub-review'
import SubReviewCard from '../../components/course-comment/double-review-card'
import ReviewCard from '../../components/course-comment/review-card'
import { setClickedSubReview } from "../../features/review-slice";


export default function DoubleReviewPage() {
  const { subReviews,  searchedCourse, clickedReview } = useSelector(state => state.review);
  const stopScroll = { height: '100vh', overflow: 'hidden' };
  const continueScroll = { height: '100vh', overflow: 'scroll' };
  const [pageScroll, pageScrollState] = useState(continueScroll); // 防止滑动穿透
  const dispatch = useDispatch();

  // 如果没有追评 显示“快来评论吧～”
  const withoutReview = () => {
    if (subReviews.length == 0) {
      return (<View className='without-review '>快来评论吧～</View>)
    }
  }

  return (
    <View style={pageScroll}>
      <NavBar title={searchedCourse} backIcon />
      <AtNoticebar><Text className='notice-bar'>当前评论时间显示为北京时间</Text></AtNoticebar>
      <ReviewCard review={clickedReview} type='double-review-page' />

      <View className='fab-background'></View>
      <View className='add-icon'>
        <AddSubReview onClick={() => {pageScrollState(stopScroll)}} />
      </View>
    
      <View className='double-reviews'>
        <AtList hasBorder={false} className='sub-list-review'>
          {subReviews.map((singleReview) => {
            return ( 
              <View onClick={() =>dispatch(setClickedSubReview(singleReview))} >
                <SubReviewCard subReview={singleReview} />
              </View>
          )})}
        </AtList>
        {withoutReview()}
      </View>
    </View>    
  )}