<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <div class="filter-item el-radio-type"
             style="margin-left:20px;">
          <el-radio-group size="mini"
                          v-model="radio1">
            <el-radio-button label="1">
              <img src="../../../assets/img/dept.png" style="vertical-align: sub;height: 15px;width:15px"  class="svg-icon">
              部门
            </el-radio-button>
            <el-radio-button label="2">
              <img src="../../../assets/img/person.png" class="svg-icon" style="vertical-align: sub;height: 15px;width:15px">
              个人
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-item">
          <span>时间:</span>
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
    </div>
    <div class="el-table-frame">
      <div v-show="radio1 == 1">
        <drug-table :tableData="dept.tableData"
                    :tableLoading="dept.tableLoading"
                    :tableHeader="dept.tableHeader" ></drug-table>
      </div>
      <div v-show="radio1 == 2">
        <drug-table :tableData="person.tableData"
                    :tableLoading="person.tableLoading"
                    :tableHeader="person.tableHeader" ></drug-table>
      </div>
    </div>

  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import drugTable from "@/components/table/index";
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
      person:{
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        option:{showOperate:true}
      },

      radio1:1,
      searchParam: {
        startTime:"",
        endTime:""
      }
    }
  },
  mounted() {
    let day =  formatDate(new Date(), "yyyy");
    let startTime = day+"-01"+"-01";
    let endTime = day+"-12"+"-31";
    this.searchParam = {
      startTime:startTime,
      endTime:endTime
    };
    this.getDeptList();
    this.getPersonList();
  },
  methods: {
    getDeptList() {
      let self = this;
      self.dept.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      self.$http({
        url: "/drug/check/queryDeptEfficiencyList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.dept.tableLoading = false;
          self.dept.tableData = resp.result;
          self.dept.tableHeader =  [
            {"columnName": "deptName", "coloumNameCn": "组别"},
            {"columnName": "personCount", "coloumNameCn": "人数"},
            {"columnName": "sampleCount", "coloumNameCn": "检样数"},
            {"columnName": "sampleItemCount", "coloumNameCn": "检项数"},
            {"columnName": "delayCount", "coloumNameCn": "延时数"},
            {"columnName": "effect", "coloumNameCn": "及时率"},
           ];
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
        url: "/drug/check/queryPersonEfficiencyList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.person.tableLoading = false;
          self.person.tableData = resp.result;
          self.person.tableHeader =  [
            {"columnName": "userName", "coloumNameCn": "人名"},
            {"columnName": "sampleCount", "coloumNameCn": "检样数"},
            {"columnName": "sampleItemCount", "coloumNameCn": "检项数"},
            {"columnName": "delayCount", "coloumNameCn": "延时数"},
            {"columnName": "effect", "coloumNameCn": "及时率"}]
        }
      });
    },

    handleFilter(){
      if(this.radio1 == 1){
        this.getDeptList();
      }else{
        this.getPersonList();
      }
    },
  }
}
</script>

<style lang="scss" >
.el-radio-timely-type {
  .el-radio-button__inner {
    border: 0px;
    background-color: #c0bebe;
    fill: #fff;
    color: #fff;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 4px;
  }
  .el-radio-button--mini .el-radio-button__inner {
    border-radius: 4px;
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
</style>
