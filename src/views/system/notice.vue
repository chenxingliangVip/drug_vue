<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="flex-row-space-between">
        <div>
          <div class="filter-item">
            <span>主题<i class="i_colon">:</i></span>
            <el-input clearable  v-model="searchParam.name"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList" />
          </div>
          <div class="filter-item filter-item-btn-search" style="cursor: pointer">
            <i class="el-icon-search"
               @click="getList"></i>
          </div>
        </div>
        <div>
          <el-button class="filter-btn-item" v-if="hasRole('rule:system:delete')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="danger"
                     icon="el-icon-delete"
                     @click="batchDelete">删除</el-button>
          <el-button class="filter-btn-item" v-if="hasRole('rule:system:add')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="primary"
                     icon="el-icon-edit"
                     @click="handleCreate">新增</el-button>
        </div>
      </div>
    </div>
    <drug-table @getSelection="getSelection" :isMultipleSelection="true" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <el-button type="text"
            @click="handleEditData(props.rowData)" v-if="hasRole('rule:system:edit')"
            size='mini'>
            编辑
          </el-button>
          <span v-if="hasRole('rule:system:edit')">·</span>
          <el-button type="text" v-if="hasRole('rule:system:delete')"
            @click="handleDelete(props.rowData)"
            size='mini'>
          删除
          </el-button>
        </div>
      </template>
    </drug-table>
    <notice-edit :detailData="detailData" :type="operateType"></notice-edit>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive

import drugTable from "@/components/table/index";
import noticeEdit from "./noticeEdit"


export default {
  components: { drugTable,noticeEdit},
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      searchParam: {
        name:"",
        type:"0"
      },
      detailData:{},
      operateType:"add",

      selectChoice:[]
    }
  },
  mounted() {
    let self = this;
    self.getList();
    self.$eventBus.$on("updateNTList",function () {
      self.getList();
    })
  },
  methods: {
    /**
     * 加载消息列表
     */
    getList() {
      let self = this;
      self.tableLoading = true;
      self.$http({
        url: "/drug/notice/queryNoticeList",
        method: "post",
        params:self.searchParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader =  [{"columnName": "createTimeFt", "coloumNameCn": "时间","width":"150px"},
            {"columnName": "title", "coloumNameCn": "主题"},
            {"columnName": "publishStatusCn", "coloumNameCn": "状态","width":"100px"}];
          self.option.showOperate = true;
        }
      });
    },


    handleCreate() {
      this.detailData = {id:"",userName:"",title:"",content:""};
      this.operateType = "add";
    },

    handleEditData(rowData){
      this.detailData = Object.assign({},rowData);
      this.operateType = "edit";
    },

    handleDelete(rowData){
       let param = {ids:[rowData.id]}
       this.deleteRow(param);
    },

    getSelection(val){
      this.selectChoice = val;
    },

    batchDelete(){
      let param = {ids:[]};
      for(let data of this.selectChoice){
        param.ids.push(data.id);
      }
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
          url: "/drug/notice/deleteNotice",
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
    }
  }
}
</script>


<style lang="scss" scoped>
.el-form-no {
  text-align: right;
  font-size: 18px;
  color: #cb0000;
}
</style>
