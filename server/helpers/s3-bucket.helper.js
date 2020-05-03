const AWS = require('aws-sdk');
const {v4: uuid} = require('uuid');

const Path = Object.freeze({
    ALERTS_PHOTOS: 'alerts/photos',
    USERS_PHOTOS: 'users/photos',
});

const s3 = new AWS.S3();

const uploadFiles = ({files = [], path = ''}) => {
    return files.map(file => {
        const {buffer: Body, mimetype: ContentType} = file;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${path}/${uuid()}`,
            Body,
            ContentType,
            ACL: 'public-read'
        };

        return s3.upload(params).promise();
    });
};

const deleteFiles = ({urls = [], path = ''}) => {
    const keys = extractKeys(urls);
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: {
            Objects: keys.map(key => ({Key: `${path}/${key}`})),
            Quiet: false
        }
    };

    return s3.deleteObjects(params).promise();
};

// Extract UUIDs from URLs
const extractKeys = (urls = []) => {
    return urls.map(url => url.split('/').slice(-1).join());
};

module.exports = {
    uploadFiles,
    deleteFiles,
    extractKeys,
    Path,
};
