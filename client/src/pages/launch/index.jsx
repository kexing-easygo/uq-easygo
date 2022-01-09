import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import LoadingPage from '../../components/loader/index'
import { getLoginStatus } from '../../services/login'
import { initCloud } from '../../utils/cloud'
import { useDispatch } from 'react-redux'
import { setLoginStatus } from '../../features/user-slice'
import { fetchSelectedCourses, fetchCurrentSemester } from '../../services/course'
import { fetchUserInfo, getCardsInfo } from '../../services/profile'
/**
 * 启动页执行
 * 1. 初始化云环境
 * 2. 获取登录状态并存入redux
 * 3. 如果登录获取所选课程和用户信息
 */
export default function Launch() {

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (process.env.TARO_ENV === 'weapp') {
        // 初始化云环境
        await initCloud();
        // 获取openId和登录状态
        let loginStatus = await getLoginStatus();
        console.log('launch', loginStatus);
        dispatch(setLoginStatus(loginStatus));
        if (loginStatus) {
          dispatch(fetchUserInfo());
          dispatch(getCardsInfo());
          dispatch(fetchSelectedCourses());
          dispatch(fetchCurrentSemester())
        }
        Taro.switchTab({ url: '/pages/index/index' })
        // Taro.navigateTo( {url: "/pages/bind-email/index"} )
      }
    })()
  }, [])
  return <LoadingPage />
}
