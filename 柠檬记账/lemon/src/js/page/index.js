require(['./js/main.js'], function() {
	require(['mui', 'echarts', 'dom', 'dtpicker', 'poppicker', 'picker'], function(mui, echarts, dom) {
		var picker = null,
			dtPicker = null,
			loadYear = new Date().getFullYear(),
			loadMonth = new Date().getMonth() + 1,
			status = 'month',
			headTime = dom('.headTime'),
			yBill = dom('.yBill'),
			mBill = dom('.mBill'),
			uid = '5c34160593723eee3471e5e3',
			intro = [],
			type='';



		init();

		function init() {
			mui.init();
			//mui滚动区域触发
			mui(".mui-scroll-wrapper").scroll({
				//bounce: false,//滚动条是否有弹力默认是true
				indicators: false, //是否显示滚动条,默认是true
			});


			//禁止侧边栏右滑打开
			dom('.mui-inner-wrap').addEventListener('drag', function(event) {
				event.stopPropagation();
			});
			//初始化日期
			loadDate();
			//点击事件
			addEvent();
			//获取账单，并渲染；
			getData();
			//获取分类
			getClassify();

		}

		function loadDate() {
			picker = new mui.PopPicker();
			picker.setData([{
				value: 'month',
				text: '月'
			}, {
				value: 'year',
				text: '年'
			}]);

			dtPicker = new mui.DtPicker({
				type: 'month'
			});
			loadMonth = loadMonth < 10 ? '0' + loadMonth : loadMonth;
			headTime.innerHTML = loadYear + '-' + loadMonth;
		}

		//获取分类
		function getClassify() {
			mui.ajax('/api/classifylist', {
				data: {
					uid: uid
				},
				dataType: 'json',
				success: function(res) {
					if (res.code === 1) {
						renderClassify(res.msg)
					}
				}
			})
		}
		//渲染分类
		function renderClassify(data) {
			var str = '';
			data.forEach(function(file) {
				str += `<span>${file.intro}</span>`
			})
			dom('.typeClassify').innerHTML = str;
		}

		function addEvent() {
			//点击选择年或月
			dom('.headDate').addEventListener('tap', function() {
				picker.show(function(selectItems) {
					var showAll = document.querySelectorAll('.showY');
					for (var i = 0; i < showAll.length; i++) {
						showAll[i].innerHTML = selectItems[0].text;
					}
					// console.log(selectItems[0].text); //年/月
					//console.log(selectItems[0].value); //year/month
					status = selectItems[0].value;
					if (status === 'month') {
						headTime.innerHTML = loadYear + '-' + loadMonth;
						dom('h5[data-id="title-m"]').style.display = "inline-block";
						dom('h5[data-id="title-y"]').style.width = "50%";

						dom('.mui-picker[data-id="picker-m"]').style.display = "block";
						dom('.mui-picker[data-id="picker-y"]').style.width = "50%";
						mBill.style.display = "block";
						yBill.style.display = "none";
					} else {
						headTime.innerHTML = loadYear;
						dom('h5[data-id="title-m"]').style.display = "none";
						dom('h5[data-id="title-y"]').style.width = "100%";

						dom('.mui-picker[data-id="picker-m"]').style.display = "none";
						dom('.mui-picker[data-id="picker-y"]').style.width = "100%";
						mBill.style.display = "none";
						yBill.style.display = "block";
					}
					getData();
				})
			})
			//点击选择日期时间
			headTime.addEventListener('tap', function() {
				dtPicker.show(function(selectItems) {
					//console.log(selectItems.y); //{text: "2016",value: 2016} 
					//console.log(selectItems.m); //{text: "05",value: "05"} 

					loadYear = selectItems.y.text;
					loadMonth = selectItems.m.text;
					if (status === 'month') {
						headTime.innerHTML = loadYear + '-' + loadMonth;
					} else {
						headTime.innerHTML = loadYear;
					}
					getData();
				})

			})
			//点击打开侧边栏
			// 			dom('.showAside').addEventListener('tap', function() {
			// 				console.log(1)
			// 				mui('.mui-off-canvas-wrap').offCanvas().show();
			// 			})	
			//点击关闭侧边栏
			dom('.closeAside').addEventListener('tap', function() {
				var all = dom('.classifyList').firstElementChild.querySelectorAll('span');
				var spans = dom('.classifyList').lastElementChild.querySelectorAll('span');
				var len=0;
				intro=[];
				for(var i=0;i<all.length;i++){
					if(all[i].className==='spanActive'){
						len++;
						 if(all[i].innerHTML==='全部收入'){
							  type='1';
						 }else{
							 type='0';
						 }
					}
						if(len===2){
							  type='';
						}
				}
				for(var i=0;i<spans.length;i++){
			      if(spans[i].className==='spanActive'){
							intro.push(spans[i].innerHTML)
						}
				}
				  getData();
				mui('.mui-off-canvas-wrap').offCanvas().close();
			})
			mui('.classifyList').on('tap', 'span', function() {
				var all = dom('.classifyList').firstElementChild.querySelectorAll('span');
			  var spans = dom('.classifyList').lastElementChild.querySelectorAll('span');
				var flag = false,
					  flip = false;
				for(var i = 0; i < all.length; i++) {
					if (all[i].innerHTML === this.innerHTML) {
						if (all[i].className==='spanActive') {
							this.className='';
							flag=false;
						} else {
							this.className='spanActive';
							flag=true;
						}
					} 	
				}
				for (var i = 0; i < spans.length; i++) {
					if (spans[i].innerHTML === this.innerHTML) { 
						if (spans[i].className==='spanActive') {
							  this.className='';
								flip=false;
						} else {
							 spans[i].className='spanActive';
								flip=true;
						}
					} 
				}
				if (flag) {
					for (var i = 0; i < spans.length; i++) {
						spans[i].className='';
					}
					flag=false;
				}
				if (flip) {
					for (var i = 0; i < all.length; i++) {
						all[i].className='';
					}
					flip = false;
				}
			})
			//点击tab切换
			var spans = dom('.tab').querySelectorAll('span');
			mui('.tab').on('tap', 'span', function() {
				for (var i = 0; i < spans.length; i++) {
					spans[i].classList.remove('active');
				}
				this.classList.add('active');
				if (this.innerHTML === '账单') {
					dom('.conBill').style.display = 'block';
					dom('.conTable').style.display = 'none';
				} else {
					dom('.conBill').style.display = 'none';
					dom('.conTable').style.display = 'block';
				}
			})
		}

		//获取数据并渲染
		function getData() {
			var titTime = headTime.innerHTML;
			//intro=['交通','医疗'];
			if (uid && titTime) {
				mui.ajax('/api/getBill', {
					dataType: 'json',
					data: {
						time: titTime,
						uid: uid,
						intro: intro,
						type:type
					},
					success: function(res) {
						//console.log(res)
						if (res.code === 1) {
							renderList(res.msg)
						} else if (res.code === 3) {
							dom('.yBill').innerHTML = res.msg;
							dom('.mBill').innerHTML = res.msg;
							dom('.conTable').innerHTML = res.msg;
						}
					}
				})

			}
		}

		function renderList(data) {
			var str = '',
				numAll = 0,
				addAll = 0;

	   //一维数组转二维数组,此方法不需要提前对数组进行任何处理
	//    var map = new Map();
	//    var newArr = [];
	//    arr.forEach(function(item,i){
	// 	   map.has(item.id) ? map.get(item.id).push(item) : map.set(item.id,[item])
	//    })
	//    newArr = [...map.values()];
	   
	//    console.log(newArr)
			if (status === 'month') {        
          //此方法需要对数组先按分组条件进行排序，否则分组将会不正确
				let newArr = [],
					tempArr = [];
				data.push([]);
				for (let i = 0; i < data.length - 1; i++) {
					if (data[i].time === data[i + 1].time) {
						tempArr.push(data[i]);
					} else {
						tempArr.push(data[i]);
						newArr.push(tempArr.slice(0));
						tempArr.length = 0;
					}
				}
				for (var i = 0; i < newArr.length; i++) {
					var dayNum = 0,
						dayDate = null;
					var strDay = '';
					for (var j = 0; j < newArr[i].length; j++) {

						dayDate = addZero(new Date(newArr[i][j].time).getMonth() + 1) + '-' + addZero(new Date(newArr[i][j].time).getDate());
						strDay +=
							`<li class="mui-table-view-cell">
									<div class="mui-slider-right mui-disabled">
										<a class="mui-btn mui-btn-red del" data-id="${newArr[i][j]._id}">删除</a>
									</div>
									<div class="mui-slider-handle">
										<h2> <span class="${newArr[i][j].icon}"></span>
											<span>${newArr[i][j].intro}</span></h2>`
						if (newArr[i][j].type == '0') {
							numAll += newArr[i][j].money * 1;
							dayNum -= newArr[i][j].money * 1;
							strDay += `<span class="liMoney red">${newArr[i][j].money}</span>`;
						} else {
							addAll += newArr[i][j].money * 1;
							dayNum += newArr[i][j].money * 1;
							strDay += `<span class="liMoney green">${newArr[i][j].money}</span>`;
						}
						strDay += `</div></li>`
					}
					str +=
						`	<div class="dayItem">
											<div class="dayTitle">
												<div>
													<span class="mui-icon mui-icon-chat"></span>
													<span>${dayDate}</span>
												</div>
												<div>
													结余<span>${dayNum}</span>
												</div>
											</div>
											<ul class="mui-table-view">${strDay}</ul></div>`
				}
				dom('.mBill').innerHTML = str;
			} else {
				let newArr = [],
					tempArr = [];
				data.push([]);
				for (let i = 0; i < data.length - 1; i++) {
					if (new Date(data[i].time).getMonth() - 1 === new Date(data[i + 1].time).getMonth() - 1) {
						tempArr.push(data[i]);
					} else {
						tempArr.push(data[i]);
						newArr.push(tempArr.slice(0));
						tempArr.length = 0;
					}
				}
				for (var i = 0; i < newArr.length; i++) {
					var addNum = 0,
						billNum = 0,
						strAll = '';
					for (var j = 0; j < newArr[i].length; j++) {
						strAll +=
							`<li class="mui-table-view-cell">
																<div class="mui-slider-right mui-disabled">
																	<a class="mui-btn mui-btn-red del" data-id="${newArr[i][j]._id}">删除</a>
																</div>
																<div class="mui-slider-handle">
																	<dl>
																		<dt>
																			<span class="${newArr[i][j].icon}"></span>
																		</dt>
																		<dd>${newArr[i][j].intro}</dd>
																	</dl>`
						if (newArr[i][j].type === '0') {
							billNum += newArr[i][j].money * 1;
							numAll += newArr[i][j].money * 1;
							strAll += `<span class="red">${newArr[i][j].money}</span>`
						} else {
							addNum += newArr[i][j].money * 1;
							addAll += newArr[i][j].money * 1;
							strAll += `<span class="green">${newArr[i][j].money}</span>`
						}
						strAll += `</div></li>`
					}
					str +=
						`<div class="mItem">
											<ul class="mui-table-view">
												<li class="mui-table-view-cell mui-collapse">
													<a class="mui-navigate-right" href="#">
														<ol class="m-title">
															<li>
																<span class="mui-icon mui-icon-weixin"></span>
																<span>${new Date(newArr[i][0].time).getMonth()+1}月</span>
															</li>
															<li class="red">
																<span class="red">花费</span>
																<span class="red">${billNum}</span>
															</li>
															<li class="green">
																<span class="green">收入</span>
																<span class="green">${addNum}</span>
															</li>
															<li class="gray">
																<span class="gray">结余</span>
																<span class="gray">${addNum-billNum}</span>
															</li>
														</ol>
													</a>
													<div class="mui-collapse-content">
														<ul class="mui-table-view">
														${strAll}
														</ul>
													</div></li></ul></div>`
				}
				dom('.yBill').innerHTML = str;
			}
			dom('.num').innerHTML = numAll;
			dom('.add').innerHTML = addAll;
		}

		function addZero(day) {
			return day < 10 ? '0' + day : day;
		}
		//点击添加按钮跳转到添加页面
		dom('.addBill').addEventListener('tap', function() {
			localStorage.setItem('uid', uid);
			location.href = '../../page/addBill.html';
		})
		//添加点击事件，进行删除账单
		mui('.mui-scroll').on('tap', '.del', function() {
			//  console.log(this.parentNode.parentNode.remove())
			console.log(this.getAttribute('data-id'))

			var id = this.getAttribute('data-id');
			if (id) {
				mui.ajax('/api/delBill', {
					dataType: 'json',
					data: {
						id: id
					},
					success: function(res) {
						console.log(res)
						if (res.code === 1) {
							alert(res.msg);
							getData();
						}
					}
				})
			}
		})


	})
})
