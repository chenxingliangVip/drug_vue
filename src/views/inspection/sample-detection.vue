<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin-left:20px">
      <div>
        <div class="filter-item">
          <span>检验单号<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.sampleCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="searchForm" />
        </div>

        <!--<div class="filter-item" v-show="tab == 'deptTask'">-->
          <!--<span>样品名称<i class="i_colon">:</i></span>-->
          <!--<el-input clearable  v-model="searchParam.materialName"-->
                    <!--size="mini"-->
                    <!--style="width: 100px;"-->
                    <!--@keyup.enter.native="searchForm" />-->
        <!--</div>-->
        <div class="filter-item" v-show="tab == 'deptTask'">
          <span>流程状态<i class="i_colon">:</i></span>
          <el-select v-model="searchParam.checkStatus"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in statusMap"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </div>

        <div class="filter-item">
          <span>送检时间<i class="i_colon">:</i></span>
          <el-date-picker v-model="searchParam.startTime"
                          size="mini"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          style="width: 140px;"></el-date-picker>
          <span>&nbsp;-</span>
          <el-date-picker v-model="searchParam.endTime"
                          size="mini"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          style="width: 140px;"></el-date-picker>
        </div>

        <div class="filter-item">
          <span>结果录入<i class="i_colon">:</i></span>
          <el-select v-model="searchParam.results"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in resultMap"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </div>
        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor:pointer;"
             @click="searchForm"></i>
        </div>
      </div>
    </div>
    <div class="tab-container" @click="inputJJ">
      <el-tabs style="margin-top:5px;"  @tab-click="handleClick"
               type="border-card">
        <el-tab-pane label="myTask" >
          <span slot="label">
            我的任务
            <el-badge :value="myTask.backCount" />
          </span>
          <div class="app-my-task-container">
            <el-row>
              <el-col :span="24"
                      style="padding-left:20px">
                <div style="margin-bottom: 5px">
                  <span class="svg-container">
                    <img src="../../assets/img/code.png" style="width: 17px">
                  </span>
                  <el-input clearable  placeholder="扫码输入检验单号" id="sampleCodeJJ"
                            style="width: 160px" autofocus v-model="sampleCode"
                            size="mini" />
                </div>
              </el-col>
            </el-row>
            <drug-table @emitSpanFun="emitSpanFun" @getBackData="getMyTaskList"  :backCount="myTask.backCount" :tableData="myTask.tableData" :tableLoading="myTask.tableLoading" :tableHeader="myTask.tableHeader" :option="myTask.option">

            </drug-table>

          </div>
        </el-tab-pane>
        <el-tab-pane label="takeTask">
          <span slot="label">
            待领任务
            <el-badge :value="takeTask.backCount" />
          </span>
          <drug-table    :tableData="takeTask.tableData" :tableLoading="takeTask.tableLoading" :tableHeader="takeTask.tableHeader" :option="takeTask.option">
            <template slot-scope="props" slot="operate">
              <div v-if="hasRole('sample:check:add')">
                <el-button
                           type="primary"
                           icon="el-icon-edit-outline"
                           size="mini"
                           @click="handleDetection(props.rowData)">领检</el-button>
              </div>
            </template>
          </drug-table>
        </el-tab-pane>
        <el-tab-pane label="deptTask" v-if="hasRole('sample:check:deptTask')">
          <span slot="label">
            部门任务
          </span>
         <dept-task></dept-task>
        </el-tab-pane>
      </el-tabs>
    </div>
    <take-task></take-task>
    <my-task></my-task>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { formatDate } from '@/utils/formatDate'
import { sortStr } from '@/utils/common'
import drugTable from "@/components/table/index";
import takeTask from "./dialog/takeTask"
import myTask from "./dialog/myTask"
import deptTask from "./deptTask"
import {getToken} from '@/utils/auth' // 验权

