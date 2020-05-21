<template>
  <div class="drugTable">
    <el-table :data="displayTableData"
              v-loading="loading"
              :border="isBorder"
               size="mini"
              :cell-style="finalCellStyle"
              :header-cell-style="option.headerStyle"
               highlight-current-row
              @cell-click="cellClick"
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
          <span  :title="scope.row[col.columnName].value" v-if="!scope.row[col.columnName].edit">{{scope.row[col.columnName].value}}</span>
          <el-select v-model="scope.row[col.columnNameRe].value" @change="changeValue(scope.row,col.columnName)"
                      v-if="scope.row[col.columnName].edit && scope.row[col.columnName].type == 'select'"
                     size="mini"
                     filterable
                     clearable>
            <el-option v-for="item in scope.row[col.columnName].list"
                       :key="item.id"
                       :label="item[scope.row[col.columnName].key]"
                       :value="item.id" />
          </el-select>
          <el-input clearable   size="mini" v-model="scope.row[col.columnName].value" v-if="scope.row[col.columnName].edit && scope.row[col.columnName].type == 'input'"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'editStandardTable',
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
          return 15
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

      editType: {
        default: function () {
          return ""
        },
        type: String
      },
      compareItem: {
        default: function () {
          return ""
        },
        type: String
      }
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
        pageRow: 15,

        loading: true,

        resultMap:[{label:"合格",value:"Y"},{label:"不合格",value:"N"}]

      }
    },
    methods: {

      getTableData(){
        return this.displayTableData;
      },



      changeValue(row,attr) {
        if(attr == 'methodName'){
          if(!row.itemName.value){
            row[attr].list = [];
            return;
          }
          let list = row[attr].list;
          let id = row["methodId"].value;
          for (let data of list) {
            if (data.id == id) {
              row.methodName.value = data.methodName;
              row.methodCode.value = data.methodCode;
              row.codeAttrName.value = data.codeAttrName;
              row.manHour.value = data.manHour;
              break;
            }
          }
          if(!id){
            row.methodName.value = "";
            row.methodId.value = "";
            row.methodCode.value = "";
            row.codeAttrName.value = "";
            row.manHour.value = "";
            row['itemName'].list = JSON.parse(JSON.stringify(row['itemName'].tmpList));
          }
        }
        if(attr == 'itemName'){
          row.methodName.value = "";
          row.methodId.value = "";
          row.methodCode.value = "";
          row.codeAttrName.value = "";
          row.manHour.value = "";
          let itemArray = [];

          let list = row[attr].list;
          let id = row["itemId"].value;
          for (let data of list) {
            if (data.id == id) {
              row.itemName.value = data.itemName;

              for(let it of row['methodName'].tmpList){
                if(it.itemName == data.itemName && it.methodType&&this.compareItem &&it.methodType.indexOf(this.compareItem)>-1){
                  itemArray.push(it);
                }
              }
              row['methodName'].list = itemArray;
              break;
            }
          }
          if(!id){
            row.itemName.value = "";
            row.itemId.value = "";
            row['methodName'].list = [];
          }
        }
      },

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
        if(key == "checkStatusCn"){
          let userStatus = row.checkStatus;
          if(userStatus == 0){
            color.color = "rgb(230, 162, 60)";
          }
          if(userStatus == 1){
            color.color = "red";
          }
          if(userStatus == 3){
            color.color = "yellow";
          }
          if(userStatus == 4){
            color.color = "red";
          }
        }
        return color;
      },
      cellClick(row, column, cell, event){
        if(this.editType == 'see'){
          return;
        }
        let property = column.property;
        let item = row[property];
        for(let data of this.displayTableData){
          for(let key in data){
            if(data[key].hasOwnProperty("edit")){
              data[key].edit = false;
            }
          }
        }
        if(item && item.hasOwnProperty("edit")){
          item.edit = true;
        }
      }

    },
    mounted(){
      let self =this;
      self.$eventBus.$on("setEditFalse",function () {
        for(let data of self.displayTableData){
          for(let key in data){
            if(data[key].hasOwnProperty("edit")){
              data[key].edit = false;
            }
          }
        }
      })
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
