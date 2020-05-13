<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="flex-row-space-between">
        <div>
          <div class="filter-item">
            <span>姓名<i class="i_colon">:</i></span>
            <el-input clearable  v-model="searchParam.name"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList" />
          </div>
          <div class="filter-item">
            <span>日期<i class="i_colon">:</i></span>
            <el-date-picker v-model="searchParam.startTime"
                            size="mini"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 140px;">
            </el-date-picker>
            <span> - </span>
            <el-date-picker v-model="searchParam.endTime"
                            size="mini"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 140px;">
            </el-date-picker>
          </div>
          <div class="filter-item filter-item-btn-search">
            <i class="el-icon-search" style="cursor: pointer"
               @click="getList"></i>
          </div>
        </div>
        <div>
          <el-button class="filter-btn-item" v-if="hasRole('log:system:delete')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="danger"
                     icon="el-icon-delete" @click="batchDelete"
                     >删除</el-button>
        </div>
      </div>
    </div>
    <drug-table @getSelection="getSelection" :isMultipleSelection="true" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <el-button type="text" v-if="hasRole('log:system:delete')"
                     @click="handleDeleteSingle(props.rowData)"
                     size='mini'>
            删除
          </el-button>
        </div>
      </template>
    </drug-table>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/views/directive/waves' // waves directive
import drugTable from "@/components/table/index";


export default {
  name: '送检',
  components: { drugTable },
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      searchParam:{startTime:"",endTime:"",name:""},
      selectChoice:[]
    }
  },
  mounted() {
    let self = this;
    self.getList();
    self.$eventBus.$on("gteLogsList",function () {
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
        url: "/drug/log/queryLogList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader =  [{"columnName": "createTimeFt", "coloumNameCn": "时间","width":"150px"},
            {"columnName": "userName", "coloumNameCn": "姓名"},
            {"columnName": "type", "coloumNameCn": "类型","width":"100px"},
            {"columnName": "detail", "coloumNameCn": "详情"}];
          self.option.showOperate = true;
        }
      });
    },
    getSelection(val){
      this.selectChoice = val;
    },

    handleDeleteSingle(rowData){
      let ids = [];
      ids.push(rowData.id);
      this.handleDelete(ids);
    },

    batchDelete(){
      let self = this;
      let ids = [];
      if(!this.selectChoice || self.selectChoice.length < 1){
        self.$notify({
          title: '提示',
          message: "至少选择一条记录！",
          type: 'warning'
        });
        return
      }
      for(let choice of this.selectChoice){
        ids.push(choice.id);
      }
      self.handleDelete(ids);
    },

    handleDelete(ids){
      let self = this;
      self.$confirm('确定删除该信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http({
          url: "/drug/log/deleteBatchLog",
          method: "post",
          data: JSON.stringify({ids:ids}),
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
</style>