export default {
  name: '检效管理',
  components: { drugTable ,takeTask,myTask,deptTask},
  directives: { waves },

  data() {
    return {
      resultMap:[{label:"全部",value:""},{label:"已录入",value:"Y"},{label:"未录入",value:"N"}],
      searchParam:{
        sampleCode:"",
        materialName:"",
        startTime:"",
        endTime:"",
        resultId:"",
        results:"",
        checkStatus:"",
        // type:"",
        // testStaffId:""
      },

      statusMap:[
        {label:"检测中",value:"SA"},
        {label:"审核中",value:"WA"},
        {label:"驳回",value:"RJ"},
        {label:"完成",value:"AP"}
      ],

      sampleCode:"",
      showTip:"",
      firstExc:true,
      myTaskSearchList:[],
      myTask:{
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        count:0,
        backCount:0,
        readCount:0,
        option:{showOperate:false},
      },
      takeTask:{
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        count:0,
        backCount:0,
        option:{showOperate:true},
      },
      tab:"myTask"
    }
  },
  mounted() {
    let self = this;
    // self.initPickerTime();
    self.getMyTaskList();
    self.getTakeTaskList();
    self.getSearchSampleTask();
    self.inputJJ();
    self.$eventBus.$on("initPickerTime",function () {
      self.initPickerTime();
    });
    self.$eventBus.$on("updateDetectionList",function () {
      for(let key in self.searchParam){
        self.searchParam[key] = '';
      }
      self.getMyTaskList();
      self.getTakeTaskList();
      self.getSearchSampleTask();
    });
    self.$eventBus.$on("autoInputJJ",function () {
      self.inputJJ();
    })
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
    inputJJ(){
      let input=document.getElementById('sampleCodeJJ');
      input.focus();
    },
    handleClick(tab, event){
      this.tab = tab.label;
      if(tab.label == "deptTask"){
        this.initPickerTime();
      }else{
        this.searchParam.startTime = "";
        this.searchParam.endTime = "";
      }
    },
    handleDetection(rowData){
      let data  = Object.assign({},rowData);
      this.$eventBus.$emit("openTakeTaskDialog",data,"add");
    },
    searchForm(){
      if(this.tab == 'myTask'){
        this.getMyTaskList();
      }
      if(this.tab == 'takeTask'){
        this.getTakeTaskList();
      }
      if(this.tab == 'deptTask'){
        let searchParam = Object.assign({},this.searchParam);
        this.$eventBus.$emit("updateDeptTaskSampleItemList",searchParam);
      }
    },
    getMyTaskList(startIndex,pageRow) {
      let self = this;
      self.myTask.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      let start = typeof startIndex =="number"?startIndex:0;
      let total = typeof pageRow == "number"?pageRow:15;
      searchParam.startIndex = start;
      searchParam.totalPage = total;
      searchParam.notStatus = "AP";
      searchParam.userId =  self.$store.getters.userId;
      self.$http({
        url: "/drug/sampleItem/querySampleItemList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          for(let data of resp.result){
            data.itemCount = data.singleCount+"/"+data.totalCount;
          }
          self.myTask.tableLoading = false;
          self.myTask.tableData = resp.result;
          if(self.myTask.tableData.length > 0){
            self.myTask.backCount = self.myTask.tableData[0].count;
            self.myTask.readCount = self.myTask.tableData[0].readCount;
          }else{
            self.myTask.backCount = 0;
            self.myTask.readCount = 0;
          }
          self.myTask.tableHeader =  [
            {"columnName": "sampleId", "coloumNameCn": "检验单号"},
            {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
            {"columnName": "createTimeSecondFt", "coloumNameCn": "送检时间"},
            {"columnName": "materialCode", "coloumNameCn": "物料编码"},
            {"columnName": "materialName", "coloumNameCn": "样品名称"},
            {"columnName": "sampleNum", "coloumNameCn": "样品批号"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "location", "coloumNameCn": "地点"},
            {"columnName": "itemCount", "coloumNameCn": "检项数"},
            {"columnName": "resultIdCn", "coloumNameCn": "结果录入"},
            {"columnName": "updateTimeFt", "coloumNameCn": "录入时间"},
            {"columnName": "checkStatusCn", "coloumNameCn": "状态","isClick":true},];
          self.myTask.option.showOperate = false;
        }
      });
    },

    openMyTaskDialog(data){
      let row = Object.assign({},data);
      if(!row.filePathName){
        row.filePathName = "";
      }
      if(!row.resetPathName){
        row.resetPathName = "";
      }
      this.$eventBus.$emit("openMyTaskDialog",row,"edit");
    },

    getSearchSampleTask(){
      let self = this;
      self.$http({
        url: "/drug/sampleItem/querySampleWithEdit",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          self.myTaskSearchList = resp.result;
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

    getTakeTaskList(startIndex,pageRow) {
      let self = this;
      self.takeTask.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      // let start = typeof startIndex =="number"?startIndex:0;
      // let total = typeof pageRow == "number"?pageRow:15;
      // searchParam.startIndex = start;
      // searchParam.totalPage = total;
      let user = JSON.parse(getToken());
      searchParam.deptId = user.deptId;
      delete searchParam.userId;
      self.$http({
        url: "/drug/sampleItem/queryTakeSampleItemList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.takeTask.tableLoading = false;
          self.takeTask.tableData = resp.result;
          self.takeTask.backCount = self.takeTask.tableData.length;
          resp.result = sortStr(resp.result,"sampleId");
          for(let data of resp.result){
            data.itemCount = data.singleCount+"/"+data.totalCount;
          }
          self.takeTask.tableHeader =  [
            {"columnName": "sampleId", "coloumNameCn": "检验单号"},
            {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
            {"columnName": "createTimeSecondFt", "coloumNameCn": "送检时间"},
            {"columnName": "materialCode", "coloumNameCn": "物料编码"},
            {"columnName": "materialName", "coloumNameCn": "样品名称"},
            {"columnName": "sampleNum", "coloumNameCn": "样品批号"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "location", "coloumNameCn": "地点"},
            {"columnName": "itemCount", "coloumNameCn": "检项数"},
            {"columnName": "updateTimeFt", "coloumNameCn": "录入时间"},
            {"columnName": "checkStatusCn", "coloumNameCn": "状态"},];
          self.takeTask.option.showOperate = true;
        }
      });
    },
  },
  watch:{
    sampleCode(val){
      let self =this;
      if(!val){
        return;
      }
      setTimeout( function() {
        if(self.firstExc){
          self.firstExc = false;
          if(self.showTip){
            self.$notify({
              title: '提示',
              message: self.showTip,
              type: 'error'
            });
            self.sampleCode="";
          }
          setTimeout( function() {
            self.firstExc = true;
          }, 2000);
        }
      }, 1000);
      if(this.myTaskSearchList.length == 0){
        this.showTip = "操作无效！";
      }
      for(let data of this.myTaskSearchList){
        if(val == data.sampleId && (data.checkStatus =='SA'||data.checkStatus =='RJ')){
          self.openMyTaskDialog(data);
          self.showTip = "";
          self.sampleCode="";
          self.firstExc = true;
          break;
        }
        if(val == data.sampleId && data.checkStatus !='SA'){
          this.showTip = "操作无效！";
          break;
        }
        this.showTip = "编码出错啦！";
      }
    }
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
