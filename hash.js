const bcrypt = require('bcrypt');

bcrypt.hash('1', 10, function (err, hash) {
    console.log(hash);
});
//node hash.js

// INSERT INTO users(email, password, roleId)
// VALUES(
//     '1',
//     '$2b$10$R9JiORAhHqCSDaDRFl7Aoenpwj1VrkfgbeNsTx90b85EBi90I8zmW',
//     'R1'
// );