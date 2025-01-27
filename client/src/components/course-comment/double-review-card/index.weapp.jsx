import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.less'
import { useDispatch, useSelector } from 'react-redux'
import { AtIcon, AtModal, AtModalAction, AtModalHeader, AtModalContent } from "taro-ui"
import { getLocalOpenId } from "../../../services/login"
import { setSubReviewEdit, setReplySubReview } from "../../../features/review-slice"
import { deleteSubReview } from "../../../services/review";

/*
追评卡片
*/
export default function DoubleReviewCard(props) {
  const { subReview } = props;
  const { postDate, posterName, content, postTime, avatarUrl, openid, review_id } = subReview;
  const { clickedReview, searchedCourse } = useSelector(state => state.review);
  let cardMarginTop = ''; // 追评卡片 相对于头像 的位置
  let backgroundColor = ''; // 追评卡片背景颜色
  let border = ''; // 追评卡片边框
  let contentBytes = 0; // 追评内容长度
  let paddingBottom = '';
  let showAction = ''; // 修改 删除 显示 or not
  let photoMarginLeft = ''; // 头像位置
  let cardMarginLeft = ''; // 追评卡片位置
  const [selfOpenId, setSelfOpenId]= useState('');  // open id
  const [showCancelModal, changeCancelModalState] = useState(false); // 删除追评的modal 开关
  const dispatch = useDispatch();

  // 处理名字问题（eg.超长, 楼主）
  const handleName = (name) => {
    let bytes = 0;
    // 评论内容的长度
    for (let i=0; i<content.length; i++) {
      if (content[i].charCodeAt(0) > 255) {
        contentBytes += 2;
      } else if (content[i] == '\n') {
        contentBytes += 64;
      } else {
        contentBytes ++;
    }}
    // check 楼主
    if (clickedReview.openid == openid && openid != selfOpenId) {
     return '楼 主';
    } 
    // 名字长度
    for (let i=0; i<name.length; i++) {
      if (name[i].charCodeAt(0) > 255) {
        bytes += 2;
      } else {
        bytes ++;
      }
      // 评论内容两行以内的话 名字从第5个字符开始显示‘...’
      if (contentBytes < 64 && bytes > 4 ) {
        return name.substring(0,i) + '...';
      }
      // 评论内容超过两行的话 名字从第11个字符开始显示‘...’
      if (bytes > 10) {
        return name.substring(0,i) + '...';
    }}
    return name;
  }

  // 内容卡片的位置 (根据内容长度改变)
  const cardPosition = () => {
    if (contentBytes < 64) {
      cardMarginTop = '-85px';
    } else {
      cardMarginTop = '-110px';
    }
  }
  
  // check发表人 用相应的style (eg.展示‘修改’,‘删除’等)
  const checkAuthor = () => {
    if (openid == selfOpenId) { // 自己发表的
      backgroundColor = '#D2DBFA';
      border = '4px solid #FFFFFF';
      showAction = 'inherit';
      paddingBottom = '30px';
      photoMarginLeft = '280px';
      cardMarginLeft = '0px';
    } else if (openid != selfOpenId && openid == clickedReview.openid) { // 别人（楼主）发表的
      backgroundColor = '#FFFFFF';
      border = '4px solid #B9C9FE';
      showAction = 'none';
      paddingBottom = '5px';
      photoMarginLeft = '1px';
      cardMarginLeft = '65px';
    } else {// 别人（非楼主）发表的
      backgroundColor = '#FFFFFF';
      border = '4px solid #D2DBFA';
      showAction = 'none';
      paddingBottom = '5px';
      photoMarginLeft = '1px';
      cardMarginLeft = '65px';
    }
  }

  // 删除追评时 发送的数据
  const deleteData = {
    reviewId: clickedReview.review_id,
    subReviewId: review_id,
    courseCode: searchedCourse,
  }

  // 点击追评卡片 if自己的->进入修改 if别人的->回复追评
  const handleClick = () => {
    if (openid == selfOpenId) {
      dispatch(setSubReviewEdit(true));
    } else {
      dispatch(setReplySubReview(true));
    }
  }

  // 获取 open id
  useEffect(
    async() => {
      const openid = await getLocalOpenId();
      setSelfOpenId(openid)
    }, []
  )


  return (
    <View className='sub-card' style={openid == selfOpenId? {marginBottom:'15px'}:''}>
      {checkAuthor()}
      <View className='photo-part' style={{marginLeft:photoMarginLeft}}>
        <Image src={avatarUrl} className='photos'></Image>
        <View style={openid == selfOpenId? {marginLeft:'-5px'}:''}>
          <Text>{handleName(posterName)}</Text>
        </View>
      </View>

      {cardPosition()}
      <View className='content-part' onClick={() => handleClick()}
        style={{marginTop:cardMarginTop,background:backgroundColor,border:border,paddingBottom:paddingBottom, marginLeft:cardMarginLeft}}>
        <Text className='content'>{content}</Text>
        <View><Text className='note'>评论于 {postDate} {postTime}</Text></View>
      </View>

      <View style={{display:showAction}} className='own-action'>
        <View className='edit-icon' onClick={() => {dispatch(setSubReviewEdit(true))}}>
            <AtIcon prefixClass='icon' value='write-copy' size='20'
            color='#586EA9' className='icon'></AtIcon>
          <Text className='text'>修改</Text>
        </View>
        <View className='delete-icon' onClick={() => {changeCancelModalState(true)}}>
          <AtIcon prefixClass='icon' value='delete-copy' size='18'
            color='#586EA9'  className='icons'></AtIcon>
          <Text className='text'>删除</Text>
        </View> 
      </View>

      <AtModal isOpened={showCancelModal} onClose={() => changeCancelModalState(false)}>
        <AtModalHeader>温馨提示</AtModalHeader>
        <AtModalContent>请问确定要删除此评论吗?</AtModalContent>
        <AtModalAction> 
          <Button onClick={() => changeCancelModalState(false)}>取消</Button> 
          <Button onClick={() => {dispatch(deleteSubReview(deleteData));
            changeCancelModalState(false)}}>
            确定
          </Button> 
         </AtModalAction>
      </AtModal>
    </View>
  )
}