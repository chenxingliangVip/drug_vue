export default {
	//左侧饼图  样品检测数
	option1: {
		tooltip: {  //鼠标悬浮样式
			trigger: 'item',
			formatter: '{b}',
			enterable: true
		},
		legend: {  //图例组件
			orient: 'vertical',
			bottom: '25%',
			icon: 'circle',
			data: ['在检样品数', '未检样品数'],
			textStyle: {  //图例的公共文本样式
				color: 'white',
				fontSize: 14
			},
		},
		series: [{
			'name': '样品检测',
			'type': 'pie',
			'radius': ['85%', '110%'],
			'top': '45',
			'avoidLabelOverlap': false,
			'startAngle': -18,
			'color': ['#9f8fc1'],
			'hoverAnimation': true,
			'legendHoverLink': false,
			'label': {
				'normal': {
					'show': false,
					'position': 'center'
				},
				'emphasis': {
					'show': false
				}
			},
			'labelLine': {
				'normal': {
					'show': false
				}
			},
			'data': [{
				'value': 40, //空白项固定值 占比40%
				itemStyle: {
					normal: {
						color: 'transparent'
					}
				}

			}, {
				'value': 20,
				'name': '在检样品数',
				itemStyle: {
					normal: {
						color: '#1a85e0'
					}
				}
			}, {
				'value': 40,
				'name': '未检样品数',
				itemStyle: {
					normal: {
						color: '#cc3b77'
					}
				}
			}]
		}, ]
	},

	//左侧柱状图 月度样品检测统计
	option2: {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},

		legend: {
			// orient: 'vertical',
			// right: '0',
			// top: '40%',
      // x: '80%', //用百分比 处理块与文字位置
      left: 'center',
      top:'90%',

			icon: 'square',
			data: ['已检样品', '未检样品', '送检样品'],
			textStyle: { //图例的公共文本样式
				color: 'white',
				fontSize: 14
			},
		},
		grid: {
			left: '3%',
			right: '20%',
			bottom: '12%',
			top: '6%',
			containLabel: true
		},
    xAxis: {
      type: 'value',
      position: 'top',
      axisLine: {  //x轴坐标轴轴线相关设置
        lineStyle: {
          color: '#fff',
          opacity: 0
        }
      },
      axisTick: {  //x轴坐标轴刻度相关设置
        show: false,
      },
      axisLabel: {  //x轴坐标轴刻度标签的相关设置
        fontSize: 14,
        fontWeight: 600,
      },
      splitLine: {  //坐标轴在 grid 区域中的分隔线
        show: false,
      }
    },
		yAxis: {
			type: 'category',  //坐标轴类型。
			data: ['2019-10', '2019-11', '2019-12', '2020-2', '2020-2', '2020-3'],
			axisLine: {  //坐标轴轴线相关设置
				lineStyle: {
					color: '#64a7e0',
					opacity: 0
				}
			},
			axisTick: {  //坐标轴刻度相关设置
				lineStyle: {
					color: '#64a7e0',
					opacity: 0
				}
			},
			axisLabel: {  //坐标轴刻度标签的相关设置
				fontSize: 14,
				fontWeight: 600
			}
		},
		series: [{
				name: '已验样品',
				type: 'bar',
				stack: '样品',  //stack 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置
				itemStyle: {
					normal: {
						color: '#64a7e0',
						shadowBlur: 20,
						shadowColor: '#2d82ca',
					}
				},
				data: [18, 23, 29, 100, 18, 33]
			},
			{
				name: '未检样品',
				type: 'bar',
				stack: '样品',
				itemStyle: {
					normal: {
						color: '#f56c6c',
						shadowBlur: 20,
						shadowColor: '#2d82ca',
					}
				},
				data: [19, 23, 31, 12, 130, 51]
			},
			{
				name: '送检样品',
				type: 'bar',
				itemStyle: {
					normal: {
						color: 'rgba(152, 251, 152, 0.77)',
						shadowBlur: 20,
						shadowColor: '#2d82ca',
					}
				},
				data: [19, 28, 31, 12, 11, 67]
			}
		]
	},
	//右侧柱状图  月度送样统计量
	option3: {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			// orient: 'vertical',
			// right: '0',
      // left:'77%',
			// top: '10%',
      left: 'center',
      top:'90%',
			icon: 'square',
			data: ['科室1-1', '科室1-2', '科室2-1', '科室2-2', '科室2-3', '科室2-3', '科室3', '科室4'],
			textStyle: {  //图例的公共文本样式
				color: 'white',
				fontSize: 14
			},
		},
		grid: {
			left: '3%',
			right: '20%',
			bottom: '10%',
			top: '5%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			position: 'top',
			axisLine: {  //x轴坐标轴轴线相关设置
				lineStyle: {
					color: '#fff',
					opacity: 0
				}
			},
			axisTick: {  //x轴坐标轴刻度相关设置
				show: false,
			},
			axisLabel: {  //x轴坐标轴刻度标签的相关设置
				fontSize: 14,
				fontWeight: 600,
			},
			splitLine: {  //坐标轴在 grid 区域中的分隔线
				show: false,
			}
		},
		yAxis: {
			type: 'category',  //坐标轴类型。
			data: ['2020-1', '2020-2', '2020-3'],
			axisLine: {  //Y轴坐标轴轴线相关设置
				lineStyle: {
					color: '#64a7e0',
					opacity: 0
				}
			},
			axisTick: {  //Y轴坐标轴刻度相关设置
				lineStyle: {
					color: '#64a7e0',
					opacity: 0
				}
			},
			axisLabel: {  //Y轴坐标轴刻度标签的相关设置
				fontSize: 14,
				fontWeight: 600
			}
		},
		series: [{
			name: '科室1-1',
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#64a7e0',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [11, 3, 14, ]
		}, {
			name: '科室1-2',
			type: 'bar',
			itemStyle: {
				normal: {
					color: 'rgba(152, 251, 152, 0.77)',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [9, 23, 31]
		}, {
			name: '科室2-1',
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#e0c870',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [4, 18, 21]
		}, {
			name: '科室2-2',
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#f56c6c',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [9, 8, 14]
		}, {
			name: '科室2-3',
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#6e7073',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [12, 24, 11]
		}, {
			name: '科室2-4',
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#0ae5fb',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [23, 5, 13]
		}, {
			name: '科室3',
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#af2626',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [31, 22, 11]
		}, {
			name: '科室4',
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#365637',
					shadowBlur: 10,
					shadowColor: '#2d82ca',
				}
			},
			data: [19, 2, 21]
		}]
	},

}
