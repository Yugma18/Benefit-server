const { S3 } = require('aws-sdk');
const { v4: uuid } = require('uuid');

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const bucketAccessKey = process.env.AWS_ACCESS_KEY;
const bucketSecretKey = process.env.AWS_SECRET_ACCESS_KEY;

exports.s3Uploadv2 = async (file, type) => {
    const s3 = new S3();
    const fileKey =
        type === 'video'
            ? `files/video/${uuid}-${file.originalname}`
            : `files/picture/${uuid}-${file.originalname}`;

    const param = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
    };
    return await s3.upload(param).promise();
};
