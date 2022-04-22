// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const FILE_LIST_BY_BRANCH = {
  "UQ": [
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图1.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图2.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图3.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图4.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动1.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动2.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动3.png',
  ],
  "USYD": [
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图1.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图2.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图3.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图4.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/最新活动1.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/最新活动2.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/最新活动3.png',
  ],
  "UMEL": [
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图1.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图2.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图3.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图4.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/最新活动1.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/最新活动2.png',
    'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/最新活动3.png',
  ]
}

const fetchImages = async(branch) => {
  const files = FILE_LIST_BY_BRANCH[branch]
  const result = await cloud.getTempFileURL({
    fileList: files,
  })
  const filelist = result.fileList
  const res = filelist.map((val) => {
    return val.tempFileURL
  })
  return res
}

const fetchWebUrls = async(branch) => {

}

// 云函数入口函数
exports.main = async (event, context) => {
  const {branch} = event
  return await fetchImages(branch)
}