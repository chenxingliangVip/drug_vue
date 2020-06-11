<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="flex-row-space-between">
        <div>
          <div class="filter-item el-radio-type"
               style="margin-left:20px;">
            <el-radio-group size="mini"
                            v-model="radio1">
              <el-radio-button label="1">
                <img src="../../../assets/img/dept.png" style="height: 15px;width:15px"  class="svg-icon">
                部门
              </el-radio-button>
              <el-radio-button label="2">
                <img src="../../../assets/img/person.png" class="svg-icon" style="height: 15px;width:15px">
                个人
              </el-radio-button>
            </el-radio-group>
          </div>
          <div v-if="radio1 == 1"
               class="filter-item">
            <!--<el-select v-model="searchParam.id"  @change="changeDept"-->
                       <!--size="mini"-->
                       <!--clearable-->
                       <!--style="width: 140px">-->
              <!--<el-option v-for="item in deptList"-->
                         <!--:key="item.id"-->
                         <!--:label="item.deptName"-->
                         <!--:value="item.id" />-->
            <!--</el-select>-->
          </div>
          <div v-else
               class="filter-item">
            <el-select v-model="searchParam.userId" @change="changePerson"
                       size="mini"
                       clearable
                       style="width: 140px">
              <el-option v-for="item in loginList"
                         :key="item.id"
                         :label="item.userName"
                         :value="item.id" />
            </el-select>
          </div>
          <div class="filter-item">
            <span>时间<i class="i_colon">:</i></span>
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
          <div class="filter-item filter-item-btn-search">
            <i class="el-icon-search" style="cursor: pointer"
               @click="handleFilter"></i>
          </div>
        </div>
        <div class="el-button-excel"  style="cursor: pointer" @click="downExcel" v-if="hasRole('hour:effiect:download')">

          <img
                src="../../../assets/img/Excel.png"
                class="svg-icon" style="cursor: pointer;width: 15px;height: 15px">
          <span style="margin-left: 5px;font-size: 12px">数据下载</span>
        </div>
      </div>
    </div>
    <div class="dialog-title"
         style="margin-top:10px"><span>威尔药业检验工时汇总表 · </span>
      <span v-if="radio1 == 1">部门</span>
      <span v-else>个人</span>
    </div>
    <div class="el-table-frame">
      <div v-show="radio1 == 1">
        <div class="flex-row-space-between"
             style="margin:15px 10px 5px 10px">
          <div class="el-grey-txt">部门：{{searchParam.deptName}} </div>
          <div class="el-grey-txt">起止时间：{{searchParam.startTime}} 至 {{searchParam.endTime}}</div>
        </div>
        <drug-table  :showSummary="true" :tableData="dept.tableData" :tableLoading="dept.tableLoading" :tableHeader="dept.tableHeader" ></drug-table>
      </div>
      <div v-show="radio1 == 2">
        <div class="flex-row-space-between"
             style="margin:15px 10px 5px 10px;justify-content:flex-start;">
          <div class="el-grey-txt">用户：{{searchParam.userName}} </div>

          <div class="el-grey-txt"
               style="margin-left:30px;">{{searchParam.startTime}} 至 {{searchParam.endTime}}</div>
        </div>
        <drug-table :showSummary="true"  :tableData="person.tableData" :tableLoading="person.tableLoading" :tableHeader="person.tableHeader" ></drug-table>
      </div>
    </div>

    <form action="/drug/file/exportExcelData" method="post"
          style="display: none;" ref="downloadTemplate">
      <input name="json"  :value="templateExcel.json"/>
      <input name="title" :value="templateExcel.title"/>
    </form>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { parseTime } from '@/utils'
