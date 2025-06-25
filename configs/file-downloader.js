const multer = require('multer');
const { v4: uuid } = require('uuid');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const ApiError = require('../exceptions/ApiError');
dotenv.config();
// const {Files} = require('../models')

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const bucketAccessKey = process.env.AWS_ACCESS_KEY;
const bucketSecretKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
    },
});

const upload = multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        const extension = /\.([a-z0-9]+)$/i.exec(file.originalname)[1];
        const fileName = `${uuid()}.${extension}`;
        cb(null, fileName);
    },
});

const fileDocFilter = async (req, file, cb) => {
    // const videoWithProvidedName = await Files.findOne({
    //     where: { name: file.originalname },
    // });
    // if (videoWithProvidedName) {
    //     cb(
    //         new Error(
    //             JSON.stringify({
    //                 message: 'A file with the same name was already uploaded',
    //                 name: file.originalname,
    //             })
    //         )
    //     );
    //     return;
    // }
    console.log(file.mimetype);
    if (file.mimetype !== 'application/pdf') {
        cb(ApiError.BadRequest('Wrong file type'));
        return;
    }

    cb(null, true);
};

async function deleteFile(params) {
    return await s3.send(new DeleteObjectCommand(params));
}

module.exports = {
    fileDocUploader: multer({
        storage: upload,
        limits: { fileSize: 60 * 1024 * 1024 },
        fileFilter: fileDocFilter,
    }),
    deleteFile,
};
