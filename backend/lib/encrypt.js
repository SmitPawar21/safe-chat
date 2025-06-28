import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const KEY = Buffer.from(process.env.AES_SECRET_KEY, 'utf-8');
const IV = Buffer.from(process.env.AES_IV, 'utf-8');

export const encryptText = (text) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

export const decryptText = (encryptedText) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
