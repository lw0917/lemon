var express = require('express');
var router = express.Router();
var bill=require('./bill/index.js');

//添加账单
router.post('/api/addBill',bill.addBill);

//查询账单
router.get('/api/getBill',bill.getBill);

//删除账单
router.get('/api/delBill',bill.delBill);

module.exports=router;