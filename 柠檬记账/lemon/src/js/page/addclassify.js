require(['../js/main.js'], function() {
	require(['mui','dom'], function(mui,dom) {
		var intro = null,
			icon = null,
			uid = JSON.parse(localStorage.getItem('data')).uid,
			type = JSON.parse(localStorage.getItem('data')).type;

		init();

		function init() {
			mui.init();

			//请求并渲染图标
			loadIcon();
			//添加点击事件
			addEvent();
		}

		function loadIcon() {
			var str = '';
			mui.ajax('/api/getIcon', {
				dataType: 'json',
				success: function(res) {
					if (res.code === 1) {
						renderIcon(res.msg)
					}
				}
			})
		}

		function renderIcon(data) {
			var size = Math.ceil(data.length / 8),
				str = '';
			for (var i = 0; i < size; i++) {
				str += `<div class="mui-slider-item">`;
				for (var j = i * 8; j < (i + 1) * 8; j++) {
					if (j >= data.length) {
						continue;
					} else {
						if (j === 0) {
							icon=data[j].icon;
							dom('.title').firstElementChild.className=data[j].icon;
						} 
						str +=
							`<dl data-icon="${data[j].icon}">
								<dt>
								    <span class="${data[j].icon}"></span>
								</dt>
							 </dl>`
					}
				}
				str += `</div>`;
			}
			dom('.mui-slider-group').innerHTML = str;
			//触发轮播
			mui('.mui-slider').slider();
		}
		
		function addEvent(){
			  //点击返回添加账单页面
			  dom('.back').addEventListener('tap',function(){
				    dom('input').value='';
				    location.href="../../page/addBill.html";
			  })
			  //点击选择图标
			  mui('.mui-slider-group').on('tap','dl',function(){
				      icon=this.getAttribute('data-icon')
                     dom('.title').firstElementChild.className=icon;
			  })
			 //点击保存
			 dom('footer').firstElementChild.addEventListener('tap',function(){
				   var ipt=dom('input').value.trim();
				   if(ipt&&uid&&type&&icon){
					   mui.ajax('/api/addClassify',{
						     type:'post',
							 data:{
								 type:type,
								 icon:icon,
								 intro:ipt,
								 uid:uid
							 },
							 success:function(res){
								 if(res.code===1){
									 dom('input').value='';
									 alert(res.msg);
									 location.href="../../page/addBill.html";
								 }else if(res.code===3){
									 alert(res.msg);
								 }
							 }
					   })
				   }
			 })
			  
			
		}
		
		
		
		
		
		
		
		
		
	})
})
