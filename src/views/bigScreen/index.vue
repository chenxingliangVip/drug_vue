<template>
	<div class="mainViewBig " v-bind:style="style">
		<nx-full-screen class="allfull screenfull" style="text-align: left"></nx-full-screen>
		<!--左 侧 列-->
		<div class="content-item1">
			<!--模块一  年度样品检测状态-->
			<div class="item1-module1">
				<div class="module-top">
					<img src="@/assets/img/iconfont.png" />
					<h2 class="module-title">年度样品检测状态</h2>
				</div>
				<div class="module-body">
					<!--左侧数量-->
					<div class="mession">
						<div class="mession-data1">
							<img class="left-icon1" src="@/assets/img/success.png">
							<div class="number">
								<p class="right-num"><span>{{yearSample.hasTestSample}}</span>（个）</p>
								<p class="wrong-num">已检测样品数</p>
							</div>
						</div>
						<div class="mession-data1">
							<img class="left-icon1" src="@/assets/img/fail.png">
							<div class="number">
								<p class="right-num"><span>{{yearSample.errorTate}}</span>%</p>
								<p class="wrong-num">差错率</p>
							</div>
						</div>
					</div>
					<!--右侧饼图-->
					<div class="echart1" ref="echart1"></div>
				</div>
			</div>
			<!--模块二  月度样品检测统计-->
			<div class="item1-module2">
				<div class="module-top">
					<img src="@/assets/img/iconfont.png" />
					<h2 class="module-title">月度样品检测统计</h2>
				</div>
				<div class="module-body">
					<!--柱状图-->
					<div class="echart2" ref="echart2"></div>
				</div>
			</div>
			<!--模块三  月度检测排行榜-->
			<div class="item1-module3">
				<div class="module-top">
					<img src="@/assets/img/iconfont.png" />
					<h2 class="module-title">月度检测排行榜</h2>
				</div>
				<div class="module-body">
					<!--工作量排行-->
					<div class="body-left">
						<div class="icons">
							<img src="@/assets/img/paihang.png" />
							<p class="txt">工作量</p>
						</div>
						<ul class="workTable">
							<li v-for="(item,index) in workHourTable" :key="index">
								<p class="workPart1">{{index+1}}</p>
								<p class="workPart2">
									<span class="workMame">{{item.userName}}</span> （
									<span class="workTime">{{item.hours}}</span>小时）
								</p>
							</li>
						</ul>
					</div>
					<!--及时率排行-->
					<div class="body-right">
						<div class="icons">
							<img src="@/assets/img/paihang.png" />
							<p class="txt">及时率</p>
						</div>
						<ul class="workTable">
							<li v-for="(item,index) in rateTable" :key="index">
								<p class="workPart1">{{index+1}}</p>
								<p class="workPart2">
									<span class="workMame">{{item.userName}}</span> （
									<span class="workTime">{{item.effect}}</span>）
								</p>
							</li>
						</ul>
					</div>
				</div>
			</div>

		</div>

		<!--中间列-->
		<div class="content-item2">
			<!--头部-->
			<div class="header">
				<h1 class="header-title">威尔研究院  分析测试中心</h1>
			</div>
			<div class="middle">
				<!-- 时间日期-->
				<div class="middleLeft">
					<div class="TimeForm">
						<p class="time">{{nowTime}}</p>
						<p class="date">{{nowDate}} {{nowWeek}}</p>
					</div>
					<div class="DateForm">
						<p>
							<img src="@/assets/img/tianqi.png" />稳定运行
						</p>
						<p><span>{{timestap}}</span> 天</p>
					</div>
				</div>
				<div class="line">
					<h1>威 &nbsp;&nbsp;&nbsp;尔 &nbsp;&nbsp;&nbsp;药 &nbsp;&nbsp;&nbsp;业</h1>
					<h1>6&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;5&nbsp;&nbsp;&nbsp;1</h1>
				</div>
				<div class="middleRight">
					<p>收集样品数量<span>{{methodAndPersonAndSample.sampleCount}}个</span></p>
					<p>分析方法<span>3{{methodAndPersonAndSample.methodCount}}个</span></p>
					<p>分析人员<span>{{methodAndPersonAndSample.staffCount}}名</span></p>
				</div>
				<div class="clearBoth"></div>
			</div>
			<!--中间表格 实时送样信息-->
			<div class="bottom">
				<div class="module-top" style="width: 300px">
					<img src="@/assets/img/iconfont.png" />
					<h2 class="module-title">实时送样信息</h2>
				</div>
				<div class="module-table">
					<table>
						<tr><th>序号</th><th>送样时间</th>
							<th>样品名称</th><th>样品批号</th>
							<th>送样人</th><th>检测组</th>
						</tr>
						<tr v-for="(item,index) in sampleTable" :key="index">
							<td><p style="width:40px">{{index+1}}</p></td>
							<td><p class="listTime" style=" width: 170px;">{{item.createTimeMinFt}}</p></td>
							<td><p class="listName" :title="item.materialName">{{item.materialName}}</p></td>
							<td><p style="width:140px" :title="item.sampleNum">{{item.sampleNum}}</p></td>
							<td>
                <p style="width:80px" v-if="item.userName !='未送样'">{{item.userName}}</p>
                <p style="width:80px;color: yellow" v-else>{{item.userName}}</p>
              </td>
							<td><p  style="width:100px">{{item.deptName}}</p></td>
						</tr>
					</table>
				</div>

				<div class="lastTxt">
					<p><span>质量方针：</span>公平公正、准确及时、持续改进</p>
					<p><span>质量目标：</span>及时率>85%、差错率
						<0.5%、持证上岗率100%、满意度大于95分</p>
				</div>
			</div>
		</div>

		<!--右侧列-->
		<div class="content-item3">
			<!--模块一 轮播图-->
			<div class="item3-module1">
				<div class="module-top">
					<img src="@/assets/img/iconfont.png" />
					<h2 class="module-title">检测仪器</h2>
				</div>
				<div class="item3-moduleImg">
					<div class="block">
						<el-carousel height="250px">
							<el-carousel-item v-for="(item,index) in Img" :key="index">
								<img class="lunboImg" :src="item.src">
							</el-carousel-item>
						</el-carousel>
					</div>
				</div>
			</div>
			<!--模块二 柱状图-->
			<div class="item3-module2">
				<div class="module-top">
					<img src="@/assets/img/iconfont.png" />
					<h2 class="module-title">科室月度送样量统计</h2>
				</div>
				<div class="module2-body">
					<div class="echart3" ref="echart3"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import resize from '@/js/resize'
	import echartOption from '@/js/echartOption'
	import "@/styles/bigScreen.scss"
	import nxFullScreen from '@/components/nx-full-screen/index'
  import { formatDate } from '@/utils/formatDate'

	export default {
		name: 'bigScreen',
		components: {
			nxFullScreen
		},
		data() {
			return {
			  sampleTable:[],
			  workHourTable:[],
        rateTable:[],
        yearSample:{},
        timestap:0,
        methodAndPersonAndSample:{},

				style: {}, //缩放样式
				nowTime: new Date(),
				nowDate: new Date(),
				nowWeek: new Date(),
				Img: [],
			}
		},
		methods: {
			pageShow() { //页面初始宽高显示 和 页面大小改变监听
				this.style = resize.setScale();
				window.onresize = () => {
					this.style = resize.setScale();
				}
			},
			getdateFormat() { //显示时间
				var _this = this;
				let wk = new Date().getDay()
				let yy = String(new Date().getFullYear())
				let mm = new Date().getMonth() + 1
				let dd = String(new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
				let hou = String(new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours())
				let min = String(new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes())
				let sec = String(new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds())
				let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				let week = weeks[wk]

				_this.nowTime = hou + ':' + min + ':' + sec;
				_this.nowDate = yy + '/' + mm + '/' + dd
				_this.nowWeek = week
			},
			getEchartData1(checkNum1,checkNum2) { //echart1 年度样品检测状态
				let echart1 = this.$echarts.init(this.$refs.echart1);
				// 计算图形占比 ，直接checkNum1代入在检样品数，checkNum2代入未检样品数
				echartOption.option1.series[0].data[0].value = 40;
				echartOption.option1.series[0].data[1].value = (checkNum1 * 60) / (checkNum1 + checkNum2);
				echartOption.option1.series[0].data[2].value = (checkNum2 * 60) / (checkNum1 + checkNum2);
				// legend图例组件赋值   \n换行
				echartOption.option1.legend.data = [checkNum1 + '（个）\n' + '在检样品数', checkNum2 + '（个）\n' + '未检样品数']
				echartOption.option1.series[0].data[1].name = checkNum1 + '（个）\n' + '在检样品数'
				echartOption.option1.series[0].data[2].name = checkNum2 + '（个）\n' + '未检样品数'
				echart1.setOption(echartOption.option1)
			},
			getEchartData2() { //echart2 月度样品检测统计
				let echart2 = this.$echarts.init(this.$refs.echart2);
				echart2.setOption(echartOption.option2)
			},
			getEchartData3() { //echart3 月度送样统计量
				let echart3 = this.$echarts.init(this.$refs.echart3);
				echart3.setOption(echartOption.option3)
			},
      setFullScreen(){
        this.$http({
          url: "/drug/fullScreen/setScreenFull",
          method: "post",
        }).then(resp => {

        });
      },

      getBigScreenSampleList(){
			  let self = this;
        this.$http({
          url: "/drug/bigScreen/querySampleBigScreenList",
          method: "post",
        }).then(resp => {
            self.sampleTable = resp.result;
        });
      },

      getMethodAndPersonAndSampleCount(){
			  let self = this;
        this.$http({
          url: "/drug/bigScreen/queryMethodAndPersonAndSampleCount",
          method: "post",
        }).then(resp => {
            self.methodAndPersonAndSample = resp.result;
        });
      },
      getWorkHour(){
        let self = this;
        let year = formatDate(new Date(), "yyyy");
        let moth = formatDate(new Date(), "MM");
        let day = year+"-"+moth+"-01";
        let endDay = year+"-"+moth+"-31";
        this.$http({
          url: "/drug/bigScreen/queryWorkHour",
          method: "post",
          params:{startTime:day,endTime:endDay}
        }).then(resp => {
          self.workHourTable = resp.result;
        });
      },

      getMothRate(){
        let self = this;
        let year = formatDate(new Date(), "yyyy");
        let moth = formatDate(new Date(), "MM");
        let day = year+"-"+moth+"-01";
        let endDay = year+"-"+moth+"-31";
        this.$http({
          url: "/drug/bigScreen/queryMothRate",
          method: "post",
          params:{startTime:day,endTime:endDay}
        }).then(resp => {
           self.rateTable = resp.result;
        });
      },



      getYearSample(){
			  let self = this;
        let day = formatDate(new Date(), "yyyy");
        day = day+"-01-01";
        this.$http({
          url: "/drug/bigScreen/queryYearSample",
          method: "post",
          params:{startTime:day}
        }).then(resp => {
          self.yearSample = resp.result;
          self.getEchartData1(resp.result.testingSample,resp.result.noTestSample)
        });
      },
      queryMothSampleSeasonTotal(){
			  let self = this;
        this.$http({
          url: "/drug/bigScreen/queryMothSampleSeasonTotal",
          method: "post",
        }).then(resp => {
          let echart2 = this.$echarts.init(this.$refs.echart2);
          let option = echartOption.option2;
          let mothSet = new Set();
          for(let data of resp.result){
            mothSet.add(data["startTime"]);
          }
          let sampleStatus = ["已完成样品","待领检样品","检测中样品"];
          let map = {"已完成样品":[0,0,0,0,0,0],"待领检样品":[0,0,0,0,0,0],"检测中样品":[0,0,0,0,0,0]};
          let i = 0;
          let j = 0;
          let k = 0;
          for(let d of resp.result){
            if('5' == d.checkStatus){
              map["已完成样品"][i] = d.counts;
              i++;
            }
            if('0' == d.checkStatus){
              map["待领检样品"][j] = d.counts;
              j++;
            }
            if('2' == d.checkStatus){
              map["检测中样品"][k] = d.counts;
              k++;
            }
          }
          let series = [];
          for(let key in map){
            let stack = "same";
            if(key =='检测中样品'){
              stack ="";
            }
            let color ="";
            let shadowColor = "";
            if(key =='已完成样品'){
              color ="rgba(152, 251, 152, 0.77)";
              shadowColor = "#2d82ca";
            }
            if(key =='待领检样品'){
              color ="#f56c6c";
              shadowColor = "#2d82ca";
            }
            if(key =='检测中样品'){
              color ="#64a7e0";
              shadowColor = "#2d82ca";
            }
            let seri = {
              name: key,
              type: 'bar',
              stack: stack,  //stack 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置
              itemStyle: {
                normal: {
                  color: color,
                  shadowColor: shadowColor,
                  shadowBlur: 20,
                }
              },
              data: map[key]
            };
            series.push(seri);
          }
          option.legend.data = sampleStatus;
          // option.yAxis.data = (Array.from(mothSet)).reverse();
          option.yAxis.data = Array.from(mothSet);
          option.series = series;
          echart2.setOption(option)
        });
      },

      getMothTotal(){
			  let self = this;
        this.$http({
          url: "/drug/bigScreen/queryMothTotal",
          method: "post",
        }).then(resp => {
          let echart3 = self.$echarts.init(this.$refs.echart3);
          let option3 = echartOption.option3;
          let deptNames = new Set();
          let mothSet = new Set();
          for(let data of resp.result){
            deptNames.add(data["deptName"]);
            mothSet.add(data["startTime"]);
          }
          let mothList = Array.from(mothSet);
          let map = {};
          for(let s of deptNames ){
            map[s] = [0,0,0];
            for(let d of resp.result){
              if(s == d.deptName){
                let index =  mothList.indexOf(d.startTime);
                map[s][index] = d.counts;
              }
            }
            map[s] = map[s].reverse();
          }
          let series = [];
          for(let key in map){
            let seri = {
              name: key,
              type: 'bar',
              itemStyle: {
                normal: {
                  shadowBlur: 10,
                }
              },
              data: map[key]
            };
            series.push(seri);
          }
          option3.legend.data = Array.from(deptNames);
          option3.yAxis.data = (Array.from(mothSet)).reverse();
          option3.series = series;
          echart3.setOption(option3)
        });
      },

      getPictureList() {
        let self = this;
        self.$http({
          url: "/drug/images/queryImagesList",
          method: "post",
          params:{fileType:"1",fileCheck:"1"}
        }).then(resp => {
          if (resp.success) {
            self.Img = [];
            for(let data of resp.result){
              let src = {src:data.fileBlob};
              self.Img.push(src);
            }
          }
        });
      },
      init(){
        let startDay = new Date("2020-01-01");
        this.timestap = parseInt((new Date().getTime() - startDay.getTime())/(1000*3600*24));
        this.getBigScreenSampleList();
        this.pageShow();
        this.getMothTotal();
        this.queryMothSampleSeasonTotal();
        this.getMethodAndPersonAndSampleCount();
        this.getYearSample();
        this.getWorkHour();
        this.getMothRate();
        this.getdateFormat();
        this.getPictureList();
      }

		},
		mounted() {
      this.init();
      this.setFullScreen();
			setInterval(() => {
				this.getdateFormat();
			}, 1000);
      setInterval(() => {
        this.init();
      }, 1000*10)
		}
	}
</script>

<style scoped>

</style>
