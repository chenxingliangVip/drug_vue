<template>
  <el-dialog title="打印设置"
             append-to-body
             width="80%"
             :close-on-click-modal="false"
             class="el-dialog-param"
             :visible.sync="dialogGradeVisible">
    <div class="dialog-title"><span style='color:#000'>打印设置</span></div>
    <el-divider></el-divider>
    <div class="el-div-container">
      <el-form ref="dataForm"  :inline="true"  class="demo-form-inline">

        <el-form-item label="打印机描述:" >
          <el-input clearable  v-model="printObj.printDesc"
                    size="mini"
                    style="width: 140px;"/>
        </el-form-item>
        <el-form-item label="打印机IP:" >
          <el-input clearable  v-model="printObj.printIp"
                    size="mini"
                    style="width: 140px;"/>
        </el-form-item>
        <div class="el-dialog-item">
          <el-button class="filter-btn-item"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="primary"
                     icon="el-icon-plus" @click="addLevel"
          >新增
          </el-button>
        </div>
      </el-form>

      <drug-table :tableData="tableData" :pageSizeParam="pageSizeParam" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
        <template slot-scope="props" slot="operate">
          <div>
            <el-button type="text"
                       @click="handleDelete(props.rowData)"
                       size='mini'>
              删除
            </el-button>
            <el-button type="text"
                       @click="handleSetIp(props.rowData)"
                       size='mini'>
              设置
            </el-button>
          </div>
        </template>
      </drug-table>
      <el-dialog
        width="40%"
        title="人员IP"
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        append-to-body>
        <div style="margin-top: 20px;margin-bottom: 20px">
          <label>设置IP:</label>
          <el-input style="margin-top: 10px"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入电脑ip 逗号隔开"
            v-model="rowData.personIp">
          </el-input>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <el-button type="red" @click="closeInner"
                     size="mini"
                     style="width: 80px;">
            取消
          </el-button>
          <el-button type="green" @click="savePersonIp"
                     size="mini"
                     style="width: 80px;">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </el-dialog>

</template>

<script>
  import drugTable from "@/components/table/index";
  export default {
    name: "size",
    props: ["paramData"],
    components:{drugTable},
    data() {
      return {
        printObj:{printIp: "",printDesc:""},
        dialogGradeVisible: false,
        innerVisible: false,
        tableData: [],
        tableHeader: [],
        tableLoading: true,
        option: {showOperate: true},
        pageSizeParam:20,
        rowData:{personIp:"",printIp: "",printDesc:"",id:""}
      }
    },
    mounted() {

    },
    methods: {
      getList() {
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/print/queryPrintSets",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            self.tableData = resp.result;
            self.tableHeader = [
              {"columnName": "printDesc", "coloumNameCn": "打印机", "width": "150px"},
              {"columnName": "printIp", "coloumNameCn": "打印机IP", "width": "150px"},
              {"columnName": "personIp", "coloumNameCn": "用户IP"}
              ];
            self.option.showOperate = true;
          }
        });
      },

      handleSetIp(row){
        let self = this;
        self.innerVisible = true;
        self.rowData = Object.assign({},row);
      },

      closeInner(){
        let self = this;
        self.innerVisible = false;
        self.rowData = {};
      },

      savePersonIp(){
        let self = this;
        self.innerVisible = false;
        self.tableLoading = true;
        let param = {id:self.rowData.id,personIp: self.rowData.personIp};
        self.$http({
          url: "/drug/print/updatePrint",
          method: "post",
          params: param
        }).then(resp => {
          if (resp.success) {
            self.rowData = {};
            self.getList();
            self.tableLoading = false;
            self.$notify({
              title: '提示',
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          }
        });
      },

      handleDelete(rowData) {
        let self = this;
        let param = {id: rowData.id, status: "-1"};
        self.$confirm('确定删除该信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$http({
            url: "/drug/print/deletePrint",
            method: "post",
            params: param
          }).then(resp => {
            self.getList();
            self.$notify({
              title: '提示',
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
          });
        });
      },
      addLevel() {
        let self = this;
        if(!self.printObj.printIp){
          this.$notify({
            title: '提示',
            message: '打印机ip不能为空',
            type: 'error',
            duration: 1000
          });
          return;
        }
        if(!self.printObj.printDesc){
          this.$notify({
            title: '提示',
            message: '打印机描述不能为空',
            type: 'error',
            duration: 1000
          });
          return;
        }
        self.tableLoading = true;
        self.$http({
          url: "/drug/print/addPrint",
          method: "post",
          params: self.printObj
        }).then(resp => {
          if (resp.success) {
            self.printObj = {printIp: "",printDesc:""};
            self.getList();
            self.tableLoading = false;
          }
        });
      }
    },
    watch: {
      paramData(val) {
        let self = this;
        self.dialogGradeVisible = true;
        self.printObj = {printIp: "",printDesc:""};
        self.getList();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .btn-container {
    padding-top: 20px;
    padding-left: 50px;
    padding-right: 50px;
  }

  .btn-ul {
    list-style-type: none;
    width: 100%;
  }

  .btn-ul li {
    width: 20%;
    float: left;
    margin-top: 50px;
  }

  .clear {
    clear: both;
  }

  .el-dialog-item {
    display: inline-block;
  }
</style>
