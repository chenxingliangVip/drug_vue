<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="flex-row-space-between">
        <div>

        </div>
        <div>
          <el-button class="filter-btn-item" v-if="hasRole('role:system:delete')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="info"
                     icon="el-icon-delete"
                     @click="deleteRole">删除</el-button>
          <el-button class="filter-btn-item" v-if="hasRole('role:system:add')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="primary"
                     icon="el-icon-edit"
                     @click="addRole">新增</el-button>
        </div>
      </div>
    </div>
    <drug-table @getSelection="getSelection" :isMultipleSelection="true" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <el-button type="text" @click="editRole(props.rowData)"  v-if="hasRole('role:system:edit')"
                     size='mini'>
            编辑
          </el-button>
        </div>
      </template>
    </drug-table>

    <role-edit :editData="roleDetail" :selfValue="selfValue" :type="operateType" :roles="tableData"></role-edit>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/views/directive/waves' // waves directive
import { parseTime } from '@/utils'
import drugTable from "@/components/table/index";
import roleEdit from "./roleEdit";

export default {
  name: '角色权限管理',
  components: { drugTable,roleEdit },
  directives: { waves },
  data() {
    return {

      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      selectChoice:[],
      roleDetail:{},
      operateType:"add",
      selfValue:""
    }
  },
  mounted() {
    let self = this;
    self.getList();
    self.$eventBus.$on("updateRoleList",function () {
      self.getList()
    })
  },
  methods: {
    getSelection(val){
      this.selectChoice = val;
    },

    getList() {
      let self = this;
      self.tableLoading = true;
      self.$http({
        url: "/drug/role/queryRoleList",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader =  [{"columnName": "roleName", "coloumNameCn": "角色","width":"120px"},
            {"columnName": "rolePermission", "coloumNameCn": "权限"},
            {"columnName": "stopStatusCn", "coloumNameCn": "状态","width":"100px"},];
          self.option.showOperate = true;
        }
      });

    },

    deleteRole(){
      let self = this;
      let param = {ids:[]};
      for(let data of this.selectChoice){
        param.ids.push(data.id);
      }
      if(param.ids.length == 0){
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
          url: "/drug/role/deleteRole",
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

    addRole(){
      this.roleDetail = {id:""};
      this.operateType = "add";
    },

    editRole(rowData){
      this.roleDetail = Object.assign({},rowData);
      this.operateType = "edit";
      this.selfValue = rowData.roleName;
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

.el-dialog-item {
  display: inline-block;
}
</style>
