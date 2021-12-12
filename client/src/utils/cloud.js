import Taro from '@tarojs/taro'
import { APPID, RESOURCE_APP_ID, RESOURCE_ENV } from './constant'

export const initCloud = async () => {
  Taro.cloud.init();
  var c1 = new Taro.cloud.Cloud({
    appid: APPID,
    // 资源方 AppID
    resourceAppid: RESOURCE_APP_ID,
    // 资源方环境 ID
    resourceEnv: RESOURCE_ENV,
  })
  await c1.init()
  Taro.$masterCloud = c1;
}

/**
 * 调用云函数
 * @param {string} name 
 * @param {string} method 
 * @param {object} args 
 * @param {string} branch 
 */
export const callCloud = async (name, method, args = {}, branch = 'UQ') => {
  const _data = {
    method: method,
    branch: branch
  }
  return await Taro.cloud.callFunction({
    name: name,
    data: {
      ..._data,
      ...args
    }
  })
}