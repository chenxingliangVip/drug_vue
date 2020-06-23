<template>
  <div class="app-container">
    <div>
      <el-button class="filter-btn-item same-contrast" v-if="hasRole('sample:check:contrast')"
                 size="mini"
                 style="width: 73px;height: 31px;float: right; margin-top: -28px;float: right;"
                 type="green"
                 @click="sameContrast">
        同样对比
      </el-button>
    </div>
    <drug-table  @getSelection="getSelection"  :isMultipleSelection="true":backCount="backCount" @emitSpanFun="emitSpanFun"  @getBackData="getList" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <label @click="openMyTaskDialog(props.rowData)"
                 class="table-view">
            查看
          </label>
        </div>
      </template>
    </drug-table>
    <my-task></my-task>
    <same-contrast></same-contrast>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { formatDate } from '@/utils/formatDate'
import drugTable from "@/components/table/index";
import {getToken} from '@/utils/auth' // 验权
import myTask from "./dialog/myTask-Dept.vue"
import sameContrast from "../sending/dialog/sameContrast"
export default {
  name: '送检',
  components: { drugTable,myTask,sameContrast},
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:false},
      searchParam: {
        sampleCode:"",
        userId:"",
        startTime:"",
        endTime:"",
      },
      loginList:[],
      selectChoice:[],
      backCount:0,
    }
  },
  mounted() {
    let self = this;
    self.$eventBus.$on("updateDeptTaskSampleItemList",function (searchParam) {
         self.searchParam = searchParam;
         self.getList(0,20);
    });
    self.initPickerTime();
    self.getList(0,20);
    // self.getAllLogin();
  },
  methods: {
    initPickerTime(){
      let year = formatDate(new Date(), "yyyy");
      let mouth = formatDate(new Date(), "MM");
      let day = new Date(parseInt(year),parseInt(mouth),0).getDate();
      day = day > 10 ?(day+""):("0"+day);
      this.searchParam.startTime = year+"-"+mouth+"-01";
      this.searchParam.endTime = year+"-"+mouth +"-" +day;
    },
    getSelection(val){
      this.selectChoice = val;
    },
    openMyTaskDialog(data){
      let row = Object.assign({},data);
      this.$eventBus.$emit("openMyDeptTaskDialog",row,"see",data.testStaffId);
    },
    getAllLogin() {
      let self = this;
      self.$http({
        url: "/drug/queryAllLoginList",
        method: "post"
      }).then(resp => {
        if (resp.success) {
          self.loginList = resp.result;
        }
      });
    },
    getList(startIndex,pageRow) {
      let self = this;
      self.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      let start = typeof startIndex =="number"?startIndex:0;
      let total = typeof pageRow == "number"?pageRow:15;
      searchParam.startIndex = start;
      searchParam.totalPage = total;
      let user = JSON.parse(getToken());
      searchParam.deptId = user.deptId;
      self.$http({
        url: "/drug/sampleItem/querySampleItemDeptTaskList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          for(let data of resp.result){
            data.itemCount = data.singleCount+"/"+data.totalCount;
          }
          self.tableLoading = false;
          self.tableData = resp.result;
          if(self.tableData.length > 0){
            self.backCount = self.tableData[0].count;
          }else{
            self.backCount = 0;
          }
          self.tableHeader =  [
            {"columnName": "sampleId", "coloumNameCn": "检验单号"},
            {"columnName": "materialName", "coloumNameCn": "样品名称"},
            {"columnName": "sampleNum", "coloumNameCn": "样品批号"},
            {"columnName": "userName", "coloumNameCn": "领检人","width":"70px"},
            {"columnName": "createTimeFt", "coloumNameCn": "领检时间"},
            {"columnName": "materialCode", "coloumNameCn": "物料编码"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "location", "coloumNameCn": "地点"},
            {"columnName": "itemCount", "coloumNameCn": "检项数"},
            {"columnName": "resultIdCn", "coloumNameCn": "结果录入"},
            {"columnName": "updateTimeFt", "coloumNameCn": "录入时间"},
            {"columnName": "checkStatusCn", "coloumNameCn": "状态","isClick":true},];
          self.option.showOperate = true;
        }
      });
    },
    emitSpanFun(row){
      let self = this;
      self.$http({
        url: "/drug/fmApprove/queryFmApproveByRelateId",
        method: "post",
        params:{relateId:row.sId}
      }).then(resp => {
        if (resp.success) {
          this.$alert(resp.result.content, '审核意见');
        }
      });
    },

    sameContrast(){
      let choiceIds = [];
      if(this.selectChoice.length == 0){
        this.$notify({
          title: '提示',
          message: "请选择对比项！",
          type: 'warning'
        });
        return;
      }
      if(this.selectChoice.length == 1){
        this.$notify({
          title: '提示',
          message: "请至少选择两项对比！",
          type: 'warning'
        });
        return;
      }
      let materialName = "";
      for(let data of this.selectChoice){
        if(!materialName){
          materialName = data.materialName;
        }
        if(materialName != data.materialName){
          this.$notify({
            title: '提示',
            message: "请选择相同样品名称对比！",
            type: 'warning'
          });
          return;
        }
        choiceIds.push(data.sampleId);
      }
      this.$eventBus.$emit("openSameContrast",materialName,this.searchParam,choiceIds);
    }
  },
}
</script>


<style lang="scss" scoped>
.el-form-no {
  text-align: right;
  font-size: 18px;
  color: #cb0000;
}

.el-dialog .el-button--primary {
  background-color: #2e827f;
  border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
}
.same-contrast {
	background: #2e827f;
	&:hover {
		opacity: .8;
	}
}

</style>
