// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')
cloud.init({
  env: "cloudbase-prepaid-8eqh90441a925f"
})

const sendEmail = (param) => {
  const {
    subject,
    toAddr,
    content
  } = param
  const config = {
    host: 'smtp.163.com',
    port: 25,
    auth: {
      user: 'uqeasygo@163.com',
      pass: 'KPHYSPDXOUFWENEU'
    }
  }
  const transporter = nodemailer.createTransport(config)
  const mail = {
    from: '课行校园通 <uqeasygo@163.com>',
    subject: subject,
    to: toAddr,
    text: content
  }
  console.log("Sending email to:", toAddr)
  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return sendEmail(event)
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

}