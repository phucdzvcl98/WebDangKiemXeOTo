require('dotenv').config();
import { reject } from 'lodash';
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });


    let info = await transporter.sendMail({
        from: '"Đăng kiểm xe" <dangphuc09082003@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch đăng kiểm",
        html: getBodyHTMLEmail(dataSend),
    });

}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
    <h3>Xin chào ${dataSend.ownName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch đăng kiểm xe ô tô online trên Đăng kiểm xe</p>
    <p>Thông tin đăng kiểm xe:</p>
    <div><b>Thời gian:${dataSend.time}</b></div>
    <div><b>Trung tâm:${dataSend.centerName}</b></div> 

    <p>Nếu các thông tin trên đúng là sự thật, vui lòng click vào đường link bên dưới
    để xác nhận và hoàn tất thủ tục đặt lịch đăng kiểm.
    </p>
    <div>
    <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>

    <div>Xin chân thành cảm ơn</div>
    `
    }
    if (dataSend.language === 'en') {
        result =
            `
    <h3>Xin chào ${dataSend.ownName}!</h3>
    <p>You received this email because you scheduled your vehicle inspection online through Vehicle Inspection.</p>
    <p>Information to schedule an appointment:</p>
    <div><b>Time:${dataSend.time}</b></div>
    <div><b>Center:${dataSend.centerName}</b></div> 

    <p>If the above information is correct, please click the link below
    to confirm and complete the vehicle inspection appointment process.
    </p>
    <div>
    <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>

    <div> Sincerely thank!</div>
    `
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.ownName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch đăng kiểm online trên Web Đăng kiểm xe ô tô</p>
        <p>Thông tin hóa đơn được gửi trong file đính kèm</p>

        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Xin chào ${dataSend.ownName}!</h3>
        <p>You received this email because you scheduled your vehicle inspection online through the Vehicle Inspection Website.</p>
        <p>Invoice information is included in the attached file.</p>

        <div>Sincerely thank!</div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });
            let info = await transporter.sendMail({
                from: '"Web đăng kiểm xe ô tô"<dangphuc09082003@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả đặt lịch đăng kiểm",
                attachments: [
                    {
                        filename: `remedy-${dataSend.ownId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],
            });
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}