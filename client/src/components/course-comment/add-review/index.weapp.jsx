import React, { useState, useEffect } from 'react'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtModalAction } from "taro-ui"
import { AtFloatLayout, AtInput, AtTextarea, AtFab } from "taro-ui"
import { AtButton, AtToast, AtModal, AtModalHeader, AtModalContent } from "taro-ui"
import { starIcon } from '../../../assets/images/review-icons.json'
import './index.less'
import { useSelector, useDispatch } from 'react-redux'
import { addReview, updateReview } from "../../../services/review"
import { setEditModal } from "../../../features/review-slice"

/*
添加 or 修改课评
*/
export default function AddReview() {
  const { clickedReview, editModal, searchedCourse } = useSelector(state => state.review);
  const { nickName, avatarUrl } = useSelector(state => state.user);
  const [authorName, setAuthorName] = useState(nickName); // 作者名字
  const [semester, setSemester] = useState('Semester 2，2021'); // 学习学期
  const [mark, setMark] = useState(''); // 分数
  const [reviewContent, setReviewContent] = useState(''); // 评论内容
  const [editReview, setEditReview] = useState(false); // 修改模式开关
  const [showContent, showContentState] = useState(false); // float layout 开关
  const [showSemester, showSemesterState] = useState(false); // 学期选项action sheet开关
  const [reminderText, setReminderText] = useState(''); // toast的文字
  const [showToast, setToastState] = useState(false); // toast开关
  const [showModal, changeModalState] = useState(false); // modal开关
  const [emptyName, setEmptyName] = useState(false); // 作者名字空白 or not
  // const [emptySemester, setEmptySemester] = useState(false); // 学习学期空白 or not
  const dispatch = useDispatch();

  // 检查所填内容
  const checkContent = () => {
    // setEmptySemester(false);
    setEmptyName(false);
    if (authorName.length == 0 || authorName.replace(/ /g,'').length == 0) { // 名字没填 or 填入空白字符
      setReminderText('请输入姓名');
      setEmptyName(true);
      setToastState(true);
    } else if (authorName.indexOf('楼') != -1 && authorName.indexOf('主') != -1) {
      setReminderText('不可以这样写名字哦'); // 名字同时有‘楼’ 和 ‘主’ 两个字
      setEmptyName(true);
      setToastState(true);
    } // else if (semester.length == 0) {
      // setReminderText('请选择学期');
      // setEmptySemester(true);
      // setToastState(true);
    // }
     else if (reviewContent.length == 0 || reviewContent.replace(/ /g,'').replace(/\n/g,'').length == 0 
     ) { // 评论内容没填 or 填入空白字符
      setReminderText('请写下你的评论');
      setToastState(true);
    } else if (editReview && clickedReview.posterName == handleString(authorName)
     && clickedReview.studySemester == semester && clickedReview.mark == mark 
     && clickedReview.content == handleString(reviewContent)) { // 如果修改时 没修改内容
      setReminderText('请修改你的评论');
      setToastState(true);
    } else {
      showContentState(false);
      changeModalState(true);
    }
  }

  // 清空所填内容
  const clearContent = () => {
    setAuthorName(nickName);
    setSemester('Semester 2，2021');
    setMark('');
    setReviewContent('');
    // setEmptySemester(false);
    setEmptyName(false);
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

  // 提交数据 新增or修改的课评 
  const submitData = () => {
    if (editReview) {
      const param = {
        reviewId: clickedReview.review_id,
        courseCode: searchedCourse,
        updatedObj: {
          posterName: handleString(authorName), 
          studySemester: semester,
          content: handleString(reviewContent),
          mark: mark
        }
      }
      dispatch(updateReview(param));
    } else {
      const param = {
        courseCode: searchedCourse,
        posterName: handleString(authorName), 
        studySemester: semester,
        content: handleString(reviewContent),
        isOutstanding: false,
        mark: mark,
        dimensions:[0, 0],
        likes: [],
        avatarUrl: avatarUrl,
        sub_review: []
      }
      dispatch(addReview(param));
    }
    setEditReview(false);
    showContentState(false);
    clearContent();
  }

  // 关闭学期选项 打开float layout 
  const closeActionSheet = () => {
    showSemesterState(false);
    showContentState(true);
  }

  // 填入之前编辑的内容 (修改时)
  const fillContent = () => {
    if (editModal) {
      setAuthorName(clickedReview.posterName);
      setSemester(clickedReview.studySemester);
      setMark(clickedReview.mark);
      setReviewContent(clickedReview.content);
      setEditReview(true);
      showContentState(true);
      dispatch(setEditModal(false));
    }
  }

  useEffect(() =>{fillContent()})


  return (
    <View>
        <AtFab size='small' onClick={ () => showContentState(true)}>
          <Text className='at-fab__icon at-icon at-icon-add'></Text>
        </AtFab>

      {/*<AtTabBar fixed backgroundColor='#e5eaf4' iconSize='35'
        tabList={[{ title: '' }, { title: '' }, { title: '' }, { image: addReviewIcon }]}
        onClick={ () => showContentState(true)} />*/}
      
      <AtFloatLayout isOpened={showContent} onClose={() => {showContentState(false);clearContent()}} >
        {/*<Text className='title-icon'>I</Text><Text className='title'>基本信息</Text>*/}
        <AtInput name='name' title='姓名' type='text' placeholder='' value={authorName} 
          border={false} error={emptyName} className='input-first-part single-input' 
          onChange={(value) => {setAuthorName(value)}} />
        <Image src={starIcon} className='first-star-icon' />
        {/*<AtInput name='semester' title='学习学期' type='text' placeholder='Semester 2，2021' value={semester} 
          border={false} error={emptySemester} className='single-input' 
          onChange={(value) => {setSemester(value)}}  
          onFocus={() => {showContentState(false);showSemesterState(true)}} />*/}
        <View className='semester' onClick={() => {showContentState(false);showSemesterState(true)}}>
          <Text>学习学期</Text>
          <Text className='select-semester'>{semester}</Text>
        </View>
        <Image src={starIcon} className='second-star-icon' />
        <AtInput name='mark' title='最终成绩' type='number' className='single-input' border={false}
          placeholder='成绩不会以任何方式泄漏' value={mark}
          onChange={(value) => {setMark(value)}} />
        {/*<Text className='title-icon'>I</Text><Text className='title'>课程评价</Text>*/}
        <View className='text-area' >
          <AtTextarea maxLength={150} placeholder='请写下你的评论' height={300} value={reviewContent} 
          showConfirmBar={true} onChange={(value) => {setReviewContent(value)}}  />
        </View>
        <AtButton type='primary' size='small'
        className='button1' circle={true} onClick={() => checkContent()}>
          确认</AtButton>
        <AtButton type='secondary' size='small' className='button2' circle={true} 
          onClick={() => {clearContent();showContentState(false)}}>
          取消</AtButton>
      </AtFloatLayout>
    
      <AtActionSheet isOpened={showSemester} cancelText='取消' title='请选择学期' 
        onCancel={() => {closeActionSheet()}}
        onClose={() => {closeActionSheet()}} >
        <AtActionSheetItem onClick={() => {setSemester('Semester 1，2021');closeActionSheet()}}> 
          Semester 1，2021 
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => {setSemester('Semester 2，2021');closeActionSheet()}}> 
          Semester 2，2021 
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => {setSemester('Semester 1，2022');closeActionSheet()}}> 
          Semester 1，2022 
        </AtActionSheetItem>
      </AtActionSheet>

      <AtToast isOpened={showToast} text={reminderText} duration='800' hasMask={true}
        onClick={() => setToastState(false)}
        onClose={() => setToastState(false)}>
      </AtToast>

      <AtModal isOpened={showModal} onClose={() => {changeModalState(false);showContentState(true)}}>
          <AtModalHeader>温馨提示</AtModalHeader>
          <AtModalContent>
            请问确定要给予这个评价吗?
          </AtModalContent>
          <AtModalAction> 
            <Button onClick={() => {changeModalState(false);showContentState(true)}}>取消</Button> 
            <Button onClick={() => {changeModalState(false);submitData()}}>确定</Button> 
          </AtModalAction>
      </AtModal>
    </View>
  )
}