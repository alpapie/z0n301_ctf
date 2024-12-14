const crypto = require('crypto');

// Function to create SHA-256 hash
function createSHA256Hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports=createSHA256Hash