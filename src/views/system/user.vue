<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="flex-row-space-between">
        <div>
          <div class="filter-item">
            <span>部门<i class="i_colon">:</i></span>
            <el-select v-model="queryParam.deptId"
                       size="mini"
                       clearable
                       style="width: 100px">
              <el-option v-for="item in deptList"
                         :key="item.id"
                         :label="item.deptName"
                         :value="item.id" />
            </el-select>
          </div>
          <div class="filter-item">
            <span>姓名<i class="i_colon">:</i></span>
            <el-input clearable  v-model="queryParam.userName"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList" />
          </div>
          <div class="filter-item">
            <span>工号<i class="i_colon">:</i></span>
            <el-input clearable  v-model="queryParam.workNum"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList" />
          </div>
          <div class="filter-item filter-item-btn-search">
            <i class="el-icon-search" style="cursor: pointer;"
               @click="getList"></i>
          </div>
        </div>
        <div>
          <el-button class="filter-btn-item" v-if="hasRole('user:system:delete')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="danger"
                     icon="el-icon-delete"
                     @click="batchDelete">删除</el-button>
          <el-button class="filter-btn-item" v-if="hasRole('user:system:add')"
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
        <div  v-if="hasRole('user:system:edit')">
          <el-button type="text"
                     @click="editLogin(props.rowData)"
                     size='mini'>
            <img src="../../assets/img/edit.png" >
          </el-button>
        </div>
      </template>
    </drug-table>
    <user-edit :editData="userDetail" :type="operateType" :existLogin="tableData" >

    </user-edit>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/views/directive/waves' // waves directive
import drugTable from "@/components/table/index";
import userEdit from "./userEdit";


export default {
  name: '用户',
  components: { drugTable,userEdit },
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      selectChoice:[],
      userDetail:{},
      operateType:"add",
      queryParam:{deptId:"",workNum:"",userName:""},
      deptList:[]
    }
  },
  mounted() {
    let self = this;
    self.getDeptList();
    self.$eventBus.$on("updateLoginList",function () {
      self.queryParam = {deptId:"",workNum:"",userName:""};
      self.getList()
    });
    self.getList()
  },
  methods: {
    handleCreate(){
      this.userDetail = {deptId:"",roleId:"",workNum:"",userName:"",userAccount:"",password:"",accountStatus:"0"};
      this.operateType = "add";
    },

    batchDelete(){
      let param = {ids:[]};
      for(let data of this.selectChoice){
        param.ids.push(data.id);
      }
      this.deleteRow(param);
    },
    editLogin(rowData){
      this.userDetail = Object.assign({},rowData);
      this.operateType = "edit";
    },

    getSelection(val){
      this.selectChoice = val;
    },
    getList() {
      let self = this;
      self.tableLoading = true;
      self.$http({
        url: "/drug/queryLoginList",
        method: "post",
        params:self.queryParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader =  [{"columnName": "createTimeFt", "coloumNameCn": "日期"},
            {"columnName": "deptName", "coloumNameCn": "部门"},
            {"columnName": "userName", "coloumNameCn": "姓名"},
            {"columnName": "roleName", "coloumNameCn": "职务"},
            {"columnName": "workNum", "coloumNameCn": "工号"},
            {"columnName": "userAccount", "coloumNameCn": "用户名"},
            {"columnName": "accountStatusCn", "coloumNameCn": "状态","width":"80px"},];
          self.option.showOperate = true;
        }
      });

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
          url: "/drug/BatchDeleteUser",
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
    getDeptList() {
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
  },
}
</script>

<style lang="scss" >
.el-checkbot-disable {
  span {
    margin-left: 0px;
  }
}
</style>

<style lang="scss" scoped>
.el-form-no {
  text-align: right;
  font-size: 18px;
  color: #cb0000;
}

.el-button {
  .svg-icon {
    width: 16px;
    height: 16px;
    color: #2995de;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}

.el-dialog-item .el-button--mini {
  padding: 0px;
}

.el-dialog {
  .el-button .svg-icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}
</style>
