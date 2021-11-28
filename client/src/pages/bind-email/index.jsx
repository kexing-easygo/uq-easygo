import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import NavBar from '../../components/navbar'
import { AtList, AtListItem } from 'taro-ui'
import './index.less'

export default function BindEmail() {
  const [status, setStatus] = useState('未绑定');
  return (
    <View>
      <NavBar title="邮箱绑定" backIcon />
      <AtList>
        <AtListItem
          title='邮箱'
          extraText={status}
          arrow='right'
        />
      </AtList>
    </View>
  )
}

