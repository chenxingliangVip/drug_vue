<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container-item">
        <div class="filter-item">
          <span>名称<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.name"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="handleFilter" />
        </div>
        <div class="filter-item">
          <span>审核状态<i class="i_colon">:</i></span>
          <el-select v-model="searchParam.checkStatus"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in stateOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </div>
        <div class="filter-item">
          <span>时间<i class="i_colon">:</i></span>
          <el-date-picker v-model="searchParam.startTime"
                          size="mini"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          type="date"
                          style="width: 140px;"></el-date-picker>
          <span>&nbsp;-</span>
          <el-date-picker v-model="searchParam.endTime"
                          size="mini"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          style="width: 140px;"></el-date-picker>
        </div>
        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor:pointer;"
             @click="handleFilter"></i>
        </div>
      </div>
    </div>
    <div class="tab-container">
      <el-tabs style="margin-top:5px;" @tab-click="handleClick"  v-model="activeName"
               type="border-card">
        <el-tab-pane label="检验报告" v-if="hasRole('report:approve')" name="sample">
           <span slot="label">
              检验报告
              <el-badge :value="countMap.sample" />
           </span>
          <sample-approve></sample-approve>
        </el-tab-pane>

        <el-tab-pane label="物料编码" v-if="hasRole('material:approve')" name="material">
            <span slot="label">
             物料编码
             <el-badge :value="countMap.material" />
           </span>
          <material-approve></material-approve>
        </el-tab-pane>
        <el-tab-pane label="检验方法"  v-if="hasRole('method:approve')" name="method">
            <span slot="label">
                检验方法
             <el-badge :value="countMap.method" />
           </span>
          <test-method-approve></test-method-approve>
        </el-tab-pane>
        <el-tab-pane label="质量标准" v-if="hasRole('standard:approve')" name="standard">
              <span slot="label">
                质量标准
             <el-badge :value="countMap.standard" />
           </span>
          <material-standard-approve></material-standard-approve>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { parseTime } from '@/utils'
import drugTable from "@/components/table/index";
import sampleApprove from "./sampleApprove"
import materialApprove from "./materialApprove"
import testMethodApprove from "./testMethodApprove"
import materialStandardApprove from "./materialStandardApprove"

export default {
  name: '样品检验',
  components: { drugTable,sampleApprove,materialApprove,testMethodApprove ,materialStandardApprove},
  directives: { waves },
  data() {
    return {
      count:0,
      activeName:"sample",
      searchParam:{
        name:"",
        checkStatus:"",
        startTime:"",
        endTime:""
      },
      countMap:{sample:0,material:0,method:0,standard:0},
      stateOptions:[{label:"审核中",value:"2"},{label:"驳回",value:"4"},{label:"完成",value:"5"}]
    }
  },
  mounted(){
    let self =this;
    self.$eventBus.$on("updateApproveCount",function (type,count) {
        self.countMap[type] = count;
    })
  },
  methods: {
    handleClick(){

    },
    handleFilter(){
      let self = this;
      if(self.searchParam.name){
        self.searchParam.name = self.searchParam.name.trim();
      }
      if(self.activeName == 'sample'){
        self.$eventBus.$emit("updateSampleApprove",self.searchParam);
      }else if(self.activeName == 'material'){
        self.$eventBus.$emit("updateMaterialApprove",self.searchParam);
      }else if(self.activeName == 'method'){
        self.$eventBus.$emit("updateTestMethodApprove",self.searchParam);
      }else if(self.activeName == 'standard'){
        self.$eventBus.$emit("updateMaterialStandardApprove",self.searchParam);
      }
    }
  }
}
</script>

<style lang="scss" >
.el-div-version {
  .el-table {
    .el-table__header th {
      background-color: #d8dad7;
      color: #7e7f7d;
    }
  }
}
</style>

<style lang="scss" scoped>
.app-container {
  padding: 20px 0;
}

.el-input-scan {
  font-size: 13px;
  color: #d81a06;
}

.svg-container {
  padding: 6px 0px 6px 15px;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.svg-pending {
  width: 50px;
  height: 50px;
  fill: currentColor;
  overflow: hidden;
  float: right;
  margin-top: -20px;
  transform: rotate(15deg);
}

.el-col-frame {
  border: 1px solid #dcdfe6;
  width: 100%;
  legend {
    background: #fff;
    margin-left: -9px;
    writing-mode: tb-rl;
    color: #878989;
    padding: 10px 0;
  }
}

.el-dialog .el-button--primary {
  background-color: #2e827f;
  border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
}

.el-button .svg-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-bottom: 2px;
}
</style>
