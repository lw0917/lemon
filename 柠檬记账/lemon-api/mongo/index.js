var mongodb=require('mongodb').MongoClient;
var url='mongodb://127.0.0.1:27017';

module.exports=function(collection,ck){
     mongodb.connect(url,{ useNewUrlParser: true },function(err,con){
         if(err){
             return ck&&ck(err)
         }
        var cols=con.db('lemon').collection(collection);
         ck&&ck(null,con,cols)
     })
}