<template>
  <el-dialog title="参数设定-方法类别"
             append-to-body
             width="40%"
             :close-on-click-modal="false"
             class="el-dialog-param"
             :visible.sync="dialogGradeVisible">
    <div class="dialog-title"><span style='color:#000'>方法类别</span></div>
    <el-divider></el-divider>
    <div class="el-div-container">
      <el-form ref="dataForm" :model="levelObj" :rules="rules" :inline="true"  class="demo-form-inline">

        <el-form-item label="类别名称" prop="itemName">
          <el-input clearable  v-model="levelObj.itemName"
                    size="mini"
                    style="width: 100px;"/>
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
          </div>
        </template>
      </drug-table>
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
      var validateName= (rule, value, callback) => {
        let names = [];
        if(this.tableData && this.tableData.length > 0){
          for(let data of this.tableData){
            names.push(data.itemName);
          }
        }
        if (names.includes(this.levelObj.itemName)) {
          callback(new Error('名称已存在!'));
        } else {
          callback();
        }
      };
      return {
        dataList: [],
        dialogGradeVisible: false,
        levelObj: {itemName: "",itemCode:"method_type"},
        tableData: [],
        tableHeader: [],
        tableLoading: true,
        option: {showOperate: true},
        pageSizeParam:20,

        rules: {
          itemName: [
            {validator: validateName, trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      let self = this;
      self.$eventBus.$on("updateLevel", function () {
        self.getList();
      })
    },
    methods: {
      getList() {
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/codeItem/queryCodeItemList",
          method: "post",
          params: {itemCode: "method_type"}
        }).then(resp => {
          if (resp.success) {
            self.pageSizeParam = 5;
            self.tableLoading = false;
            self.tableData = resp.result;
            self.tableHeader = [{"columnName": "createTimeFt", "coloumNameCn": "日期", "width": "150px"},
              {"columnName": "itemName", "coloumNameCn": "类别名称"}];
            self.option.showOperate = true;
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
            url: "/drug/codeItem/updateCodeItem",
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
        if(!self.levelObj.itemName){
          this.$notify({
            title: '提示',
            message: '提交的选项不能为空',
            type: 'error',
            duration: 1000
          });
          return;
        }
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            self.tableLoading = true;
            self.$http({
              url: "/drug/codeItem/addCodeItem",
              method: "post",
              params: self.levelObj
            }).then(resp => {
              if (resp.success) {
                self.levelObj = {itemName: "", serialNo: "",itemCode:"method_type"};
                self.getList();
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    watch: {
      paramData(val) {
        let self = this;
        self.dialogGradeVisible = true;
        self.levelObj = {itemName: "",itemCode:"method_type"};
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
