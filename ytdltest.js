var bcrypt   = require('bcrypt-nodejs');
console.log(bcrypt.hashSync("nguyennhutduy", bcrypt.genSaltSync(8), null))

