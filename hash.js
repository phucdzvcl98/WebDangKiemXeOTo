const bcrypt = require('bcrypt');

bcrypt.hash('1', 10, function (err, hash) {
    console.log(hash);
});
//node hash.js

// INSERT INTO users(email, password, roleId)
// VALUES(
//     '1',
//     '$2b$10$nzF5RYtebkNul/Lz2X.4ge.rLBhD2WTKWLfh9tYqzsR8ojWQN/Sbu',
//     'R1'
// );