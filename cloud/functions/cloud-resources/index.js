// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const FILE_LIST_BY_BRANCH = {
  "UQ": {
    "images": [
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图1.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图2.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图3.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图4.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动1.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动2.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/最新活动3.png',
    ],
    "articles": [
      "",
      "",
      "https://mp.weixin.qq.com/s/d-yn7FEY2lLfyeA9CpdcSQ",
      "https://mp.weixin.qq.com/s/CvSMP4LEP-7v2s0tsyDSWQ",
      "https://mp.weixin.qq.com/s/d-yn7FEY2lLfyeA9CpdcSQ",
      "",
      "https://mp.weixin.qq.com/s/CvSMP4LEP-7v2s0tsyDSWQ",
    ]
  },
  "USYD": {
    "images": [
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图1.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图2.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图3.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/轮播图4.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/最新活动1.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/最新活动2.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/USYD/最新活动3.png',
    ],
    "articles": [
      "",
      "",
      "https://mp.weixin.qq.com/s/gWhnWg42eHs7PX-zxiKYEg",
      "https://mp.weixin.qq.com/s/WSZx8E1KfwV2DW5SVVixPA",
      "",
      "https://mp.weixin.qq.com/s/gWhnWg42eHs7PX-zxiKYEg",
      "",
    ]
  },
  "UMEL": {
    "images": [
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图1.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图2.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图3.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/轮播图4.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/最新活动1.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/最新活动2.png',
      'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UMEL/最新活动3.png',
    ],
    "articles": [
      "",
      "",
      "https://mp.weixin.qq.com/s/zhn9aWAkVuvOnPB3v_HrKA",
      "https://mp.weixin.qq.com/s/ic6wXlIIpt-cRTiVEdHfnw",
      "https://mp.weixin.qq.com/s/H6-CzRMTegCOZuiCkfvfwA",
      "https://mp.weixin.qq.com/s/zhn9aWAkVuvOnPB3v_HrKA",
      "https://mp.weixin.qq.com/s/ic6wXlIIpt-cRTiVEdHfnw",
    ]
  }
}

/**
 * 从云端拉取主页海报和海报对应的跳转链接。这样做的目的是：
 * 减少微信审核次数，修改海报和推文可以在云端完成
 * @param {branch} branch 院校名称
 * @returns
 */
const fetchCloudResources = async (branch) => {
  const files = FILE_LIST_BY_BRANCH[branch]
  const {images, articles} = files
  const result = await cloud.getTempFileURL({
    fileList: images,
  })
  const filelist = result.fileList
  const res = filelist.map((val) => {
    return val.tempFileURL
  })
  return {files: res, articles: articles}
}


// 云函数入口函数
exports.main = async (event, context) => {
  const {
    branch
  } = event
  return await fetchCloudResources(branch)
}