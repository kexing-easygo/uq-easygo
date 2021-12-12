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

/**
 * 获取用户自定义的卡片展示状态
 */
export const getCardsInfo = createAsyncThunk(
  'user/getCardsInfo',
  async () => {
    const cardsInfoRes = await callCloud('main-login', 'getCardsInfo', { openid: await getLocalOpenId() });
    return cardsInfoRes.result;
  }
)

/**
 * 改变卡片管理页面的开关时，调用云函数改变cardsInfo
 * 隐藏/取消首页的卡片
 */
export const manageCards = createAsyncThunk(
  'user/manageCards',
  async (cardState, { getState }) => {
    const { cardsInfo } = getState().user;
    const _openId = await getLocalOpenId();
    const _cardsInfo = { ...cardsInfo, ...cardState }
    const params = {
      openid: _openId,
      cardsInfo: _cardsInfo
    }
    await callCloud('main-login', 'manageCards', params);
    return _cardsInfo;
  }
)

export const updateEmail = createAsyncThunk(
  'user/updateEmail',
  async (email) => {
    const _openId = await getLocalOpenId();
    await callCloud('main-login', 'updateEmail', {
      openid: _openId,
      email: email
    })
    return email;
  }
)

export const updateMobile = createAsyncThunk(
  'user/updateMobile',
  async (mobile) => {
    const _openId = await getLocalOpenId();
    await callCloud('main-login', 'updateMobile', {
      openid: _openId,
      mobile: mobile
    })
    return mobile;
  }
)