/* 发送邮件的云函数，调用时需要指明：
 * 1. 发送给谁
 * 2. 主题和内容
 */

const cloud = require('wx-server-sdk')
cloud.init()
var nodemailer = require('nodemailer')

var config = {
    host: 'smtp.163.com',
    port: 25,
    auth: {
        user: 'uqeasygo@163.com',
        pass: 'KPHYSPDXOUFWENEU'
    }
}

var transporter = nodemailer.createTransport(config)
// 云函数入口函数
exports.main = async (event, context) => {

    // return event.type
    var toAddr = event.toAddr
    var mail = {
        from: 'UQ校园通 <uqeasygo@163.com>',
        subject: event.subject,
        to: event.toAddr,
        text: event.content
    }
    transporter.sendMail(mail)
}