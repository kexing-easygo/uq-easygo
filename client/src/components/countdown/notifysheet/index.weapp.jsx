import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {AtActionSheet, AtActionSheetItem, AtButton, AtSwitch} from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import './index.less'
import { setNotifications } from "../../../services/countdown";
import { resetAskSave, setAskSave } from "../../../features/countdown-slice";

export default function NotifySheet(props) {
  const {isOpen, closeNotifyMenu} = props
  const {notifications, askSave} = useSelector(state => state.countdown)
  const { userEmail } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [wxNotify, setWXNotify] = useState(notifications.wechat.enabled)
  const [emailNotify, setEmailNotify] = useState(notifications.email.enabled)
  const [oneDayNotify, setOneDayNotify] = useState(false)
  const [threeDayNotify, setThreeDayNotify] = useState(false)
  const [oneWeekNotify, setOneWeekNotify] = useState(false)
  const [switchDisabled, setSwitchDisabled] = useState(true)
  useEffect(()=>{
    if (wxNotify || emailNotify) setSwitchDisabled(false)
    if (wxNotify == true) {
      setOneDayNotify(notifications.wechat.attributes[0])
      setThreeDayNotify(notifications.wechat.attributes[1])
      setOneWeekNotify(notifications.wechat.attributes[2])
    } 
    if (emailNotify == true) {
      setOneDayNotify(notifications.email.attributes[0])
      setThreeDayNotify(notifications.email.attributes[1])
      setOneWeekNotify(notifications.email.attributes[2])
    }
    if (!wxNotify && !emailNotify) {
      setSwitchDisabled(true)
    }
  }, [wxNotify, emailNotify])
  useEffect(() => {
    dispatch(resetAskSave())
  }, [])

  const handleConfirm = () => {
    if (!askSave) {
      closeNotifyMenu(false)
      return;
    }
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
      userEmail: userEmail
    }
    dispatch(setNotifications(param))
    closeNotifyMenu(false)
  }

  return (
    <AtActionSheet className='notify-sheet' isOpened={isOpen} onClose={()=>{closeNotifyMenu(false)}}>

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
          disabled={switchDisabled}
          onChange={(value)=>{setOneDayNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>
      <AtActionSheetItem className='sheet-item'>
        <AtSwitch 
          title='提前三天提醒' 
          checked={threeDayNotify} 
          disabled={switchDisabled}
          onChange={(value)=>{setThreeDayNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>
      <AtActionSheetItem className='sheet-item'>
        <AtSwitch 
          title='提前一周提醒' 
          checked={oneWeekNotify} 
          disabled={switchDisabled}
          onChange={(value)=>{setOneWeekNotify(value); dispatch(setAskSave())}}/>
      </AtActionSheetItem>

      <AtActionSheetItem>
        <View className='buttons'>
          <AtButton size='small' circle={true} onClick={()=>{closeNotifyMenu(false)}}>取消</AtButton>
          <AtButton size='small' circle={true} onClick={() => handleConfirm()}>保存</AtButton>
        </View>
      </AtActionSheetItem>

    </AtActionSheet>
  )
}