//src/config/awsConfig.ts
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.AWS_REGION, // örn: 'eu-central-1'
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // 🔥 Bunu ekle!
    forcePathStyle: false, // bu çoğu durumda true da olabilir ama genelde false kalabilir
});

export default s3;