const nodeMailer = require('nodemailer');

const createTransporter = async () => {
    return nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendEmail = async (to, subject, text) => {
    const transporter = await createTransporter();
    transporter.sendMail({to, subject, text}, (err, info) => {
        if (err) {
            throw err;
        }
        console.log(`Activation message was sent to: <${info.accepted}>. Response: ${info.response.split(' ')[2]}.`);
    });
};

module.exports = {
    sendEmail,
};


