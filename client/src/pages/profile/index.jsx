import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import NavBar from '../../components/navbar'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import { getUserProfile } from '../../services/login'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { getIcon } from '../../utils/profile'

export default function Profile() {

  const dispatch = useDispatch();
  const { avatarUrl, loginStatus, nickName } = useSelector(state => state.user);

  return (
    <View className="container">
      <NavBar title="我的" />

      <View className="login-view">
        <View className="avatar-view">
          <AtAvatar circle image={avatarUrl} size='large'></AtAvatar>
        </View>

        {loginStatus ?
          <View className="nick-name-view">
            {nickName}
          </View> :
          <AtList hasBorder={false}>
            <AtListItem
              hasBorder={false}
              title='登录/注册'
              arrow='right'
              onClick={() => dispatch(getUserProfile())}
            />
          </AtList>}
      </View>


      <AtList hasBorder={false}>
        <AtListItem
          hasBorder={false}
          title='基本资料'
          arrow='right'
          iconInfo={getIcon('user')}
          onClick={() => Taro.navigateTo({ url: '/pages/basic-info/index' })}
        />
      </AtList>

      <AtList hasBorder={false}>
        <AtListItem
          title='基本设置'
          arrow='right'
          iconInfo={getIcon('settings')}
          onClick={() => Taro.navigateTo({ url: '/pages/basic-setting/index' })}
        />
        <AtListItem
          title='课程管理'
          arrow='right'
          iconInfo={getIcon('calendar')}
        />
        <AtListItem
          title='卡片管理'
          arrow='right'
          iconInfo={getIcon('bookmark')}
          onClick={() => Taro.navigateTo({ url: '/pages/card-management/index' })}
        />
      </AtList>
      <AtList hasBorder={false}>
        <AtListItem
          title='关于我们'
          arrow='right'
          iconInfo={getIcon('message')}
          onClick={() => Taro.navigateTo({ url: '/pages/about-us/index' })}
        />
      </AtList>
    </View>
  )
}
