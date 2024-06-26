import React, { useState, useEffect } from 'react'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtFab, AtFloatLayout, AtInput, AtTextarea, AtButton } from "taro-ui"
import { AtToast, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { starIcon } from '../../../assets/images/review-icons.json'
import './index.less'
import { useSelector, useDispatch } from 'react-redux'
import { addSubReview, updateSubReview } from "../../../services/review"
import { setSubReviewEdit, setReplySubReview } from "../../../features/review-slice"
import { getLocalOpenId } from "../../../services/login"

/*
添加 or 修改追评
*/
export default function AddSubReview() {
  const { clickedReview, searchedCourse } = useSelector(state => state.review);
  const { editSubReview, clickedSubReview, replySubReview } = useSelector(state => state.review);
  const { nickName, avatarUrl } = useSelector(state => state.user);
  const [authorName, setAuthorName] = useState(nickName); // 发布者名字
  const [reviewContent, setReviewContent] = useState(''); // 追评内容
  const [reminderText, setReminderText] = useState(''); // toast提醒文字
  const [showContent, showContentState] = useState(false); // Float Layout开关
  const [showToast, setToastState] = useState(false); // toast 开关
  const [showModal, changeModalState] = useState(false); // modal 开关
  const [emptyName, setEmptyName] = useState(false); // 名字空白 警示开关
  const [selfOpenId, setSelfOpenId]= useState('');  // open ID
  const [editReview, setEditReview] = useState(false); // 修改模式开关
  const [placeholder, setPlaceholder] = useState('请写下你的评论'); // 追评内容占位符
  const [replyReview, setReplyReview] = useState(false); // 回复追评开关
  const [repliedAuthor, setRepliedAuthor]= useState('');  // 记录修改追评时 ’@XXX‘
  const [floatTitle, setFloatTitle] = useState(false); // float layout 标题（修改 or 添加）
  const [modalTitle, setModalTitle]= useState(false);// modal 内容（修改 or 添加）
  const dispatch = useDispatch();

  // 检查所填内容
  const checkContent = () => {
    setEmptyName(false);
    if (authorName.length == 0 || authorName.replace(/ /g,'').length == 0) { // 名字没填 or 填入空白字符
      setReminderText('请输入姓名'); 
      setEmptyName(true);
      setToastState(true);
    } else if (authorName.indexOf('楼') != -1 && authorName.indexOf('主') != -1) { // 名字同时有‘楼’ 和 ‘主’ 两个字
      setReminderText('不可以这样写名字哦');
      setEmptyName(true);
      setToastState(true);
    } else if (authorName.replace(/ /g,'') == '我') { // 名字只有‘我‘ 
      setReminderText('不可以这样写名字哦'); 
      setEmptyName(true);
      setToastState(true);
    } else if (reviewContent.length == 0 || reviewContent.replace(/ /g,'').replace(/\n/g,'').length == 0 ) { // 评论内容没填 or 填入空白字符
      setReminderText('请写下你的评论');
      setToastState(true);
    } else if (editReview 
      && clickedSubReview.posterName == handleString(authorName)
      && clickedSubReview.content == handleString(reviewContent)) { // 如果修改时 没修改内容
          setReminderText('请修改你的评论');
          setToastState(true);
    } else if (replyReview && editReview) { // 修改回复追评时 没修改内容
      let begin = clickedSubReview.content.indexOf(':');
      if (clickedSubReview.content.substring(begin+2, clickedSubReview.content.length) == handleString(reviewContent)) {
        setReminderText('请修改你的评论');
        setToastState(true);
      } else {
        showContentState(false);
        changeModalState(true);
      } 
    } else {
      showContentState(false);
      changeModalState(true);
    }
  }

  // 清空所填内容 
  const clearContent = () => {
    setAuthorName(nickName);
    setPlaceholder('请写下你的评论');
    setReviewContent('');
    setEmptyName(false);
    setEditReview(false);
  }

  // 处理名字、评论 左右的空白字符 
  const handleString = (value) => {
    const whitespace = " \n";  
    let left = 0, length = value.length, right = value.length - 1;
    // 左边空白字符 
    while (left < length && whitespace.indexOf(value.charAt(left)) != -1){  
      left++;  
    }  
    // 右边空白字符 
    while (right > 0 && whitespace.indexOf(value.charAt(right)) != -1){  
      right--;  
    } 
    return value.substring(left, right + 1);  
  }

  // 发送数据 渲染新增 or 修改的追评 
  const submitData = () => {
    if (editReview) {
      const param = {
        subReviewId: clickedSubReview.review_id,
        courseCode: searchedCourse,
        reviewId: clickedReview.review_id,
        subReviewObj: {
          posterName: handleString(authorName), 
          content: replyReview? handleString(repliedAuthor + reviewContent):handleString(reviewContent),
        }
      }
      dispatch(updateSubReview(param));
    } else {
      const param = {
        courseCode: searchedCourse,
        reviewId: clickedReview.review_id,
        subReviewObj: {
          posterName: handleString(authorName), 
          content: replyReview? handleString('@' + clickedSubReview.posterName + ': ' + reviewContent):handleString(reviewContent),
          openid: selfOpenId,
          avatarUrl: avatarUrl,
        }
      }
      dispatch(addSubReview(param));
    }
    showContentState(false);
    setReplyReview(false);
    clearContent();
  }

  // 填入之前编辑的内容 (修改时)
  const fillContent = () => {
    if (editSubReview) {
      setAuthorName(clickedSubReview.posterName);
      if (clickedSubReview.content[0] == '@') {
        let begin = clickedSubReview.content.indexOf(':');
        setRepliedAuthor(clickedSubReview.content.substring(0, begin+2));
        setReviewContent(clickedSubReview.content.substring(begin+2, clickedSubReview.content.length));
        setReplyReview(true);
      } else {
        setReviewContent(clickedSubReview.content);
      }
      setEditReview(true);
      showContentState(true);
      dispatch(setSubReviewEdit(false));
      setFloatTitle(true);
      setModalTitle(true);
    } else if (replySubReview) {
      setPlaceholder('@' + clickedSubReview.posterName + ': ');
      setReplyReview(true);
      showContentState(true);
      dispatch(setReplySubReview(false));
    }
  }

  useEffect(() =>{fillContent();})

  // 获取 open ID
  useEffect(
    async() => {
      const openid = await getLocalOpenId();
      setSelfOpenId(openid)
    }, []
  )


  return (
    <View>
      <AtFab size='small' onClick={() => {showContentState(true);setModalTitle(false);setFloatTitle(false);}}>
        <Text className='at-fab__icon at-icon at-icon-add'></Text>
      </AtFab>

      <AtFloatLayout isOpened={showContent} title={floatTitle? '修改评论':'追加评论'}
        onClose={() => {showContentState(false);clearContent();setModalTitle(false);}} >
        <AtInput name='name' title='姓名' type='text' placeholder='' value={authorName} 
          border={false} error={emptyName} className='input-first-part single-input' 
          onChange={(value) => {setAuthorName(value)}} />
        <Image src={starIcon} className='first-star-icon' />
        <View className='text-area' >
          <AtTextarea maxLength={150} placeholder={placeholder} height={220} value={reviewContent} 
          showConfirmBar={true} onChange={(value) => {setReviewContent(value)}}  />
        </View>
        <AtButton type='primary'  size='small'  className='button1' 
        circle={true} onClick={() => checkContent()}>
          确认</AtButton>
        <AtButton type='secondary'  size='small'  className='button2' circle={true} 
          onClick={() => {clearContent();}}>
          删除</AtButton>
      </AtFloatLayout>

      <AtToast isOpened={showToast} text={reminderText} duration='800' hasMask={true}
        onClick={() => {setToastState(false);}}
        onClose={() => {setToastState(false);}}>
      </AtToast>
      
      <AtModal isOpened={showModal} onClose={() => {changeModalState(false);showContentState(true)}}>
          <AtModalHeader>温馨提示</AtModalHeader>
          <AtModalContent>
          {modalTitle? '请问确定要修改此评论吗?':'请问确定要添加此评论吗?'}
          </AtModalContent>
          <AtModalAction> 
            <Button onClick={() => {changeModalState(false);showContentState(true)}}>取消</Button> 
            <Button onClick={() => {changeModalState(false);submitData();setFloatTitle(false);}}>确定</Button> 
          </AtModalAction>
      </AtModal>
    </View>
  )
}