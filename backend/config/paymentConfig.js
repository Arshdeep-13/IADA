const crypto = require("crypto");

/**
 * AES Encryption Function
 * @param {string} key - 16-character AES key
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted base64 string
 */
function encryptAES(key, text) {
  try {
    const cipher = crypto.createCipheriv(
      process.env.cryptoSecret,
      Buffer.from(key, "utf8"),
      null // No IV for ECB mode
    );
    cipher.setAutoPadding(true); // PKCS#5 padding (same as PKCS#7 in Node.js)
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { encryptAES };
