var mongo=require('mymongo1610');

function addIcon(req,res,next){
          var icon=req.query.icon;
          mongo.insert('iconlist',{icon:icon},function(error,result){
               if(error){
                  res.json({code:0,msg:error})
               }else{
                 res.json({code:1,msg:'添加成功'})
               }
        })
}

function getIcon(req,res,next){
        mongo.find('iconlist',function(error,result){
            if(error){
                res.json({code:0,msg:error})
             }else{
               res.json({code:1,msg:result})
             }
        })
}

function getClassify(req,res,next){
    var uid=req.query.uid||'*',
        type=req.query.type||null;
        console.log(type,uid)
          //{$or:[{uid:"*"},{uid:uid}]}
           var findNum=null;
           if(type){
             findNum={$and:[{uid:{$in:['*',uid]}},{type:type}]};
           }else{
             findNum={uid:{$in:['*',uid]}};
           } 
          mongo.find('classifylist',findNum,function(error,result){
               if(error){
                  res.json({code:0,msg:error})
               }else{
                 res.json({code:1,msg:result})
               }
          })
}

function addClassify(req,res,next){
    var uid=req.body.uid,
        intro=req.body.intro,
        icon=req.body.icon,
        type=req.body.type;
       mongo.find('classifylist',{uid:uid,intro:intro,type:type,icon:icon},function(error,results){
              if(error){
                   res.json({code:0,msg:error})
              }else{
               
                if(results.length>0){
                    res.json({code:3,msg:'已有该分类'})
                }else{
                  mongo.insert('classifylist',{uid:uid,intro:intro,icon:icon,type:type},function(error,result){
                    if(error){
                       res.json({code:0,msg:error})
                    }else{
                      res.json({code:1,msg:'添加成功'})
                    }
               })
                }
              }
       }) 
 }


module.exports={
      addIcon:addIcon,
      getClassify:getClassify,
      addClassify:addClassify,
      getIcon:getIcon
}






