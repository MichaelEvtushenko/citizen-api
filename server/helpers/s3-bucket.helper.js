const AWS = require('aws-sdk');
const {v4: uuid} = require('uuid');

const s3 = new AWS.S3();

const globalParams = {
    Bucket: 'citizen-app-bucket/photos/alerts',
    ACL: 'public-read'
};

const upload = (files = []) => {
    return files.map(file => {
        const {Key = uuid(), buffer: Body, mimetype: ContentType} = file;
        const uploadParams = {Key, Body, ContentType, ...globalParams};
        return s3.upload(uploadParams).promise();
    });
};

module.exports = {
    upload,
};
