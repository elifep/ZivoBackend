import { PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import s3 from '../config/awsConfig';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadToS3 = async (
    file: Express.Multer.File,
    keyPrefix: string = '',
    isPublic: boolean = true
): Promise<string> => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${keyPrefix}${uuidv4()}${fileExtension}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? ObjectCannedACL.public_read : undefined, // 🔧 fix burada
    };

    await s3.send(new PutObjectCommand(params));
    return fileName;
};