<template>
	<el-dialog title="同样对比" width="50%" append-to-body :close-on-click-modal="false" :visible.sync="dialogAddVisible" class="Input_Dialog">
		<el-form ref="dataForm" size="mini" label-width="80px">
			<div class="dialog-title"><span>同样对比</span></div>
			<el-divider></el-divider>
			
			<el-row>
				<el-col :span="8">
					<el-form-item label="物料编码：">
						<el-input clearable v-model="formData.contrastData1" size="mini" style="width: 100px;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="日期：">
						<el-date-picker class="sameData" v-model="formData.contrastData2" size="mini" type="daterange" style="width: 200px;"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-button class="filter-btn-item same-contrast" size="mini" style="margin-left: 10px;width: 80px;float: right;"
		                   type="primary"> 同样对比
			        </el-button>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item label="物料名称：">
						<el-input clearable v-model="formData.contrastData3" size="mini" style="width: 100px;"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item label="检项：">
						<el-checkbox-group v-model="formData.contrastData4">
					    	<el-checkbox label="羟值"></el-checkbox>
						    <el-checkbox label="水分"></el-checkbox>
						    <el-checkbox label="熔点"></el-checkbox>
						    <el-checkbox label="碘值"></el-checkbox>
						    <el-checkbox label="皂化值"></el-checkbox>
						    <el-checkbox label="酸性"></el-checkbox>
						    <el-checkbox label="结晶点"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
			</el-row>
			
			<div class="tableList">
				<p class="titleSpan">羟值： 1</p>
				<drug-table :filterPage="false" :isMultipleSelection="true" 
					:tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader">
				</drug-table>
			</div>
			
			<div class="tableList">
				<p class="titleSpan">水分： 1</p>
				<drug-table :filterPage="false" :isMultipleSelection="true" 
					:tableData="tableData2" :tableLoading="tableLoading2" :tableHeader="tableHeader2">
				</drug-table>
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
				formData: {
					contrastData1: '',
					contrastData2: '',
					contrastData3: '',
					contrastData4: [],
				},
				tableData: [],
		        tableHeader:[],
		        tableLoading:true,
		        tableData2: [],
		        tableHeader2:[],
		        tableLoading2:true,
			}
		},
		methods: {
			getTableData(){
		        let self = this; 
		        setTimeout(() => {
			        self.tableLoading = false
			        self.tableData = [{
	            		tableData1: '2019/12/12',
	            		tableData2: 'T201900121',
	            		tableData3: '20191225K',
	            		tableData4: '成品',
	            		tableData5: '注射级',
	            		tableData6: '小试',
	            		tableData7: '羟值',
	            		tableData8: '11',
	            		tableData9: '12',
	            	}];
	            	self.tableHeader =  [
		              	{"columnName": "tableData1", "coloumNameCn": "检验日期"},
		              	{"columnName": "tableData2", "coloumNameCn": "检验号"},
		              	{"columnName": "tableData3", "coloumNameCn": "批次号"},
		              	{"columnName": "tableData4", "coloumNameCn": "样品规格"},
		              	{"columnName": "tableData5", "coloumNameCn": "样品等级"},
		              	{"columnName": "tableData6", "coloumNameCn": "样品规模"},
		              	{"columnName": "tableData7", "coloumNameCn": "检项名称"},
		              	{"columnName": "tableData8", "coloumNameCn": "质量标准"},
		              	{"columnName": "tableData9", "coloumNameCn": "检测结果"},
		            ];
			    }, 500)
		    },
		    getTableData2(){
		        let self = this; 
		        setTimeout(() => {
			        self.tableLoading2 = false
			        self.tableData2 = [{
	            		tableData1: '2019/12/12',
	            		tableData2: 'T201900121',
	            		tableData3: '20191225K',
	            		tableData4: '成品',
	            		tableData5: '注射级',
	            		tableData6: '小试',
	            		tableData7: '水分',
	            		tableData8: '11',
	            		tableData9: '12',
	            	}];
	            	self.tableHeader2 =  [
		              	{"columnName": "tableData1", "coloumNameCn": "检验日期"},
		              	{"columnName": "tableData2", "coloumNameCn": "检验号"},
		              	{"columnName": "tableData3", "coloumNameCn": "批次号"},
		              	{"columnName": "tableData4", "coloumNameCn": "样品规格"},
		              	{"columnName": "tableData5", "coloumNameCn": "样品等级"},
		              	{"columnName": "tableData6", "coloumNameCn": "样品规模"},
		              	{"columnName": "tableData7", "coloumNameCn": "检项名称"},
		              	{"columnName": "tableData8", "coloumNameCn": "质量标准"},
		              	{"columnName": "tableData9", "coloumNameCn": "检测结果"},
		            ];
			    }, 500)
		    },
		},
		mounted() {
      		let self = this;
			self.$eventBus.$on("openSameContrast",function () {
		        self.dialogAddVisible = true;
				self.getTableData()
				self.getTableData2()
		    })
		}
	}
</script>

<style lang="scss" scoped>
	.tableList {
		margin-bottom: 15px;
		.titleSpan {
			color: #2e827f;
			margin-bottom: 5px;
			margin-top: 0px;
		}
	}
	.el-range-editor.el-input__inner {
		height: 20px;
		line-height: 20px;
	}
	
</style>