import drugTable from "@/components/table/index";
import {getToken} from '@/utils/auth' // 验权
import { formatDate } from '@/utils/formatDate'
export default {
  name: '样品检验',
  components: {drugTable},
  directives: { waves },
  data() {
    return {
      dept:{
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        option:{showOperate:true}
      },
      deptList:[],
      loginList:[],
      person:{
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        option:{showOperate:true}
      },
      user:{},

      templateExcel: {json: "",title:""},


      //----
      radio1: 1,
      searchParam: {
        deptId:"",
        deptName:"",
        userId:"",
        userName:"",
        startTime:"",
        endTime:""
      },

    }
  },
  mounted() {
    let day =  formatDate(new Date(), "yyyy-MM");
    let startTime = day+"-01";
    let endTime = day+"-30";
    let user = JSON.parse(getToken());
    this.user = user;
    this.searchParam = {
      id:user.deptId,
      userId:"",
      deptName:"所有部门",
      userName:user.userName,
      startTime:startTime,
      endTime:endTime
    };
    this.getDeptList();
    this.getPersonList();
    // this.getChooseDeptList();
    this.getAllLogin();
  },
  methods: {

    changeDept(){
      for(let data of this.deptList){
        if(data.id == this.searchParam.id){
          this.searchParam.deptName = data.deptName;
          break;
        }
      }
    },

    changePerson(){
      for(let data of this.loginList){
        if(data.id == this.searchParam.userId){
          this.searchParam.userName = data.userName;
          break;
        }
      }
    },
    getAllLogin(){
      let self = this;
      self.$http({
        url: "/drug/queryAllLoginList",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          self.loginList = resp.result;
        }
      });
    },

    getChooseDeptList() {
      let self = this;
      self.$http({
        url: "/drug/dept/queryDeptChooseList",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          if(resp.result.length > 0){
            self.deptList = resp.result;
          }
        }
      });
    },

    downExcel(){
      let self = this;
      let header = {};
      let total = 0.0;
      if(self.radio1 == 1){
        let totalRow = {level:"合计",manHour:""};
        for(let data of self.dept.tableData){
          total += parseFloat(data.manHour);
        }
        totalRow.manHour = total.toFixed(2);
        let tableData = JSON.parse(JSON.stringify(self.dept.tableData));
        tableData.push(totalRow);
        header = {tableHeader: self.dept.tableHeader,tableData:tableData};
      }else{
        let totalRow = {createTimeFt:"合计",manHour:""};
        for(let data of self.person.tableData){
          total += parseFloat(data.manHour);
        }
        totalRow.manHour = total.toFixed(2);
        let tableData = JSON.parse(JSON.stringify(self.person.tableData));
        tableData.push(totalRow);
        header = {tableHeader: self.person.tableHeader,tableData:tableData};
      }
      let day =  formatDate(new Date(), "yyyyMMdd");
      self.templateExcel.title= day+self.$store.getters.userName+"工时汇总表";
      this.templateExcel.json = JSON.stringify(header);
      self.$nextTick(() => {
        self.$refs.downloadTemplate.submit();
      })
    },

    getDeptList() {
      let self = this;
      self.dept.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      self.$http({
        url: "/drug/check/queryDeptCheckList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.dept.tableLoading = false;
          self.dept.tableData = resp.result;
          self.dept.tableHeader =  [
            {"columnName": "level", "coloumNameCn": "名次"},
            {"columnName": "deptName", "coloumNameCn": "组别"},
            {"columnName": "manHour", "coloumNameCn": "工时"}];
        }
      });
    },
    getPersonList() {
      let self = this;
      self.person.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      self.$http({
        url: "/drug/check/queryPersonCheckList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.person.tableLoading = false;
          self.person.tableData = resp.result;
          self.person.tableHeader =  [
            {"columnName": "userName", "coloumNameCn": "姓名"},
            {"columnName": "createTimeFt", "coloumNameCn": "时间"},
            {"columnName": "sampleCode", "coloumNameCn": "检验号"},
            // {"columnName": "materialTypeName", "coloumNameCn": "样品属性"},
            // {"columnName": "materialName", "coloumNameCn": "样品名称"},
            // {"columnName": "itemName", "coloumNameCn": "检项"},
            {"columnName": "manHour", "coloumNameCn": "工时"}];
        }
      });
    },

    handleFilter(){
      if(this.radio1 == 1){
        this.getDeptList();
      }else{
        this.getPersonList();
      }
    }
  }
}
</script>

<style lang="scss" >
.el-radio-type {
  .el-radio-button__inner {
    border: 0px;
    background-color: #c0bebe;
    fill: #fff;
    color: #fff;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 0px 15px;
    font-size: 12px;
  }
}
.el-button-excel {
  .el-button--text {
    color: #2995d4;
  }
}
</style>

<style lang="scss" scoped>
.el-table-frame {
  margin: 0 20px 20px 20px;
}
.svg-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-bottom: 2px;
}
.el-button-excel {
  .el-button {
    padding: 0 20px;
  }
  .svg-icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}
</style>
