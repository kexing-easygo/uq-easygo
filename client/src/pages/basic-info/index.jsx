import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import NavBar from '../../components/navbar'
import { AtList, AtListItem } from 'taro-ui'
import { useSelector } from 'react-redux'
import './index.less'
export default function BasicInfo() {

  const { loginStatus, nickName, userEmail, userMobile } = useSelector(state => state.user);
  const username = loginStatus ? nickName : '尚未登录';

  return (
    <View>
      <NavBar title="基本资料" backIcon />
      <AtList>
        <AtListItem
          title='用户名'
          extraText={username}
        />
      </AtList>
      <AtList>

        <AtListItem
          title='邮箱'
          arrow='right'
          extraText={userEmail || '未绑定'}
          onClick={() => Taro.navigateTo({ url: '/pages/bind-email/index' })}
        />
      </AtList>
    </View>
  )
}

