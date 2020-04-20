<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="flex-row-space-between">
        <div>
          <div class="filter-item">
            <span>样品名称:</span>
            <el-input clearable  v-model="searchParam.materialName"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList" />
          </div>
          <div class="filter-item">
            <span>存样时间:</span>
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
                            type="date"
                            style="width: 140px;"></el-date-picker>
          </div>

          <div class="filter-item filter-item-btn-search">
            <i class="el-icon-search" style="cursor: pointer;"
               @click="getList"></i>
          </div>
        </div>
        <div>
          <el-button class="filter-btn-item" v-if="hasRole('saveSample:check:delete')"
                     size="mini"
                     style="margin-left: 30px;width: 80px;"
                     type="info"
                     icon="el-icon-delete"
                     @click="batchDelete">删除</el-button>
          <el-button class="filter-btn-item" v-if="hasRole('saveSample:check:add')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="primary"
                     icon="el-icon-edit"
                     @click="addTestMethod">新增</el-button>
        </div>
      </div>
    </div>
    <drug-table @getSelection="getSelection" :isMultipleSelection="true" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <label @click="handleEditData(props.rowData)" v-if="hasRole('saveSample:check:edit')"
                 class="table-view">
            修改
          </label> ·
          <label @click="deleteData(props.rowData)" v-if="hasRole('saveSample:check:delete')"
                 class="table-view">
            删除
          </label>
        </div>
      </template>
    </drug-table>
    <manage-edit></manage-edit>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { parseTime } from '@/utils'
import drugTable from "@/components/table/index";
import manageEdit from "./dialog/managementEdit"

export default {
  name: '检验方法',
  components: { drugTable ,manageEdit},
  directives: { waves },

  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      statusMap:[{label:"审核中",value:"0"},{label:"完成",value:"2"},{label:"驳回",value:"1"}],
      searchParam: {
        materialName:"",
        startTime:"",
        endTime:""
      },
      detailData:{},
      operateType:"add",

      selectChoice:[]
    }
  },
  mounted() {
    let self = this;
    self.getList();
    self.$eventBus.$on("updateSampleSaveList",function () {
      self.getList();
    })
  },
  methods: {
    getList() {
      let self = this;
      self.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      self.$http({
        url: "/drug/sampleSave/querySampleSaveList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader =  [{"columnName": "sampleId", "coloumNameCn": "检验单号","width":"90px"},
            {"columnName": "house", "coloumNameCn": "库位号","width":"70px"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "userName", "coloumNameCn": "存样人"},
            {"columnName": "createTimeFt", "coloumNameCn": "存样时间"},
            {"columnName": "materialName", "coloumNameCn": "样品名称"},];
          self.option.showOperate = true;
        }
      });
    },
    getSelection(val){
      this.selectChoice = val;
    },
    handleEditData(rowData){
      this.detailData = Object.assign({},rowData);
      this.operateType = "edit";
      this.$eventBus.$emit("openSampleSaveDialog", this.detailData,this.operateType);
    },
    addTestMethod(){
      this.detailData =  {
        sampleId:"",
        materialName:"",
        materialType:"",
        house:""
      };
      this.operateType = "add";
      this.$eventBus.$emit("openSampleSaveDialog", this.detailData,this.operateType);
    },

    batchDelete(){
      let param = {ids:[]};
      for(let data of this.selectChoice){
        param.ids.push(data.id);
      }
      this.deleteRow(param);
    },
    deleteData(rowData){
      let param = {ids:[]};
      param.ids.push(rowData.id);
      this.deleteRow(param);
    },
    deleteRow(param) {
      let self = this;
      if(!param || param.ids.length < 1){
        self.$notify({
          title: '提示',
          message: "至少选择一条记录！",
          type: 'warning'
        });
        return
      }
      self.$confirm('确定删除该信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http({
          url: "/drug/sampleSave/batchDeleteSample",
          method: "post",
          data: JSON.stringify(param),
          dataType: 'json',
          contentType: "application/json",
        }).then(resp => {
          if (resp.success) {
            self.getList();
            self.$notify({
              title: '提示',
              message: "删除成功！",
              type: 'success'
            });
            return
          }
          self.$notify({
            title: '提示',
            message: "操作失败，请联系管理员！",
            type: 'error'
          });
        });
      });
    },
  }
}
</script>


<style lang="scss" scoped>
</style>
