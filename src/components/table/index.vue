<template>
  <div class="drugTable">
    <el-table :data="displayTableData"
              v-loading="loading"
              :border="isBorder"
               size="mini"
               :show-summary="showSummary"
              :cell-style="finalCellStyle"
              :header-cell-style="option.headerStyle"
               highlight-current-row
               @selection-change="handleSelectionChange"
              :style="{ width:option.width?option.width:'100%' }">
      <el-table-column type="selection" align="center" v-if="isMultipleSelection && displayTableData.length > 0"
        width="55">
      </el-table-column>

      <el-table-column v-if="col.status != '-1'" v-for="(col, index) in tableHeader" :key="index"
                       :prop="col.columnName"
                       :label="col.coloumNameCn"
                        :width="col.width"
                         align="center"
                       :min-width="col.minWidth"
      >
        <template slot-scope="scope">
          <span  :title="scope.row[col.columnName]"  @click="emitSpanFun(scope.row,col.isClick&&scope.row[col.columnName]=='驳回')" :style="col.isClick&&scope.row[col.columnName]=='驳回'?'cursor: pointer':''">{{scope.row[col.columnName]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center" v-if="option.showOperate">
        <template slot-scope="scope">
          <slot :index="scope.$index" :rowData="scope.row" :num="pageNum" :row="pageRow" name="operate">
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="filterPage&&totalCount > 0 &&!loading" background style="text-align: right;margin-top: 10px"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageNum"
                   :page-size="pageRow"
                   :total="totalCount"
                   prev-text="上一页"
                   next-text="下一页"
                   :page-sizes="[5, 10, 20, 100,500]"
                   layout="total, sizes, prev, pager, next">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: 'wuTable',
    props: {
      tableData: {
        default: function () {
          return []
        },
        type: Array
      },
      tableHeader: {
        default: function () {
          return []
        },
        type: Array
      },
      option: {
        default: function () {
          return {}
        },
        type: Object
      },

      pageSizeParam:{
        default: function () {
          return 20
        },
        type: Number
      },
      backCount:{
        default: function () {
          return 0
        },
        type: Number
      },

      isMultipleSelection: {
        default: function () {
          return false
        },
        type: Boolean
      },
      showSummary: {
        default: function () {
          return false
        },
        type: Boolean
      },

      tableLoading: {
        default: function () {
          return true
        },
        type: Boolean
      },

      isBorder: {
        default: function () {
          return true
        },
        type: Boolean
      },
      headerFix: {
        default: function () {
          return false
        },
        type: Boolean
      },


      isStrip: {
        default: function () {
          return false
        },
        type: Boolean
      },

      extendType: {
        default: function () {
          return false
        },
        type: Boolean
      },
      filterPage: {
        default: function () {
          return true
        },
        type: Boolean
      },
    },
    data() {
      return {
        displayTableData: [],
        copyTableData: [],
        //复选框选择的数据
        multipleSelection: [],

        //分页总数
        totalCount: 0,
        //开始页
        pageNum: 1,
        //每页显示条数
        pageRow: 20,

        loading: true,

      }
    },
    methods: {

      handleSelectionChange(val){
        this.multipleSelection = val;
        this.$emit("getSelection",val);
      },

      handleSizeChange(val) {
        //改变每页数量
        this.pageRow = val;
        this.handleFilter();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.refreshTable();
      },

      handleFilter() {
        //查询事件
        this.pageNum = 1;
        this.refreshTable()
      },

      getIndex($index) {
        return (this.pageNum - 1) * this.pageRow + $index + 1
      },


      refreshTable() {
        let start = this.pageRow * (this.pageNum - 1);
        let end = this.pageRow * this.pageNum;
        if(this.backCount == 0){
          this.displayTableData = this.copyTableData.slice(start, end);
        }else{
          this.$emit("getBackData",this.pageRow * (this.pageNum - 1),this.pageRow);
        }

      },

      finalCellStyle({row, column, rowIndex, columnIndex}){
        let key = column.property;
        let color = {background: '',color:""};
        if(key == "accountStatusCn"){
          let userStatus = row.accountStatus;
          if(userStatus == 1){
            color.color = "red";
          }
        }
        if(key == 'checkMaterialStatusCn'){
          let userStatus = row.checkStatus;
          if(userStatus == 0){
            color.color = "rgb(230, 162, 60)";
          }
          if(userStatus == 1){
            color.color = "red";
          }
          if(userStatus == 2){
            color.color = "rgb(103, 194, 58)";
          }
        }
        if(key == "checkStatusCn"){
          let userStatus = row.checkStatus;
          if(userStatus == 0 ){
            color.color = "rgb(230, 162, 60)";
          }
          if(userStatus == 'SA'){
            color.color =  "#54A0EA";
          }
          if(userStatus == 1){
            color.color = "red";
          }
          if(userStatus == 3){
            color.color = "#ff9900";
          }
          if(userStatus == 4 || userStatus =='RJ'){
            color.color = "red";
          }
        }
        return color;
      },

      emitSpanFun(row,click){
        if(click){
          this.$emit("emitSpanFun",row);
        }
      }

    },
    watch: {
      tableData(val) {
        if(this.backCount == 0){
          this.displayTableData = this.filterPage?(val.slice(0, this.pageNum * this.pageSizeParam)):JSON.parse(JSON.stringify(val));
          this.totalCount = val ? val.length : 0;
        }else{
          this.displayTableData = val;
          this.totalCount = this.backCount;
        }
        this.copyTableData = JSON.parse(JSON.stringify(val));
        if(!(this.backCount > 0 && this.pageNum !=1)){
          this.pageNum = 1;
        }
      },
      tableLoading(val) {
        this.loading = val;
      },
      pageSizeParam(val){
         this.pageRow = val;
      }
    }
  }
</script>
<style>
  .drugTable .cell {
    overflow: hidden;/*超出部分隐藏*/
    white-space: nowrap;/*不换行*/
    text-overflow:ellipsis;/*超出部分文字以...显示*/
  }
  .drugTable .el-table__header, .el-table__body, .el-table__footer {
    table-layout: fixed;
  }
</style>
