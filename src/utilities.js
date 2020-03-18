const bcrypt = require('bcryptjs');
bcrypt.hash('!@123Abcd', 1)
    .then(hash => {
        console.log({hash}, 'HASH')
    })
    

// bcrypt.hash('demo12345', 10)
//     .then(hash => {
//         concole.log({hash})
//     })
//     .catch(error)

