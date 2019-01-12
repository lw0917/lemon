var express = require('express');
var router = express.Router();

/* 添加用户 */

router.get('/api/addUser',require('./users/index.js'));

module.exports = router;
