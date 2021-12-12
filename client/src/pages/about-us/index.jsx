import React from 'react'
import { View, Image } from '@tarojs/components'
import NavBar from '../../components/navbar'
import { AtList, AtListItem } from 'taro-ui'
import { logo, QRCode } from '../../assets/images/profile.json'
import './index.less'

export default function AboutUs() {
  return (
    <View className='about-us-view'>
      <NavBar title="UQ校园通" backIcon />
      <View className='about-us-info'>
        <View className='about-us-wrapper'>
          <Image className='logo-img' src={logo} />
          <View className='center-text secondary-text'>
            <View className='usyd-title'>UQ校园通</View>
            <View>Version 1.0.5</View>
          </View>
          <View>
            <View className='response-view center-text'>扫码向开发者反馈</View>
            <AtList>
              <AtListItem
                title='功能异常'
                extraText='反馈小程序功能异常问题'
              />
              <AtListItem
                title='产品建议'
                extraText='提供与产品相关的建议'
              />
            </AtList>
          </View>
          <View className='at-row at-row__justify--center'>
            <Image className='qr-code-img' src={QRCode} />
            <View className='view-more'>
              <View>关注我们 更多资讯等您获取</View>
              <View>微信公众号：UQ校园通</View>
              <View>小红书：UQ校园通</View>
            </View>
          </View>
          {/* <View className='center-text'>电子邮箱：uqzian.wang@qq.com</View> */}
          <View className='center-text secondary-text'>开发组织者：kexing</View>
        </View>
      </View>
    </View>
  )
}

