const express = require('express')
const router = express.Router()


router.get('/errs', async (req, res, next) => {
    return res.sendFile('src/views/error.html', {root: process.cwd()})
});

module.exports = router;