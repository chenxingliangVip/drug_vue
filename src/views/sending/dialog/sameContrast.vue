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
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            style="width: 140px;">
            </el-date-picker>
            <span> - </span>
            <el-date-picker v-model="sampleData.endTime"
                            size="mini"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            style="width: 140px;">
            </el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-button class="filter-btn-item same-contrast" size="mini" style="margin-left: 10px;width: 80px;float: right;"
		                   type="primary" @click="getSampleItemList"> 同样对比
			        </el-button>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item label="物料名称：">
            <el-select v-model="sampleData.materialName"  @change="changeMaterial"
                       size="mini"
                       clearable
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

			<!--<div class="tableList" v-for="(value, key) in tableMap" :key="key">
				<p class="titleSpan">{{key}}</p>
				<drug-table  :filterPage="false" :isMultipleSelection="true"
					:tableData="value.samples" :tableLoading="value.loading" :tableHeader="tableHeader">
				</drug-table>
			</div>-->

			<div class="tableList" v-for="(value,key) in tableMap" :key="key">
				<p class="titleSpan">{{key}}</p>
				<table border="1" class="tableMain">
					<tr>
					    <th>送检时间</th>
					    <th>检单号</th>
					    <th>样品批号</th>
					    <th>样品规格</th>
					    <th>样品等级</th>
					    <th>样品规模</th>
					    <th>检项名称</th>
					    <th>质量标准</th>
					    <th>检测结果</th>
					</tr>
					<tr v-for="(item,index) in value.samples" :key="index">
					    <td><p class="mainData" :title="item.createTimeFt">{{item.createTimeFt}}</p></td>
					    <td><p class="mainData" :title="item.sampleCode">{{item.sampleCode}}</p></td>
					    <td><p class="mainData" :title="item.sampleNum">{{item.sampleNum}}</p></td>
					    <td><p class="mainData" :title="item.materialType">{{item.materialType}}</p></td>
					    <td><p class="mainData" :title="item.materialGrade">{{item.materialGrade}}</p></td>
					    <td><p class="mainData" :title="item.sampleTypeName">{{item.sampleTypeName}}</p></td>
					    <td><p class="mainData" :title="item.itemName">{{item.itemName}}</p></td>
					    <td><p class="mainData" :title="item.itemQualityStandard">{{item.itemQualityStandard}}</p></td>
					    <td><p class="mainData" :title="item.testResult">{{item.testResult}}</p></td>
					</tr>
				</table>
			</div>

		</el-form>
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
        tableLoading:true,
        tableMap:{},
			}
		},
		methods: {

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
        let self = this;
        let tableMap = {};
        for(let data of self.selectItems){
          for(let item of self.items){
            if(item.itemName == data && (!flag || itemName ==item.itemName)){
              let key = item.itemName + item.samples.length;
              tableMap[key] = item;
            }
          }
        }
        self.tableMap = Object.assign({},tableMap);
      },

      getTableHeader(){
        this.tableHeader =  [
          {"columnName": "sampleCode", "coloumNameCn": "检单号"},
          {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
          {"columnName": "createTimeFt", "coloumNameCn": "送检时间"},
          {"columnName": "materialName", "coloumNameCn": "样品名称"},
          {"columnName": "sampleNum", "coloumNameCn": "样品批号"},
          {"columnName": "materialType", "coloumNameCn": "样品规格"},
          {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
          {"columnName": "sampleTypeName", "coloumNameCn": "样品规模"},
          {"columnName": "locationName", "coloumNameCn": "送样地点"},
          {"columnName": "checkStatusCn", "coloumNameCn": "流程状态"}];
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
            let items = [];
            let repeat = [];
            for(let data of resp.result){
              if(!data.standardItems){
                continue;
              }
              for(let c_data of data.standardItems){
                if(repeat.indexOf(c_data.itemName) < 0){
                  let item = {itemId:c_data.itemId,itemName:c_data.itemName,samples:[],loading:true};
                  data.itemName = c_data.itemName;
                  data.itemQualityStandard = c_data.itemQualityStandard;
                  data.testResult = c_data.testResult;
                  item.samples.push(data);
                  items.push(item);
                  repeat.push(c_data.itemName);
                }else{
                  let exist = items.find(ex=>ex.itemName == c_data.itemName);
                  exist.samples.push(data)
                }
                if(self.selectItems.length == 0){
                  self.selectItems.push(c_data.itemName);
                }
              }
            }
            self.items = items;
            if(self.selectItems.length > 0){
              self.handleCheckedChange(self.selectItems[0],true);
            }
            self.dialogLoading = false;
          }
        });
      }
		},
		mounted() {
      let self = this;
      self.getMaterials();
			self.$eventBus.$on("openSameContrast",function (materialName) {
          self.dialogAddVisible = true;
          self.dialogLoading = true;
          self.sampleData.materialName = materialName;
          self.sampleData.startTime = "";
          self.sampleData.endTime = "";
          self.changeMaterial(materialName);
          // self.getTableHeader();
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
