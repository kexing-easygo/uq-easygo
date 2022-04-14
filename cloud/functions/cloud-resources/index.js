// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const FILE_LIST = [
  'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图1.png',
  'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图2.png',
  'cloud://uqeasygo1.7571-uqeasygo1-1302668990/UQ/轮播图3.png',
]

const fetchImages = async() => {
  const result = await cloud.getTempFileURL({
    fileList: FILE_LIST,
  })
  return result.fileList
}

const downloadImages = async() => {
  // const fileID = 'cloud://xly-xrlur.786c-xly-xrlur-1300446086/cloudbase/1576500614167-520.png'
  // const res = await cloud.downloadFile({
  //   fileID: fileID,
  // })
  // const buffer = res.fileContent
  // return buffer.toString('base64')
  const res = await Promise.all(FILE_LIST.map(async(file) => {
    const f = await cloud.downloadFile({
      fileID: file
    })
    const buffer = f.fileContent
    return buffer.toString('base64')
  }))
  return res
}

// 云函数入口函数
exports.main = async (event, context) => {
  // switch (event.method) {
  //   case "downloadImages":
  //     return await downloadImages()
  //   case "fetchImages":
  //     return await fetchImages()
  //   default:
  //     break;
  // }
  return await fetchImages()
}