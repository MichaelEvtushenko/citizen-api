const nodeMailer = require('nodemailer');


const createTransporter = async () => {
    const {user, pass} = await nodeMailer.createTestAccount();

    return nodeMailer.createTransport({ // copy-paste template
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};



const sendEmail = async (to, subject, text) => {
    const emailOptions = {};
    const transporter = await createTransporter();
    // TODO: refactor
    // emailOptions.from =`'awawd wa' <>`;
    emailOptions.to = to;
    emailOptions.subject = subject;
    emailOptions.text = text;

    transporter.sendMail(emailOptions, (err, info) => {
        if (err) {
            throw err;
        }
        console.log(info);
        // log...
        // console.log('message is sen')
    });
};

module.exports = {
    sendEmail,
};


