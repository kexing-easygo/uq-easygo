import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem, AtButton, AtSwitch} from 'taro-ui'
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from "taro-ui";
import { useDispatch, useSelector } from 'react-redux'
import './index.less'
import { setNotifications } from "../../../services/countdown";
import { resetAskSave, setAskSave } from "../../../features/countdown-slice";
import { setNotifyMenu } from "../../../features/countdown-slice";


export default function NotifySheet(props) {
  const {notifications, askSave} = useSelector(state => state.countdown)
  const { userEmail } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [wxNotify, setWXNotify] = useState(notifications.wechat.enabled)
  const [emailNotify, setEmailNotify] = useState(notifications.email.enabled)
  const [oneDayNotify, setOneDayNotify] = useState(notifications.wechat.attributes[0])
  const [threeDayNotify, setThreeDayNotify] = useState(notifications.wechat.attributes[1])
  const [oneWeekNotify, setOneWeekNotify] = useState(notifications.wechat.attributes[2])
  const { notifyMenu } = useSelector(state => state.countdown)

  const [showModal, setShowModal] = useState(false)
  const modalContent = {
    title: '尚未绑定邮箱',
    onConfirm: () => {
      Taro.navigateTo({ url: '/pages/bind-email/index' })
      setShowModal(false);
      dispatch(setNotifyMenu(false))
    },
    content: '绑定邮箱才能接受邮箱提醒哦~',
    confirmText: '去绑定'
  }

  useEffect(() => {
    dispatch(resetAskSave())
  }, [])

  /**
   * 检查用户的提醒设置是否有效。有效地判断规则：
   * 如果想设置1天/3天/7天，则至少打开微信/邮箱提醒中的一个
   */
  const checkValidSettings = () => {
    // 邮箱提醒但未绑定邮箱
    if (emailNotify && userEmail == '') {
      setShowModal(true)
      // Taro.showModal({
      //   content: "你还没有绑定邮箱哦",
      //   title: "温馨提示"
      // })
      return false
    }
    if (!emailNotify && !wxNotify) {
      if (oneDayNotify || threeDayNotify || oneWeekNotify) {
        Taro.showModal({
          content: "请至少设置邮箱或微信提醒的一个",
          title: "温馨提示"
        })
        return false
      }
    }
    return true
  }

  const handleConfirm = () => {
    if (!askSave) {
      // closeNotifyMenu(false)
      dispatch(setNotifyMenu(false))
      return;
    }
    if (checkValidSettings()) {
      const param = {
        wechat: {
          enabled: wxNotify,
          attributes: [
            oneDayNotify ? 1 : 0,
            threeDayNotify ? 1 : 0,
            oneWeekNotify ? 1 : 0,
          ]
        },
        email: {
          enabled: emailNotify,
          attributes: [
            oneDayNotify ? 1 : 0,
            threeDayNotify ? 1 : 0,
            oneWeekNotify ? 1 : 0,
          ]
        },
      }
      dispatch(setNotifications(param))
      dispatch(setNotifyMenu(false))
    }
  }

  return (
    <AtActionSheet className='notify-sheet' isOpened={notifyMenu} onClose={()=>{dispatch(setNotifyMenu(false))}}>

      <AtActionSheetItem className='sheet-header'>
        <View className='blue-block'></View>
        <Text>提醒方式</Text>
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <AtSwitch title='微信提醒' checked={wxNotify} onChange={(value)=>{setWXNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>
      <AtActionSheetItem className='sheet-item'>
        <AtSwitch title='邮件提醒' checked={emailNotify} onChange={(value)=>{setEmailNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-header'>
        <View className='blue-block'></View>
        <Text>提醒时间</Text>
      </AtActionSheetItem>

      <AtActionSheetItem className='sheet-item'>
        <AtSwitch 
          title='提前一天提醒' 
          checked={oneDayNotify} 
          onChange={(value)=>{setOneDayNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>
      <AtActionSheetItem className='sheet-item'>
        <AtSwitch 
          title='提前三天提醒' 
          checked={threeDayNotify} 
          onChange={(value)=>{setThreeDayNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>
      <AtActionSheetItem className='sheet-item'>
        <AtSwitch 
          title='提前一周提醒' 
          checked={oneWeekNotify} 
          onChange={(value)=>{setOneWeekNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>

      <AtActionSheetItem>
        <View className='buttons'>
          <AtButton size='small' circle={true} onClick={() => {
              dispatch(resetAskSave())
              dispatch(setNotifyMenu(false))
            }}>取消</AtButton>
          <AtButton size='small' circle={true} onClick={() => handleConfirm()}>保存</AtButton>
        </View>
      </AtActionSheetItem>
      <AtModal isOpened={showModal} onClose={() => setShowModal(false)}>
        <AtModalHeader>{modalContent.title}</AtModalHeader>
        <AtModalContent>{modalContent.content}</AtModalContent>
        <AtModalAction>
          <AtButton
            full
            circle
            type="primary"
            size="small"
            onClick={modalContent.onConfirm}
            customStyle={{ margin: "24rpx" }}
          >
            {modalContent.confirmText}
          </AtButton>
        </AtModalAction>
      </AtModal>
    </AtActionSheet>
    
  )
}