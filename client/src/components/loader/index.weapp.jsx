import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { pizza } from '../../assets/images/launch.json'
import './index.less'

export default function LoadingPage() {
  return (
    <View className='loading-page'>
      <Image src={pizza} alt="a spinning glass of water with ice cubes in it" />
      <Text>UQ-EasyGo!!</Text>
      <Text>这只是一个loading图片的示例</Text>
      <Text>毕竟看起来这个小程序和pizza没什么关系Hahahahaha</Text>
    </View>
  );
}

export function Loader() {
  return (
    <View>
      <Image src={pizza} alt="a spinning piece of pizza" />
    </View>
  );
}
