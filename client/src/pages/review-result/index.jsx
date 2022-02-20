import React, { useState, useEffect } from 'react'
import { View, Text} from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import { getLocalOpenId } from "../../services/login"
import { useDispatch, useSelector } from 'react-redux'
import { AtList, AtNoticebar, AtAccordion  } from "taro-ui"
import CourseInfo from '../../components/course-comment/course-info'
import IconReview from '../../components/course-comment/icon-review'
import AddReview from '../../components/course-comment/add-review'
import OthersReview from '../../components/course-comment/others-review'
import OwnReview from '../../components/course-comment/own-review'
import { setClickedReview } from "../../features/review-slice";


export default function ReviewResultPage() {
  const { reviews, searchedCourse } = useSelector(state => state.review);
  const [outstandingReview, outstandingReviewState] = useState(false); // 优秀评价展示or not
  const [otherReview, otherReviewState] = useState(false); // 其他评级展示or not
  const [selfOpenId, setSelfOpenId]= useState(''); // open id  
  const stopScroll = { height: '100vh', overflow: 'hidden' };
  const continueScroll = { height: '100vh', overflow: 'scroll' };
  const [pageScroll, pageScrollState] = useState(continueScroll); // 防止滑动穿透
  const dispatch = useDispatch();
  let number = 0; // 用于判断 有无 优秀评价 or 其他评价

  // 如果没有优秀评价 or 其他评价 显示“快来评论吧～”
  const withoutReview = () => {
    if (number == 0) {
      return (<View className='without-review'>快来评论吧～</View>)
    }
    number = 0;
  }

  // 获取 open ID
  useEffect(
    async() => {
      const openid = await getLocalOpenId();
      setSelfOpenId(openid);
    }, []
  )


  return (
    <View style={pageScroll}>
      <NavBar title={searchedCourse} backIcon />
      <AtNoticebar><Text className='notice-bar'>当前评论时间显示为北京时间</Text></AtNoticebar>
      <CourseInfo />
      <IconReview />

      <View className='fab-background'></View>
      <View className='add-icon'>
      <AddReview onClick={() => {pageScrollState(stopScroll)}} />
      </View>

      <View className='reviews'>
        <AtAccordion open={outstandingReview} isAnimation={false} 
        title='优秀评价' className='review-title'
        onClick={() => {outstandingReviewState(outstandingReview?false:true)}}>
          <AtList hasBorder={false} className='list-review'>
            {reviews.map((singleReview) => {
              if (singleReview.isOutstanding) {
                number ++;
                if (singleReview.openid == selfOpenId) {
                  return ( 
                    <View onClick={() => dispatch(setClickedReview(singleReview))}>
                      <OwnReview review={singleReview} color='#d0d3ff' />
                    </View>
                )} else {
                  return ( 
                    <View onClick={() => dispatch(setClickedReview(singleReview))}>
                      <OthersReview review={singleReview}  color='#d7e6ff' />   
                    </View>
              )}}})}
          </AtList>
          {withoutReview()}
        </AtAccordion>
      
        <AtAccordion open={otherReview} isAnimation={false} 
        title='其他评价' className='review-title'
        onClick={() => {otherReviewState(otherReview?false:true)}}>
          <AtList hasBorder={false} className='list-review'>
            {reviews.map((singleReview) => {
              if (!singleReview.isOutstanding) {
                number = 1;
                if (singleReview.openid == selfOpenId) {
                  return ( 
                    <View onClick={() => dispatch(setClickedReview(singleReview))}>
                      <OwnReview review={singleReview} color='rgb(255, 255, 255)' />
                    </View>
                )} else {
                  return ( 
                    <View onClick={() => dispatch(setClickedReview(singleReview))}>
                      <OthersReview review={singleReview} color='rgb(255, 255, 255)' />   
                    </View>
            )}}})}
          </AtList>
          {withoutReview()}
        </AtAccordion>
      </View>
    </View>
  )
}