// Utilities for hashing passwords

const crypto = require("crypto");

const HASH_SIZE = 64;

function hash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, HASH_SIZE, `sha512`).toString(`hex`);
}

function generateSalt() {
    return crypto.randomBytes(HASH_SIZE).toString('hex');
}

module.exports = { hash, generateSalt }