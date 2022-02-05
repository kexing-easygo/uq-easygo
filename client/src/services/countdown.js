import Taro from '@tarojs/taro'
import { callCloud } from '../utils/cloud'
import { getLocalOpenId } from './login'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { SUBSCRIBE_TEMPLATE_ID }  from "../config.json";

/**
 * 从数据库中获取用户的全部countdown assignments
 */
export const fetchAllCountDown = createAsyncThunk(
  'countdown/fetchUserCountDown',
  async () => {
    const _openId = await getLocalOpenId();
    const userCountDown = await callCloud('countdown', 'fetchUserAssignments', {openid: _openId});
    return userCountDown.result;
  }
)

/**
 * 向数据库中添加新的countdown
 */
export const appendNewCountDown = createAsyncThunk(
  'countdown/appendNewCountDown',
  async (param) => {
    const _openId = await getLocalOpenId();
    const {name, date, time, color, type} = param
    const newCountDown = {
      "name": name,
      "date": date,
      "time": time,
      "color": color,
      "type": type
    }
    const res = await callCloud('countdown', 'appendAssignments', {
      openid: _openId,
      assignment: newCountDown
    });
    return res.result;
  }
)

/**
 * 根据传入的aid删除对应countdown
 */
export const deleteCountDown = createAsyncThunk(
  'countdown/deleteCountDown',
  async (aid) => {
    const args = {
      openid: await getLocalOpenId(),
      deletedId: aid
    }
    const res = await callCloud('countdown', 'deleteUserAssignments', args);
    return res.result;
  }
)

/**
 * 更新用户countdown中单独条目的信息
 */
export const updateCountDown = createAsyncThunk(
  'countdown/updateCountDown',
  async (param) => {
    const _openId = await getLocalOpenId();
    const update = await callCloud('countdown', 'updateAssignments', {
      openid: _openId,
      ...param
    });
    return update.result
  }
)

export const getNotifications = createAsyncThunk(
  "countdown/getNotifications",
  async () => {
    const res = await callCloud("countdown", "getNotification", {
      openid: await getLocalOpenId()
    })
    return res.result
  }
)

/**
 * 
 */
export const setNotifications = createAsyncThunk(
  'countdown/setNotifications',
  async (param) => {
    const {wechat, email} = param
    if (wechat.enabled) {
      try {
        const res = await Taro.requestSubscribeMessage({
          tmplIds: [SUBSCRIBE_TEMPLATE_ID],
        })
        console.log("用户授权结果 ::: ", res[SUBSCRIBE_TEMPLATE_ID])
        if (res[SUBSCRIBE_TEMPLATE_ID] == "reject") {
          await Taro.showToast({ title: "点击允许才能接到通知哦", icon: "none" })
          param.wechat.enabled = false
        } else if (res[SUBSCRIBE_TEMPLATE_ID] == "ban") {
          await Taro.showToast({ title: "模版已过期", icon: "none" })
          param.wechat.enabled = false
        }
      } catch (err) {
        console.error(err)
        return;
      }
    }
    const setRes = await callCloud('countdown', 'setNotification', {
      openid: await getLocalOpenId(),
      notification: param
    })
    return setRes.result
  }
)

export const fetchAssessments = async(param) => {
  const res = await callCloud('calculator', 'fetchAssessments', {
    ...param
  })
  const currentAssessments =  res.result
  if (currentAssessments.length == 0) {
    Taro.showToast({ title: "没有找到这门课", icon: "none"})
  }
  return currentAssessments
}


export const autoAppendAssignments = createAsyncThunk(
  "countdown/autoAppendAssignments",
  async (param) => {
    const _openid = await getLocalOpenId()
    const res = await callCloud('countdown', 'autoAppendAssignments', {
      openid: _openid,
      ...param
    })
    console.log(res)
    return param?.assignments
  }
)