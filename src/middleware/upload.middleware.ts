import multer from 'multer';

const storage = multer.memoryStorage(); // AWS'ye göndereceksen bellekte tutmak yeterli

export const upload = multer({ storage });