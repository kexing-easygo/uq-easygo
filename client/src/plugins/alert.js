import { callCloud } from '../utils/cloud'

/**
 * 告警函数，可以在某个特定事件被触发后，通知具备
 * admin属性的用户
 * @param {param} object 发送的邮件参数 
 */
export const notifyAdmin = async (param) => {
  const res = await callCloud('email', '', {...param})
  console.log(res)
}