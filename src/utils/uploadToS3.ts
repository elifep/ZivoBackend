import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../config/awsConfig';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};