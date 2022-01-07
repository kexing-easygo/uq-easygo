import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
export default function NavBar(props) {
  const { title, backIcon = false, handleClickBackBtn = () => Taro.navigateBack() } = props;
  const style = {
    paddingTop: Taro.$navBarMarginTop + 'px',
    backgroundColor: '#fff'
  }
  return (
    <View style={style}>
      <AtNavBar
        color='#000'
        title={title}
        leftIconType={backIcon ? 'chevron-left' : ''}
        onClickLeftIcon={handleClickBackBtn}
      />
    </View>
  )
}
