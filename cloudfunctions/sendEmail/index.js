/* 发送邮件的云函数，调用时需要指明：
 * 1. 发送给谁
 * 2. 主题和内容
 */

const cloud = require('wx-server-sdk')
var nodemailer = require('nodemailer')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

async function sendEmail(toAddr, subject, content) {
    var config = {
        host: 'smtp.163.com',
        port: 25,
        auth: {
            user: 'uqeasygo@163.com',
            pass: 'KPHYSPDXOUFWENEU'
        }
    }
    var transporter = nodemailer.createTransport(config)
    var mail = {
        from: 'UQ校园通 <uqeasygo@163.com>',
        subject: subject,
        to: toAddr,
        text: content
    }
    transporter.sendMail(mail)
}
// 云函数入口函数
exports.main = async (event, context) => {
    sendEmail(event.toAddr, event.subject, event.content)
}