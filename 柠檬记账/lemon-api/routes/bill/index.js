var mongo=require('mymongo1610');
var mongodb=require('mymongo1610/utils/getCollection.js');
var ObjectId=require('mongodb');


//添加账单
function addBill(req,res,next){
    var type=req.body.type,
        money=req.body.money,
        uid=req.body.uid,
        time=req.body.time,
        icon=req.body.icon,
        intro=req.body.intro;
     mongo.insert('bill',{type:type,money:money,uid:uid,time:new Date(time),icon:icon,intro:intro},function(err,result){
         if(err){
             res.json({code:0,msg:err})
         }else{
             res.json({code:1,msg:'添加成功'})
         }
     })
}

///查询账单
function getBill(req,res,next){
     var time=req.query.time,
         uid=req.query.uid,
         intro=req.query.intro||[],
         type=req.query.type||null;
     var maxtime=null;
     if(time.indexOf('-')!=-1){
         var timeArr=time.split('-');
         if(timeArr[1]==12){
            maxtime=(timeArr[0]*1+1)+'-01'; 
         }else{
             maxtime=timeArr[0]+'-'+(timeArr[1]*1+1);
         }   
     }else{
              maxtime=time*1+1+'';
     }
     mongodb('bill',function(err,con,col){
              if(err){
                  res.json({code:0,msg:err})
              }else{
                  var mongoFind=null;
                   if(intro.length>0||type){
                         mongoFind={$and:[{time:{$lt:new Date(maxtime),$gte:new Date(time)}},
                            {uid:uid},{$or:[{type:type},{intro:{$in:intro}}]}]};
                   }else{
                     mongoFind={$and:[{time:{$lt:new Date(maxtime),$gte:new Date(time)}},
                       {uid:uid}]};
                   }
                  col.find(mongoFind).sort({time:-1}).toArray(function(error,result){
                        if(error){
                            res.json({code:0,msg:error})
                        }else{
                            if(result.length>0){
                                res.json({code:1,msg:result});   
                            }else{
                                res.json({code:3,msg:'暂时还没账单哟！'});
                            }  
                        }
                  })
              }
          })
}

function delBill(req,res,next){
        var id=req.query.id;
        if(id){
              id=ObjectId.ObjectID(id);
             mongo.delete('bill',{_id:id},function(err,result){
                 if(err){
                    res.json({code:0,msg:err})
                 }else{
                    res.json({code:1,msg:'删除成功'})
                 }
             })
        }else{
            res.json({code:3,msg:'缺少参数'})
        }
}




module.exports={
     addBill:addBill,
     getBill:getBill,
     delBill:delBill
}
