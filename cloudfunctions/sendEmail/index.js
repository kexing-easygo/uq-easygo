// 云函数入口文件
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
    console.log(event)
    var mail = {
        from: '来自你爹 <uqeasygo@163.com>',
        subject: '来自你爹的问候',
        to: '913248383@qq.com',
        text: 'wtf'
    }
    transporter.sendMail(mail)
}