import Taro from '@tarojs/taro'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'

/**
 * 调用用函数登录，获取当前用户的openID并储存在缓存中，
 * 在app.js中调用
 */
export const login = async () => {
  // 完成后正常使用资源方的已授权的云资源
  const loginRes = await callCloud('login', 'getOpenID');
  const openId = loginRes.result.event.userInfo.openId;
  // const openId = "oe4Eh5bdKz_Ts5Yzu0q0_uTs_4Qc"
  // 将openId储存至缓存中
  await Taro.setStorage({
    key: '_openId',
    data: openId
  })
  return openId;
}

export const getLoginStatus = async () => {
  const _openId = await login();
  // 判断用户是否已经授权，即openid是否已经存在于数据库中
  const loginStatusRes = await callCloud('main-login', 'loginStatus', { openid: _openId });
  return loginStatusRes.result;
}

/**
 * 通过询问授权获取微信用户信息，并在数据中创建用户记录
 */
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async () => {
    try {
      // 询问用户授权
      const userProfileRes = await Taro.getUserProfile({
        lang: 'zh_CN',
        desc: "获取你的昵称、头像、地区及性别"
      })
      await Taro.showToast({
        icon: 'loading',
        title: '登录中'
      });
      const userInfo = userProfileRes.userInfo;
      try {
        const _openid = await getLocalOpenId();
        // 授权成功则创建用户
        await callCloud('main-login', 'createUser', {
          openid: _openid,
          userInfo: userInfo
        })
        Taro.showToast({
          title: "登录成功",
          icon: "success",
        })
        return userInfo;
      } catch (err) {
        Taro.showToast({
          title: "登录失败，请重试",
        })
      }
    } catch (err) {
      if (err.errMsg === "getUserProfile:fail auth deny") {
        Taro.showToast({
          title: "授权后可以使用更丰富的功能哟～",
          icon: "none",
        })
      }
    }
  }
)

/**
 * 从缓存中读取openID
 */
export const getLocalOpenId = async () => {
  const openId = await Taro.getStorage({ key: '_openId' });
  return openId.data;
}
