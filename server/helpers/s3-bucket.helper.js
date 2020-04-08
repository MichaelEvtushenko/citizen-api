const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const globalParams = {
    Bucket: 'citizen-app-bucket',
    ACL: 'public-read'
};

const upload = (files = []) => {
    files.forEach(async f => {
        const {mimetype: ContentType, buffer: Body, originalname: Key} = f;
        const uploadParams = {Key, Body, ContentType, ...globalParams};
        console.log('res:', await s3.upload(uploadParams).promise());
    });
};

module.exports = {
    upload,
};
