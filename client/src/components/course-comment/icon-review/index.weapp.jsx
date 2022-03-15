import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.less'
import { useSelector, useDispatch } from 'react-redux'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtToast, AtIcon} from "taro-ui"
import { setClickedIconReview } from "../../../features/review-slice";
import { addReviewDimensions } from "../../../services/review";


/*
好过,好难等 4个小图标评论
*/
export default function IconReview() {
  const { reviewedIcon, clickedIconReview, dimensions, searchedCourse } = useSelector(state => state.review);
  const[passState, changePassState] = useState(reviewedIcon == 0? 
    ['good-copy','#FFB017','20','50px','10rpx','icons pass-icon2']:
    ['good-fill-copy','#BDBCBC','26','100rpx','-12rpx','icons pass-icon']); // 好过图标
  const[hardState, changeHardState] = useState(reviewedIcon == 1? '#2230AF':'#BDBCBC'); // 好难图标
  const[sevenState, changeSevenState] = useState(reviewedIcon == 2? '#FF4D00':'#BDBCBC'); // 好7图标
  const[luckyState, changeLuckyState] = useState(reviewedIcon == 3? '#2AAA15':'#BDBCBC'); // 运气图标
  const[showModal, changeModalState] = useState(false); // modal 开关
  const[showToast, changeToastState] = useState(false); // toast 开关
  const[showCount, showCountState] = useState(reviewedIcon == 4? false:true); // 展示总数
  const [marginLeft, changeMarginLeft] = useState(showCount?'-12px':'0px'); // 调整边距（根据展示总数 or not)
  const dispatch = useDispatch();

  // 添加图标评论
  const changeState = () => {
    let dimensionIndex = -1;
    changeModalState(false);
    if ( clickedIconReview=='passIcon' ) {
        changePassState(['good-copy','#FFB017','20','50px','10rpx','icons pass-icon2']);
        dimensionIndex = 0;
    } else if ( clickedIconReview=='hardIcon' ) {
        changeHardState('#2230AF');
        dimensionIndex = 1;
    } else if ( clickedIconReview=='sevenIcon' ) {
        changeSevenState('#FF4D00');
        dimensionIndex = 2;
    } else if ( clickedIconReview=='luckyIcon' ) {
        changeLuckyState('#2AAA15');
        dimensionIndex = 3;
    }
    const param = {
      courseCode: searchedCourse,
      dimensionIndex: dimensionIndex
    }
    dispatch(addReviewDimensions(param));
    showCountState(true);
    changeMarginLeft('-12px');
  }

  // 判断是否评论过
  const reminder = (icontype) => {
    if (reviewedIcon == 4) {
      dispatch(setClickedIconReview(icontype));
      changeModalState(true);
    } else {
      changeToastState(true);
    }
  }

  // 判断是否显示 评论总数
  const countText = (iconType) => {
    if (showCount) {
      if (iconType == 'passIcon') {
        return '(' + dimensions[0] + ')';
      } else if (iconType == 'hardIcon') {
        return '(' + dimensions[1] + ')';
      } else if (iconType == 'sevenIcon') {
        return '(' + dimensions[2] + ')';
      } else if (iconType == 'luckyIcon') {
        return '(' + dimensions[3] + ')';
      }
    } else {
      return '';
    }
  }


  return (
    <View className='icons-review' style={{marginLeft:marginLeft}}>
      <View onclick={() => {reminder('passIcon')}} className='pass-view'
      style={{marginLeft:passState[4]}} >
        <AtIcon prefixClass='icon' value={passState[0]} size={passState[2]} 
        color={passState[1]} className={passState[5]}></AtIcon>
        <Text className='text' style={{marginLeft:passState[3]}}>好过{countText('passIcon')}</Text>
      </View>
      <View onclick={() => {reminder('hardIcon')}} className='hard-view'>
        <AtIcon prefixClass='icon' value='bad-fill-copy' size='26' color={hardState}
          className='icons hard-icon' ></AtIcon>
        <Text className='text'>好难{countText('hardIcon')}</Text>
      </View>
      <View onclick={() => {reminder('sevenIcon')}} className='seven-view'>
        <AtIcon prefixClass='icon' value='seven-key-copy' size='20' color={sevenState}
            className='icons seven-icon' ></AtIcon>
        <Text className='text'>好拿7{countText('sevenIcon')}</Text>
      </View>
      <View onclick={() => {reminder('luckyIcon')}} className='lucky-view'>
        <AtIcon prefixClass='icon' value='lucky-copy' size='18' color={luckyState}
          className='icons lucky-icon' ></AtIcon>
        <Text className='text'>看运气{countText('luckyIcon')}</Text>
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