<template>
  <div class="mainView" v-bind:style="style" id="mainView">
    <!--左 侧 列-->
    <div class="content-item1">
      <!--模块一  年度样品检测状态-->
      <div class="item1-module1">
        <div class="module-top">
          <img src="../../assets/img/iconfont.png" />
          <h2 class="module-title">年度样品检测状态</h2>
          <span class="right-icon"></span>
        </div>
        <div class="module-body">
          <!--左侧数量-->
          <div class="mession">
            <div class="mession-data1">
              <img class="left-icon1" src="../../assets/img/success.png">
              <div class="number">
                <p class="right-num"><span>1000</span>（个）</p>
                <p class="wrong-num">已检测样品数</p>
              </div>
            </div>
            <div class="mession-data1">
              <img class="left-icon1" src="../../assets/img/fail.png">
              <div class="number">
                <p class="right-num"><span>0.1</span>%</p>
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
          <img src="../../assets/img/iconfont.png" />
          <h2 class="module-title">月度样品检测统计</h2>
          <span class="right-icon"></span>
        </div>
        <div class="module-body">
          <!--柱状图-->
          <div class="echart2" ref="echart2"></div>
        </div>
      </div>
      <!--模块三  月度检测排行榜-->
      <div class="item1-module3">
        <div class="module-top">
          <img src="../../assets/img/iconfont.png" />
          <h2 class="module-title">月度检测排行榜</h2>
          <span class="right-icon"></span>
        </div>
        <div class="module-body">
          <!--工作量排行-->
          <div class="body-left">
            <div class="icons">
              <img src="../../assets/img/paihang.png" />
              <p class="txt">工作量</p>
            </div>
            <ul class="workTable">
              <li>
                <p class="workPart1">1</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">155</span>小时）
                </p>
              </li>
              <li>
                <p class="workPart1">2</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">155</span>小时）
                </p>
              </li>
              <li>
                <p class="workPart1">3</p>
                <p class="workPart2">
                  <span class="workMame">张三三三</span> （
                  <span class="workTime">155</span>小时）
                </p>
              </li>
              <li>
                <p class="workPart1">4</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">155</span>小时）
                </p>
              </li>
              <li>
                <p class="workPart1">5</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">155</span>小时）
                </p>
              </li>
              <li>
                <p class="workPart1">6</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">155</span>小时）
                </p>
              </li>
            </ul>
          </div>
          <!--及时率排行-->
          <div class="body-right">
            <div class="icons">
              <img src="../../assets/img/paihang.png" />
              <p class="txt">及时率</p>
            </div>
            <ul class="workTable">
              <li>
                <p class="workPart1">1</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">99</span>%）
                </p>
              </li>
              <li>
                <p class="workPart1">2</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">99</span>%）
                </p>
              </li>
              <li>
                <p class="workPart1">3</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">99</span>%）
                </p>
              </li>
              <li>
                <p class="workPart1">4</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">99</span>%）
                </p>
              </li>
              <li>
                <p class="workPart1">5</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">99</span>%）
                </p>
              </li>
              <li>
                <p class="workPart1">6</p>
                <p class="workPart2">
                  <span class="workMame">张三</span> （
                  <span class="workTime">99</span>%）
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
            <p class="date">{{nowDate}} pm {{nowWeek}}</p>
          </div>
          <div class="DateForm">
            <p>
              <img src="../../assets/img/tianqi.png" />稳定运行
            </p>
            <p><span>0150</span> 天</p>
          </div>
        </div>
        <div class="line"></div>
        <div class="middleRight">
          <p>收集样品数量<span>1190个</span></p>
          <p>分析方法<span>300个</span>分析人员<span>15名</span></p>
        </div>
        <div class="clearBoth"></div>
      </div>
      <!--中间表格 实时送样信息-->
      <div class="bottom">
        <div class="module-top" style="width: 300px">
          <img src="../../assets/img/iconfont.png" />
          <h2 class="module-title">实时送样信息</h2>
          <span class="right-icon"></span>
        </div>
        <div class="module-table">
          <table>
            <tr>
              <th width="5%">序号</th>
              <th width="25%">送样时间</th>
              <th width="30%">样品名称</th>
              <th width="15%">样品批号</th>
              <th width="10%">送样人</th>
              <th width="15%">检测组</th>
            </tr>
            <tr>
              <td width="5%">1</td>
              <td width="25%">
                <p class="listTime">2020-3-24 15:30</p>
              </td>
              <!-- 文字过长省略号显示，title鼠标悬浮显示全部文字-->
              <td width="30%">
                <p class="listName" title="样品样品样品样品样品样品样品样品样品样品样品样品">样品样品样品样品样品样品样品样品样品样品样品样品</p>
              </td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">2</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">3</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">4</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">5</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">6</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">7</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">8</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">9</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
            </tr>
            <tr>
              <td width="5%">10</td>
              <td width="25%">2020-3-24 15:30</td>
              <td width="30%">样品样品样品</td>
              <td width="15%">155-12-213</td>
              <td width="10%">李四</td>
              <td width="15%">分析一组</td>
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
          <img src="../../assets/img/iconfont.png" />
          <h2 class="module-title">检测仪器</h2>
          <span class="right-icon"></span>
        </div>
        <div class="item3-moduleImg">
          <div class="block">
            <el-carousel height="300px">
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
          <img src="../../assets/img/iconfont.png" />
          <h2 class="module-title">科室月度送样量统计</h2>
          <span class="right-icon"></span>
        </div>
        <div class="module2-body">
          <div class="echart3" ref="echart3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import resize from '../../js/resize'
  import echartOption from '../../js/echartOption'

  export default {
    name: 'Mainpage',
    data() {
      return {
        style: {}, //缩放样式
        nowTime: new Date(),
        nowDate: new Date(),
        nowWeek: new Date(),
        Img: [ //轮播图片
          {
            src: require("../../assets/img/img1.png")
          },
          {
            src: require("../../assets/img/img2.png")
          }
        ]
      }
    },
    methods: {
      pageShow() {  //页面初始宽高显示 和 页面大小改变监听
        this.style = resize.setScale();
        window.onresize = () => {
          this.style = resize.setScale();
        }
      },
      getdateFormat() {  //显示时间
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
      getEchartData1() {  //echart1 年度样品检测状态
        let echart1 = this.$echarts.init(this.$refs.echart1);
        // 计算图形占比 ，直接checkNum1代入在检样品数，checkNum2代入未检样品数
        let checkNum1 = 40,
          checkNum2 = 60;
        echartOption.option1.series[0].data[0].value = 40;
        echartOption.option1.series[0].data[1].value = (checkNum1 * 60) / (checkNum1 + checkNum2);
        echartOption.option1.series[0].data[2].value = (checkNum2 * 60) / (checkNum1 + checkNum2);
        // legend图例组件赋值   \n换行
        echartOption.option1.legend.data = [checkNum1 + '（个）\n' + '在检样品数', checkNum2 + '（个）\n' + '未检样品数']
        echartOption.option1.series[0].data[1].name = checkNum1 + '（个）\n' + '在检样品数'
        echartOption.option1.series[0].data[2].name = checkNum2 + '（个）\n' + '未检样品数'
        echart1.setOption(echartOption.option1)
      },
      getEchartData2() {  //echart2 月度样品检测统计
        let echart2 = this.$echarts.init(this.$refs.echart2);
        echart2.setOption(echartOption.option2)
      },
      getEchartData3() {  //echart3 月度送样统计量
        let echart3 = this.$echarts.init(this.$refs.echart3);
        echart3.setOption(echartOption.option3)
      },
    },
    mounted() {
      this.pageShow();
      this.getEchartData1();
      this.getEchartData2();
      this.getEchartData3();
      this.getdateFormat()

      setInterval(() => {
        this.getdateFormat();
      }, 1000)
    },
  }
</script>

<style scoped lang="scss">
  #mainView{
    width: 100%;height: 100%;user-select:none;font-size: 14px;
  }
  * {
    box-sizing: border-box;margin: 0;padding: 0;
    outline: none;
  }
  ul{
    padding: 0;
  }
  li{
    list-style: none;
  }
  .el-carousel__indicators--horizontal {
    bottom: 3%
  }
  #mainView {
    text-align: center;
    background: url("../../assets/img/bg.png");
    background-size: 100%;
    width: 100%;height: 100%;overflow: hidden;
  }
  //大屏样式
  .mainView {
    width: 1920px;
    height: 1080px;
    color: #fff;
    transform-origin: 0 0 0;
    display: none;
    .clearBoth {
      clear: both;
    }
    .content-item1,
    .content-item3 {
      width: 27%;
      height: 100%;
      float: left;
    }
    .content-item2 {
      width: 46%;
      height: 100%;
      float: left;
      border-left: 1px solid rgba(35, 110, 142, 1);
      border-right: 1px solid rgba(35, 110, 142, 1);
    }
    .module-top {
      height: 40px;
      position: relative;
      img {
        position: absolute;
        width: 27px;
        left: 0px;
        top: 6px;
      }
      .module-title {
        margin: 0;
        padding: 5px;
        padding-left: 35px;
        text-align: left;
        font-size: 18px;
        font-weight: 400;
        width: 90%;
        height: 40px;
        float: left;
        background: #3a679e47;
        line-height: 30px;
      }
      .right-icon {
        float: right;
        width: 8%;
        height: 40px;
        background: url("../../assets/img/book.png");
        background-size: 140% 100%;
        background-position: center center;
        opacity: 0.8;
      }
    }
    .module-body {
      border: 1px solid #3a679e47;
      margin: 10px 0;
      box-shadow: 0px 0px 10px 10px #3a679e47 inset;
    }
    /*左 侧 列*/
    .content-item1 {
      padding: 20px 30px;
      //模块一  年度样品检测状态
      .item1-module1 {
        height: 300px;
        .module-body {
          height: 240px;
          .mession {
            width: 50%;
            height: 100%;
            float: left;
            padding: 40px 30px;
            .mession-data1 {
              height: 50%;
              margin-bottom: 20px;
              .left-icon1 {
                float: left;
                width: 45px;
              }
              .number {
                float: right;
                font-size: 14px;
                .right-num {
                  border: 1px dotted #666;
                  margin: 0;
                  width: 110px;
                  span {
                    font-size: 28px;
                    font-weight: 400;
                  }
                }
                .wrong-num {
                  margin: 5px;
                }
              }
            }
          }
          .echart1 {
            width: 228px;
            height: 238px;
            float: left;
          }
        }
      }
      //模块二  月度样品检测统计
      .item1-module2 {
        height: 440px;
        .module-body {
          height: 380px;
          .echart2 {
            width: 430px;
            height: 380px;
          }
        }
      }
      //模块三  月度检测排行榜
      .item1-module3 {
        height: 300px;
        .module-body {
          height: 240px;
          padding: 20px;
          .body-right {
            margin-left: 2%;
          }
          .body-left,
          .body-right {
            width: 49%;
            float: left;
            height: 100%;
            .icons {
              float: left;
              img {
                width: 15px;
              }
              .txt {
                color: #d4e01b;
                font-size: 14px;
              }
            }
            ul {
              float: right;
              li {
                border: 1px dotted #666;
                width: 155px;
                line-height: 27px;
                height: 27px;
                margin-bottom: 6px;
                p {
                  float: left;
                }
                .workPart1 {
                  width: 15px;
                }
                .workPart2 {
                  width: 137px;
                  font-size: 14px;
                  float: left;
                  text-align: center;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }
    }
    /*中 间 列*/
    .content-item2 {
      padding: 20px 30px;
      //头部
      .header {
        background: url("../../assets/img/title.png");
        background-size: 140% 100%;
        background-position: center center;
        height: 80px;
        .header-title {
          font-weight: 400;
          font-size: 30px;
          padding-top: 20px;
          padding-left: 20px;
        }
      }
      .middle {
        height: 180px;
        padding: 30px 50px;
        .middleLeft,
        .middleRight {
          float: left;
          height: 100%;
        }
        .middleLeft {
          width: 50%;
          border: 1px solid #3a679e47;
          box-shadow: 0px 0px 10px 10px #3a679e47 inset;
          padding: 20px 25px;
          .TimeForm {
            float: left;
            width: 50%;
            padding-right: 5px;
            .time {
              font-size: 32px;
              font-weight: 400;
              margin-bottom: 10px;
            }
          }
          .DateForm {
            border-left: 2px solid #fff;
            margin-left: 5%;
            float: left;
            width: 45%;
            height: 100%;
            img {
              width: 25px;
              position: absolute;
              left: 19px;
              top: 6px;
            }
            p {
              font-size: 14px;
              line-height: 40px;
              position: relative;
              span {
                font-size: 30px;
              }
            }
          }
        }
        .middleRight {
          width: 44%;
          padding: 10px 20px;
          p {
            line-height: 50px;
            height: 50px;
            text-align: right;
            span {
              font-size: 16px;
              border: 1px solid #3a679e47;
              box-shadow: 0px 0px 10px 10px #3a679e47 inset;
              padding: 5px 10px;
              margin: 0 10px;
            }
          }
        }
        .line {
          width: 1%;
          height: 100%;
          float: left;
          margin-left: 5%;
          background: url('../../assets/img/line.png');
          background-size: 100%;
          background-position: center center;
        }
      }
      .bottom {
        .lastTxt {
          border-top: 1px solid #3a679e47;
          border-bottom: 1px solid #3a679e47;
          box-shadow: 0px 0px 10px 10px #3a679e47 inset;
          padding: 20px;
          p {
            height: 40px;
            line-height: 40px;
            font-size: 22px;
            font-weight: 600;
            text-align: left;
            span {
              color: #decf19
            }
          }
        }
        .module-table {
          height: 608px;
          overflow: auto;
          margin-bottom: 0;
          table {
            width: 100%;
            font-size: 17px;
            border-collapse: separate;
            border-spacing: 12px;
            tr {
              height: 40px;
              line-height: 40px;
              th {
                color: #337bb9;
              }
              td {
                border: 1px dotted #666;
                .listName {
                  width: 220px;
                  padding: 0px 10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .listTime {
                  width: 190px;
                  padding: 0px 10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }
    }
    /*右 侧 列*/
    .content-item3 {
      padding: 20px 30px;
      .item3-module1 {
        .lunboImg {
          width: 100%;
          height: 280px;
          margin-top: 10px;
        }
      }
      .item3-module2 {
        .module2-body {
          height: 645px;
          margin: 10px 0;
          box-shadow: 0px 0px 10px 10px #3a679e47 inset;
          border: 1px solid #3a679e47;
          .echart3 {
            width: 450px;
            height: 645px;
          }
        }
      }
    }
  }
</style>
