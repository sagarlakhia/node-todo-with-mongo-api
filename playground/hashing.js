const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$db3uGTGHzNF1GP/25xifbuAkjf4./RRoTvC68PcHUY21sfxpAddzq';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});
// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var msg = 'I am user no 2';
// var hash = SHA256(msg).toString();
// console.log(`msg: ${msg} , hashed: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString();

// if (resultHash === token.hash) {
//     console.log('data was not changed');
// } else {
//     console.log('data was changed. Do not trust:');
// }