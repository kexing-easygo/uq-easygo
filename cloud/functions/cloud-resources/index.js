// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const fileList = [
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图1.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图2.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图3.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图4.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动1.JPG',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动2.JPG'
  ]
  const result = await cloud.getTempFileURL({
    fileList: fileList,
  })
  return result.fileList
}