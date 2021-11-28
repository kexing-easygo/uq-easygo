import { getLocalOpenId } from './login'
import { callCloud } from '../utils/cloud'
import { createAsyncThunk } from '@reduxjs/toolkit'

/**
 * 从数据库中获取用户的个人信息
 */
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async () => {
    console.log('fetching user info...')
    const _openId = await getLocalOpenId();
    const userInfo = await callCloud('main-login', 'getUserInfo', { openid: _openId });
    return userInfo.result;
  }
)

/**
 * 更新上课模式
 */
export const updateClassMode = createAsyncThunk(
  'user/updateClassMode',
  async (_classMode) => {
    const params = {
      openid: await getLocalOpenId(),
      classMode: _classMode
    }
    await callCloud('main-login', 'updateClassMode', params);
    return _classMode;
  }
)