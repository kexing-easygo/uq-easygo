import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import {AtIcon, AtFab, AtButton, AtActionSheet, AtActionSheetItem} from 'taro-ui'
import ManualAdd from '../../countdown/manualadd/index'
import NotifySheet from '../../countdown/notifysheet/index'
import './index.less'

export default function FabButton(props) {
  const [fabMenu, setFabMenu] = useState(0)
  const [manualAddMenu, setManualAddMenu] = useState(false)
  const [notifyMenu, setNotifyMenu] = useState(false)

  const openManualAdd = () => {
    setFabMenu(false)
    setManualAddMenu(true)
  }
  const openNotifyMenu = () => {
    setFabMenu(false)
    setNotifyMenu(true)
  }
  const jumpToAutoAdd = () => {
    Taro.navigateTo({ url: '/pages/autoadd/index' });
  }
  const handleManualAdd = (value) => {
    setManualAddMenu(value)
  }
  const handleNotifyMenu = (value) => {
    setNotifyMenu(value)
  }
  
  return(
    <View className='fabbutton'>

      {/* 手动添加actionSheet component */}
      <ManualAdd isOpen={manualAddMenu} closeManualAdd={handleManualAdd} />

      {/* 提醒设置actionSheet component */}
      <NotifySheet isOpen={notifyMenu} closeNotifyMenu={handleNotifyMenu} />

      {/* 浮动按钮fabButton icon */}
      <AtFab className="fab" size='small' onClick={()=>setFabMenu(true)}>
        <Text className='at-fab__icon at-icon at-icon-menu'></Text>
      </AtFab>
      
      {/* 浮动按钮菜单fabMenu action sheet*/}
      <AtActionSheet style='position:absolute; bottom:0;' isOpened={fabMenu} 
      onClose={()=>setFabMenu(false)} cancelText='取消'>
    
        <AtActionSheetItem> 
          <AtButton className='manual-add-button' onClick={openManualAdd}>
            <AtIcon value='add-circle' size='20rpx' color='#999'></AtIcon>手动添加
          </AtButton>
        </AtActionSheetItem>

        <AtActionSheetItem className='title'> 
          <AtButton className='auto-add-button' onClick={jumpToAutoAdd}>
            <AtIcon value='check-circle' size='20rpx' color='#999'></AtIcon>自动添加
          </AtButton>
        </AtActionSheetItem>

        <AtActionSheetItem className='title'> 
          <AtButton className='auto-add-button' onClick={openNotifyMenu}>
            <AtIcon value='bell' size='20rpx' color='#999'></AtIcon>提醒设置
          </AtButton>
        </AtActionSheetItem>

      </AtActionSheet>

    </View>
  )
}