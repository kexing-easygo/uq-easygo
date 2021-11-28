import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import { waiting } from '../../assets/images/profile.json'
export default function BindPhone() {
  return (
    <View className='phone-bind-view'>
      <NavBar title="手机绑定" backIcon />
      <View className='notice-img-view'>
        <Image className='notice-img' src={waiting} />
      </View>
    </View>
  )
}

