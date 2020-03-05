const exress = require('express');
const authRouter = express.Router();


authRouter
.route('/', (req, res) => {
    console.log('iam here')
})
