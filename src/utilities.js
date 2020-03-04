const bcrypt = require('bcryptjs');

bcrypt.hash('demo12345', 10)
    .then(hash => {
        concole.log({hash})
    })
    .catch(error)

