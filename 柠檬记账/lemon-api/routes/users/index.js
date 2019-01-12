var mongo=require('mymongo1610');
module.exports= function(req, res, next) {
      var name=req.query.user||'qq';
         mongo.insert('userlist',{nick_name:name},function(err,result){
          if(err){
           res.json({code:0,msg:err})
          }else{
           res.json({code:1,msg:result.insertedId})
          }
        })      
     }
