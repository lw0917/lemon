var express = require('express');
var router = express.Router();
var classify=require('./classify/index.js');
//添加图标
router.get('/api/iconlist',classify.addIcon);

//获取分类图标
router.get('/api/getIcon',classify.getIcon);

//获取公共和个人的分类图标
router.get('/api/classifylist',classify.getClassify);

//添加个人分类图标
router.post('/api/addClassify',classify.addClassify);

module.exports=router;