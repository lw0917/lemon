require(['../js/main.js'], function() {
	require(['mui', 'dom', 'dtpicker', 'picker'], function(mui, dom) {
		var type = 1,
			uid = localStorage.getItem(('uid')),
			dtpicker = null,
			icon = null,
			intro = null,
			time = null;

		init();

		function init() {
			mui.init();
			///初始化time
			loadTime();
			//点击事件
			addEvent();
			//时间选择
			addTime();
		}

		function loadTime() {
			mui.ajax('/api/classifylist', {
				dataType: 'json',
				data: {
					uid: uid,
					type: type
				},
				success: function(res) {

					if (res.code === 1) {
						renderIcon(res.msg);
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
							intro=data[j].intro;
							str +=
								`<dl data-icon="${data[j].icon}" data-intro="${data[j].intro}" class="bg">
									<dt>
										<span class="${data[j].icon}"></span>
									</dt>
									<dd>${data[j].intro}</dd>
								</dl>`
						} else {
							str +=
								`<dl data-icon="${data[j].icon}" data-intro="${data[j].intro}">
							    <dt>
                        			<span class="${data[j].icon}"></span>
                        		</dt>
                        		<dd>${data[j].intro}</dd>
                        	</dl>`
						}
					}
				}
				str +=
					`<dl data-intro="自定义"> <dt>
                        	    <span class="mui-icon mui-icon-plus"></span>
                               </dt>
                        		<dd>自定义</dd>
                        	</dl></div>`;
			}
			dom('.mui-slider-group').innerHTML = str;
			//触发轮播
			mui('.mui-slider').slider();
		}

		function addTime() {
			//
			var year = new Date().getFullYear(),
				month = new Date().getMonth() + 1,
				day = new Date().getDate();
			// hour=new Date().getHours(),
			// minute=new Date().getMinutes();
			month = month < 10 ? '0' + month : month;
			day = day < 10 ? '0' + day : day;
			// hour = hour < 10 ? '0' + hour : hour;
			// minute = minute < 10 ? '0' + minute : minute;
			dom('.time').innerHTML = year + '-' + month + '-' + day;
			time=year + '-' + month + '-' + day;
			//实例化
			dtPicker = new mui.DtPicker({
				type: 'date'
			});
			//点击可以改变日期时间
			dom('.timer').addEventListener('tap', function() {
				dtPicker.show(function(selectItems) {
					dom('.time').innerHTML = selectItems.text;
					time = selectItems.text;
				})
			})

		}

		function addEvent() {
			//点击返回主页面
			dom('.back').addEventListener('tap', function() {
				location.href = '../../index.html';
			})
			//点击tab切换
			mui('.tab').on('tap', 'span', function() {
				dom('.mui-slider-group').innerHTML = '';
				type = this.getAttribute('data-type');
				var spans = dom('.tab').querySelectorAll('span');
				spans.forEach(function(item) {
					item.classList.remove('active');
				})
				this.classList.add('active');
				loadTime();
			})
			//点击图标进行选择；
			mui('.mui-slider-group').on('tap', 'dl', function() {
				var dls = document.querySelectorAll('dl');
				dls.forEach(function(item) {
					item.classList.remove('bg');
				})
				var tit = this.getAttribute('data-intro');
				if (tit === '自定义') {
					var obj = {};
					obj.uid = uid;
					obj.type = type;
					localStorage.setItem('data', JSON.stringify(obj));
					location.href = '../../page/addClassify.html';
				} else {
					this.classList.add('bg');
					icon = this.getAttribute('data-icon');
					intro = tit;
				}
			})
			//计算器
			mui('ul').on('tap', 'span', function() {
				var number = dom('.number');
				if (this.innerHTML === 'X') {
					if (number.innerHTML.length <= 1 || number.innerHTML === '0.00') {
						return number.innerHTML = '0.00';
					}
					number.innerHTML = number.innerHTML.substr(0, number.innerHTML.length - 1);
				} else if (this.innerHTML.trim() === '完成') {
					var money = number.innerHTML.trim();
					if (type && intro && money && icon && time, uid) {
						mui.ajax('/api/addBill', {
							type: 'post',
							dataType: 'json',
							data: {
								type: type,
								intro: intro,
								money: money,
								uid: uid,
								icon: icon,
								time: time
							},
							success: function(res) {
								if (res.code === 1) {
									alert(res.msg);
									location.href = '../../index.html';
								}
							}
						})
					} else {
						alert('数据不完整')
					}

				} else if (this.innerHTML === '.') {
					if (number.innerHTML.indexOf('.') != -1) {
						number.innerHTML = number.innerHTML;
					} else {
						number.innerHTML += this.innerHTML;
					}
				} else if (number.innerHTML === '0.00') {
					number.innerHTML = this.innerHTML;
				} else if (number.innerHTML.indexOf('.') != -1 && number.innerHTML.split('.')[1].length >= 2) {
					number.innerHTML = number.innerHTML;
				} else {
					number.innerHTML += this.innerHTML;
				}
			})


		}
	})
})
