const nodemailer = require('nodemailer');

const {API_ACTIVATE_URL} = require('../config/url.config');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
};

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({from: process.env.EMAIL_USER, to, subject, text});
        console.log(`Activation message was sent to: <${info.accepted}>. Response: ${info.response.split(' ')[2]}.`);
    } catch (e) {
        console.error('Error occurred while sending email:', e);
    }
};

const sendActivationCode = async ({email, linkId, fullName}) => {
    const emailBody = `Hi, ${fullName}!
    \rPlease activate your account: ${API_ACTIVATE_URL}/${linkId}`;
    await sendEmail(email, 'Activation code', emailBody);
};

module.exports = {
    sendActivationCode,
};
