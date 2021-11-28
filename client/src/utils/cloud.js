import Taro from '@tarojs/taro'
import { RESOURCE_ENV } from './constant'

export const initCloud = () => {
  Taro.cloud.init({
    env: RESOURCE_ENV
  })
}

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