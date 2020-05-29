<template>
  <div style="width: 900px;padding-top: 44px;" id="recordCard">
    <div class="recordCard" >
      <div class="header" style="margin-top: 50px">
        <img src="@/assets/img/recordImg.png" />
        <span class="">·威尔研究院测试中心检验报告</span>
        <div style="clear: both;"></div>
      </div>
      <div class="container">
        <div class="content_item content_item1">
          <p class="item_txt">No.1  检样信息</p>
          <table border="1" class="mainTable">
            <tr>
              <td class="column">物料编码</td>
              <td>P01016</td>
              <td class="column" rowspan="2">检 验 号</td>
              <td rowspan="2">T2019000001</td>
              <td class="img_item" rowspan="4">
                <img src="../../assets/img/paramImg4.jpg" />
              </td>
            </tr>
            <tr>
              <td class="column">样品名称</td>
              <td>固体山梨醇</td>
            </tr>
            <tr>
              <td class="column">样品规格</td>
              <td>成品</td>
              <td class="column">部    门</td>
              <td>中试组1</td>
            </tr>
            <tr>
              <td class="column">样品等级</td>
              <td>注射级</td>
              <td class="column">申 请 人</td>
              <td>王华山</td>
            </tr>
            <tr>
              <td class="column">样品批号</td>
              <td>20191225K</td>
              <td class="column">申请时间</td>
              <td colspan="2">2019-12-12  10:33:55</td>
            </tr>
          </table>
        </div>
        <div class="content_item content_item2">
          <p class="item_txt">No.2  检项（2/8）</p>
          <table  border='1' class="table_item2">
            <tr>
              <th>检项</th>
              <th>质量标准</th>
              <th>检验结果</th>
              <th>备注</th>
              <th>工时</th>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
        <div class="content_item content_item3">
          <p class="item_txt">No.3  检验方法</p>
          <table  border='1' class="table_item3">
            <tr class="left_item">
              <td colspan="2">
                <h4>干燥失重</h4>
                <p>（1）.取供试品，混合均匀，取约1g或规定重量，置于供试品图样条件下干燥至恒重的扁形称量瓶中，精密称定。</p>
              </td>
              <td colspan="2">
                <p>测试温度 ℃：</p>
                <p>供试品质量 g：</p>
                <p>称量瓶1#恒重g：</p>
                <p>称量瓶2#恒重g：</p>
                <p>干燥1#恒重g：</p>
                <p>干燥2#恒重g：</p>
                <p>计算1#结果：</p>
                <p>计算2#结果：</p>
                <p>平均值：</p>
              </td>
            </tr>
            <tr class="left_item">
              <td colspan="2">
                <h4>干燥失重</h4>
                <p>（1）.取供试品，混合均匀，取约1g或规定重量，置于供试品图样条件下干燥至恒重的扁形称量瓶中，精密称定。</p>
              </td>
              <td colspan="2">
                <p>测试温度 ℃：</p>
                <p>供试品质量 g：</p>
                <p>称量瓶1#恒重g：</p>
                <p>称量瓶2#恒重g：</p>
                <p>干燥1#恒重g：</p>
                <p>干燥2#恒重g：</p>
                <p>计算1#结果：</p>
                <p>计算2#结果：</p>
                <p>平均值：</p>
              </td>
            </tr>
            <tr class="left_item">
              <td colspan="2">
                <h4>干燥失重</h4>
                <p>（1）.取供试品，混合均匀，取约1g或规定重量，置于供试品图样条件下干燥至恒重的扁形称量瓶中，精密称定。</p>
              </td>
              <td colspan="2">
                <p>测试温度 ℃：</p>
                <p>供试品质量 g：</p>
                <p>称量瓶1#恒重g：</p>
                <p>称量瓶2#恒重g：</p>
                <p>干燥1#恒重g：</p>
                <p>干燥2#恒重g：</p>
                <p>计算1#结果：</p>
                <p>计算2#结果：</p>
                <p>平均值：</p>
              </td>
            </tr>
            <tr>
              <td class="column">检验人</td>
              <td></td>
              <td class="column">检验时间</td>
              <td></td>
            </tr>
            <tr>
              <td class="column">说明</td>
              <td colspan="3"></td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <p>打印人：李宏丽  2019-12-23 13:00:55</p>
      </div>
      <button @click="downLoadHtmlToPdf">pdf</button>
    </div>
  </div>

</template>

<script>
  import { downloadPDF } from '@/utils/htmlToPdf'
	export default {
		data(){
			return {
			}
		},
    updated(){

    },
    methods:{
      downLoadHtmlToPdf(){
        downloadPDF(document.querySelector('#recordCard'), 'test');
      },
    },
	}

</script>

<style lang="scss" scoped>
	.recordCard {
		width: 610px;
		margin: 20px auto;
		font-family: STHeiti;
		font-size: 18px;
		.header {
			height: 40px;
			margin: 0 auto;
			text-align: center;
			img {
				width: 75px;
			}
			span {
				letter-spacing: 2px;
				font-size: 28px;
				height: 40px;
				line-height: 40px;
			}
		}
		.container {
				margin-top: 20px;
			.content_item {
				margin-top: 20px;
				margin-bottom: 30px;
				.item_txt {
					margin: 0;
					margin-bottom: 6px;
				}
				table {
					empty-cells:show;
					border-collapse: collapse;
					margin:0 auto;
					font-size: 17px;
					width: 100%;
					border:1px solid #333;
					th {
						height:30px;
						line-height: 30px;
						padding:0 1em 0;
						text-align: center;
						font-weight: 400;
					}
				}
				&.content_item1 {
					.mainTable {
						table-layout:fixed;
						th {
							background-repeat:repeat-x;
						}
						td {
							height:30px;
							line-height: 30px;
							/*border:1px solid #333;*/
							padding:0 1em 0;
							text-align: center;
							font-weight: 400;
							overflow:hidden;
							text-overflow:ellipsis;
							white-space:nowrap;
							border-right: 0;
							border-bottom: 0;
						}
						tr.alter{
							background-color:#f5fafe;
						}
						.column {
							background: #eee;
							width: 120px;
						}
						.img_item {
							width: 110px;
							img {
								width: 100px;
							}
						}
					}
				}
				&.content_item2 {
					.table_item2 {
						table-layout:fixed;
						tr th {
							background: #eee;
							border-right: 0;
							border-bottom: 0;
						}
						td {
							height:30px;
							line-height: 30px;
							/*border:1px solid #333;*/
							padding:0 1em 0;
							text-align: center;
							font-weight: 400;
							overflow:hidden;
							text-overflow:ellipsis;
							white-space:nowrap;
							border-right: 0;
							border-bottom: 0;
						}
					}
				}
				&.content_item3 {
					.table_item3 {
						td {
							height:30px;
							line-height: 30px;
							/*border:1px solid #333;*/
							padding:0 1em 0;
							text-align: center;
							font-weight: 400;
							border-right: 0;
							border-bottom: 0;
						}
						.column {
							background: #eee;
							width: 120px;
						}
						.left_item {
							text-align: left;
							td {
								width: 400px;
							}
							h4 {
								margin: 0;
								text-align: left;
								font-weight: normal;
								position: relative;
								margin-left: 15px;
								&::before {
									content: ' ';
									width: 5px;
									height: 5px;
								    background: #505050;
								    position: absolute;
								    left: -10px;
								    top: 12px;
								}
							}
							p {
								margin: 0;
								text-align: left;
							}
						}
					}
				}
			}
		}
	}
</style>
