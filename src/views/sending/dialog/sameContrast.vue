<template>
	<el-dialog title="同样对比"
             v-loading="dialogLoading"
             width="70%"
             append-to-body
             :close-on-click-modal="false"
             :visible.sync="dialogAddVisible"
             class="Input_Dialog">
		<el-form ref="dataForm" size="mini" label-width="80px">
			<div class="dialog-title"><span>同样对比</span></div>
			<el-divider></el-divider>
			<el-row>
				<el-col :span="8">
					<el-form-item label="物料编码：">
						<el-input disabled v-model="sampleData.materialCode" size="mini" style="width: 140px;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="日期：">
            <el-date-picker  v-model="sampleData.startTime"
                            size="mini"
                             disabled
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            style="width: 140px;">
            </el-date-picker>
            <span> - </span>
            <el-date-picker v-model="sampleData.endTime"
                            size="mini"
                            disabled
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            style="width: 140px;">
            </el-date-picker>
					</el-form-item>
				</el-col>
				<!--<el-col :span="4">-->
					<!--<el-button class="filter-btn-item same-contrast" size="mini" style="margin-left: 10px;width: 80px;float: right;"-->
		                   <!--type="primary" @click="getSampleItemList"> 同样对比-->
			        <!--</el-button>-->
				<!--</el-col>-->
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item label="物料名称：">
            <el-select v-model="sampleData.materialName"  @change="changeMaterial"
                       size="mini"
                       clearable
                       disabled
                       filterable
                       style="width: 140px">
              <el-option v-for="item in materials"
                         :key="item.id"
                         :label="item.materialName"
                         :value="item.materialName" />
            </el-select>

					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item label="检项：">
						<el-checkbox-group v-model="selectItems" @change="handleCheckedChange">
					    	<el-checkbox :label="item.itemName" v-for="(item,index) in items" :key="index" ></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
			</el-row>
      <div class="el-button-excel"  style="cursor: pointer;text-align: right" @click="downExcel" >
        <img
          src="../../../assets/img/Excel.png"
          class="svg-icon" style="cursor: pointer;width: 20px;height: 20px">
        <span style="margin-left: 5px;font-size: 12px;float: right;line-height: 20px;">导出</span>
      </div>
			<div class="tableList" >
				<p class="titleSpan"></p>
				<table border="1" class="tableMain">
					<tr>
					    <th>检项</th>
					    <th>质量标准</th>
					    <th v-for="(item,index) in tableHeader" :key="index">{{item}}</th>
					</tr>
					<tr v-for="(data,index) in tableData" :key="index">
              <td><p class="mainData" :title="data.itemName">{{data.itemName}}</p>
              <td><p class="mainData" :title="data.itemQualityStandard">{{data.itemQualityStandard}}</p>
					    <td  v-for="(key,index) in tableHeader" :key="index"><p class="mainData" :title="data[key]?data[key]['testResult']:'/'">{{data[key]?data[key]['testResult']:'/'}}</p></td>
					    <!--<td><p class="mainData" :title="item.sampleCode">{{item.sampleCode}}</p></td>-->
					    <!--<td><p class="mainData" :title="item.sampleNum">{{item.sampleNum}}</p></td>-->
					    <!--<td><p class="mainData" :title="item.materialType">{{item.materialType}}</p></td>-->
					    <!--<td><p class="mainData" :title="item.materialGrade">{{item.materialGrade}}</p></td>-->
					    <!--<td><p class="mainData" :title="item.sampleTypeName">{{item.sampleTypeName}}</p></td>-->
					    <!--<td><p class="mainData" :title="item.itemName">{{item.itemName}}</p></td>-->
					    <!--<td><p class="mainData" :title="item.itemQualityStandard">{{item.itemQualityStandard}}</p></td>-->
					    <!--<td><p class="mainData" :title="item.testResult">{{item.testResult}}</p></td>-->
					</tr>
				</table>
			</div>

      <!--<div v-show="Object.keys(tableMap).length == 0"  class="tableList" style="margin-top: 10px">-->
        <!--<table border="1" class="tableMain">-->
          <!--<tr>-->
            <!--<th>送检时间</th>-->
            <!--<th>检单号</th>-->
            <!--<th>样品批号</th>-->
            <!--<th>样品规格</th>-->
            <!--<th>样品等级</th>-->
            <!--<th>样品规模</th>-->
            <!--<th>检项名称</th>-->
            <!--<th>质量标准</th>-->
            <!--<th>检测结果</th>-->
          <!--</tr>-->
        <!--</table>-->
      <!--</div>-->
		</el-form>
    <form action="/drug/file/exportExcelData" method="post"
          style="display: none;" ref="downloadSameContrast">
      <input name="json"  :value="templateExcel.json"/>
      <input name="title" :value="templateExcel.title"/>
      <input name="name" :value="templateExcel.name"/>
      <input name="code" :value="templateExcel.code"/>
      <input name="time" :value="templateExcel.time"/>
    </form>
	</el-dialog>
</template>

