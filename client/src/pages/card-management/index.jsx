import React from 'react'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"
import NavBar from '../../components/navbar'
import './index.less'

export default function CardManagement() {
  const handleManageCard = () => console.log('switching')
  return (
    <View className=''>
      <NavBar title="卡片管理" backIcon />

      <AtList>
        <AtListItem
          title='今日课程'
          isSwitch
          onSwitchChange={handleManageCard}
        />
        <AtListItem
          title='最新活动'
          isSwitch
          onSwitchChange={handleManageCard}
        />
      </AtList>

      <View className='info-text center-text'>
        管理首页显示的卡片
      </View>
    </View>
  )
}
