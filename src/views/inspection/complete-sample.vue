<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <div class="filter-item">
          <span>检验单号<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.sampleCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>样品名称<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.materialName"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>物料编号<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.materialCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>申请人<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.userName"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>送检时间<i class="i_colon">:</i></span>
          <el-date-picker v-model="searchParam.startTime"
                          size="mini"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          type="date"
                          style="width: 140px;">
          </el-date-picker>
          <span> - </span>
          <el-date-picker v-model="searchParam.endTime"
                          size="mini"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          type="date"
                          style="width: 140px;">
          </el-date-picker>
        </div>
        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor:pointer;"
             @click="getList">
          </i></div>
      </div>
      <div v-if="hasRole('complete:check:contrast')">
          <el-button class="filter-btn-item same-contrast"
              size="mini"
              style="margin-left: 10px;width: 80px;float: right;"
              type="green"
              @click="sameContrast">
             同样对比
          </el-button>
      </div>
    </div>
    <drug-table @getSelection="getSelection"  :isMultipleSelection="true" :backCount="backCount"  @getBackData="getList" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
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
import { parseTime } from '@/utils'
import drugTable from "@/components/table/index";
import takeTask from "./dialog/takeTask"
import myTask from "./dialog/myTask"
import {getToken} from '@/utils/auth' // 验权
import sameContrast from "../sending/dialog/sameContrast"
export default {
  name: '已检查询',
  components: { drugTable ,takeTask,myTask,sameContrast},
  directives: { waves },

  data() {
    return {
      searchParam:{
        sampleCode:"",
        materialCode:"",
        userName:"",
        materialName:"",
        startTime:"",
        endTime:"",
        resultId:"",
      },
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      count:0,
      backCount:0,
      option:{showOperate:false},
      selectChoice:[],
    }
  },
  mounted() {
    let self = this;
    self.getList();
  },
  methods: {
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
    },

    getSelection(val){
      this.selectChoice = val;
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
      searchParam.status = "AP";
      searchParam.userId =  self.$store.getters.userId;
      self.$http({
        url: "/drug/sampleItem/queryCompleteSampleItemList",
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
            self.readCount = self.tableData[0].readCount;
          }else{
            self.backCount = 0;
          }
          self.tableHeader =  [
            {"columnName": "sampleId", "coloumNameCn": "检验单号"},
            {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
            {"columnName": "createTimeFt", "coloumNameCn": "送检时间"},
            {"columnName": "materialCode", "coloumNameCn": "物料编码"},
            {"columnName": "materialName", "coloumNameCn": "样品名称"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "location", "coloumNameCn": "地点"},
            {"columnName": "itemCount", "coloumNameCn": "检项数"},
            {"columnName": "resultIdCn", "coloumNameCn": "结果录入"},
            {"columnName": "updateTimeFt", "coloumNameCn": "录入时间"}];
          self.option.showOperate = true;
        }
      });
    },

    openMyTaskDialog(data){
      let row = Object.assign({},data);
      this.$eventBus.$emit("openMyTaskDialog",row,"see");
    },

  },
  watch:{

  }
}
</script>

<style lang="scss" >
.el-div-review {
  .el-table .el-table__header th {
    background-color: #c55a0e;
  }
}

.el-dialog {
  .el-table .el-input__inner {
    border: 0px;
    background-color: transparent;
  }
}
</style>

<style lang="scss" scoped>
.app-container {
  padding: 20px 0;
}

.svg-container {
  color: #d81a06;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.el-dialog .dialog-footer .el-button--primary {
  background-color: #2e827f;
  border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
}
</style>
