require.config({
	baseUrl:'/js/',
	paths:{
		mui:'./libs/mui.min',
	    picker:'./libs/mui.picker',
		poppicker:'./libs/mui.poppicker',
		dtpicker:'./libs/mui.dtpicker',
		echarts:'./libs/echarts.min',
		
		dom:'./common/dom'
	},
	shim:{
		'poppicker':{
			deps:['mui']
		},
		'picker':{
			deps:['mui']
		},
		'dtpicker':{
			deps:['mui']
		}
	}
})