import CryptoJS from 'crypto-js';

const IV_KEY = '7E892870A52C54A3B58J306B53C3D5BD';
const BCRYPT_HASH_SALT = 'G63UC60208F04876';

export const encryptMessage = (msg = '') => {
  try {
    const iv = CryptoJS.enc.Utf8.parse(IV_KEY);
    const key = CryptoJS.enc.Utf8.parse(BCRYPT_HASH_SALT);
    const ciphertext = CryptoJS.AES.encrypt(msg, key, { iv: iv });
    return ciphertext?.toString();
  } catch (err) {
    return '';
  }
};

export const deCryptMessage = (msg = '') => {
  try {
    const iv = CryptoJS.enc.Utf8.parse(IV_KEY);
    const key = CryptoJS.enc.Utf8.parse(BCRYPT_HASH_SALT);
    const bytes = CryptoJS.AES.decrypt(msg.toString(), key, { iv: iv });
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return '';
  }
};