<script>
	import drugTable from "@/components/table/index";
	export default {
		name: "sameContrast",
		components: {
			drugTable
		},
		data() {
			return {
				dialogAddVisible: false,
				dialogLoading: true,
        materials:[],
        sampleData:{materialName:"",materialCode:"",startTime:"",endTime:""},
        items:[],
        selectItems:[],
        tableHeader:[],
        tableData:[],
        tableLoading:true,
        tableMap:{},
        templateExcel: {json: "",title:"",name:"",code:"",time:""},
        selectChoice:[]
			}
		},
		methods: {

      downExcel(){
        let self = this;
        if(this.tableData.length == 0){
          let self = this;
          self.$notify({
            title: '提示',
            message: "无数据导出",
            type: 'warning'
          });
          return;
        }
        let tableHeader = [
          {"columnName": "itemName", "coloumNameCn": "检项"},
          {"columnName": "standard", "coloumNameCn": "质量标准"}];
        for(let data of this.tableHeader){
          let hd =  {"columnName": data, "coloumNameCn": data};
          tableHeader.push(hd);
        }
        let tableData = [];
        for(let cdata of this.tableData){
          let child = {itemName:cdata.itemName,standard:cdata.itemQualityStandard};
          for(let key of this.tableHeader){
            let value  = cdata[key]?cdata[key]['testResult']:'/';
            child[key] = value;
          }
          tableData.push(child);
        }
        let header = {tableHeader: tableHeader,tableData:tableData};
        self.templateExcel.title= this.sampleData.materialName+this.sampleData.materialCode;
        self.templateExcel.name = this.sampleData.materialName;
        self.templateExcel.code = this.sampleData.materialCode;
        self.templateExcel.time = this.sampleData.startTime+"/"+this.sampleData.endTime;
        this.templateExcel.json = JSON.stringify(header);
        self.$nextTick(() => {
          self.$refs.downloadSameContrast.submit();
        })
      },

      changeMaterial(val){
        let item = this.materials.find(item=>item.materialName==val);
        if(item){
          this.sampleData.materialCode = item.materialCode;
        }
      },

      getMaterials() {
        let self = this;
        self.$http({
          url: "/drug/material/queryAllMaterialsWithOperate",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.materials = resp.result;
          }
        });
      },
      handleCheckedChange(itemName,flag){
        this.handleTableResult();
        // let self = this;
        // let tableMap = {};
        // for(let data of self.selectItems){
        //   for(let item of self.items){
        //     if(item.itemName == data && (!flag || itemName ==item.itemName)){
        //       let key = item.itemName + item.samples.length;
        //       tableMap[key] = item;
        //     }
        //   }
        // }
        // self.tableMap = Object.assign({},tableMap);
      },

      handleTableResult(){
        let tableHeader = new Set();
        this.tableData = [];
        for(let item of this.items){
          if(this.selectItems.indexOf(item.itemName) > -1){
            let tableData = {};
            for(let sample of item.samples){
              tableHeader.add(sample.sampleCode);
              tableData[sample.sampleCode] = {testResult:sample.testResult};
              tableData["itemQualityStandard"] = sample.itemQualityStandard;
            }
            tableData["itemName"] = item.itemName;
            this.tableData.push(tableData);
          }
        }
        Array.from(tableHeader);
        this.tableHeader = tableHeader;
      },


      getSampleItemList(){
        let self = this;
        self.selectItems = [];
        self.items = [];
        self.tableMap = {};
        self.$http({
          url: "/drug/sample/querySampleByMaterialCode",
          method: "post",
          params:self.sampleData
        }).then(resp => {
          if (resp.success) {
            debugger
            let items = [];
            let repeat = [];
            for(let data of resp.result){
              if(!data.standardItems){
                continue;
              }
              if(self.selectChoice.indexOf(data.sampleCode) < 0){
                continue;
              }
              for(let c_data of data.standardItems){
                let cc_data = {};
                cc_data.itemName = c_data.itemName;
                cc_data.itemQualityStandard = c_data.itemQualityStandard;
                //修改检验单号为批号
                cc_data.sampleCode = data.sampleNum;
                cc_data.testResult = c_data.testResult;
                if(repeat.indexOf(c_data.itemName) < 0){
                  let item = {itemName:c_data.itemName,samples:[]};
                  item.samples.push(cc_data);
                  items.push(item);
                  repeat.push(c_data.itemName);
                }else{
                  let exist = items.find(ex=>ex.itemName == c_data.itemName);
                  exist.samples.push(cc_data)
                }
                // if(self.selectItems.length == 0){
                //   self.selectItems.push(c_data.itemName);
                // }
              }
            }
            self.items = items;
            // for(let data of items){
            //   self.selectItems.push(data.itemName);
            // }
            // if(self.selectItems.length > 0){
            //   self.handleCheckedChange(self.selectItems[0],true);
            // }
            self.handleTableResult();
            self.dialogLoading = false;
          }
        });
      }
		},
		mounted() {
      let self = this;
      self.getMaterials();
			self.$eventBus.$on("openSameContrast",function (val,searchTime,selectChoice) {
			    self.selectChoice = selectChoice;
          self.dialogAddVisible = true;
          self.dialogLoading = false;
          self.sampleData.materialName = val;
          self.changeMaterial(val);
          self.sampleData.startTime = searchTime.startTime;
          self.sampleData.endTime = searchTime.endTime;
          self.getSampleItemList();
		    })
		}
	}
</script>

<style lang="scss" scoped>
	.tableList {
		margin-bottom: 15px;
		overflow: auto;
		.titleSpan {
			color: #2e827f;
			margin-bottom: 5px;
			margin-top: 0px;
		}
		.tableMain {
			width: 100%;
			border-collapse: collapse;
            margin: 0 auto;
            text-align: center;
            white-space: nowrap;
            th,td {
            	border: 1px solid #cad9ea;
	            color: #666;
	            height: 30px;
	            font-size: 12px;
	            width: 10%;
            }
            th {
            	background-color: #2e827f;
            	color: #fff;
            }
            td {
            	.mainData {
            		text-align: center;
            		margin: 0 auto;
            		padding: 5px 0px;
            		overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
            		width: 85px;
            	}
            }
		}
	}
	.el-range-editor.el-input__inner {
		height: 20px;
		line-height: 20px;
	}

</style>
