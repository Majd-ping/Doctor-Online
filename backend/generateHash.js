const bcrypt = require('bcryptjs');

bcrypt.hash('password', 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Correct hash for password "password":');
    console.log(hash);
  }
  process.exit(0);
});
