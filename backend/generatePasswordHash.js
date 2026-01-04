const bcrypt = require('bcryptjs');

// Get password from command line argument or use default
const password = process.argv[2] || 'password';

// Generate hash with salt rounds
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log(`\nPassword: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log('\nCopy the hash above and use it in your SQL INSERT statements.\n');
  
  process.exit(0);
});
