<template>
  <div class="app-other-approval-container">
    <drug-table :backCount="backCount"  @getBackData="getList"  :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div v-if="hasRole('standard:check:see')">
          <el-button type="text"
                      @click="seeMethodApprove(props.rowData)"
                     size='mini'>
            <!--<img src="../../assets/img/disagree.png" style="cursor: pointer;width: 18px" v-if="props.rowData.checkStatus=='4'">-->
            <img src="../../assets/img/agreeing.png" style="cursor: pointer" v-if="props.rowData.checkStatus=='2'">
            <img src="../../assets/img/view1.png" style="cursor: pointer" v-if="props.rowData.checkStatus=='5' || props.rowData.checkStatus=='4'">
          </el-button>
        </div>
      </template>
    </drug-table>
    <test-method-dialog></test-method-dialog>
  </div>
</template>
<script>
  import drugTable from "@/components/table/index";
  import testMethodDialog from './dialog/testMethodDialog'
  export default {
    name:"testMethodApprove",
    props:[],
    data(){
      return{
        datas:[],
        backCount:0,
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        option:{showOperate:true},
        searchParam:{},

      }
    },
    components:{drugTable,testMethodDialog},
    mounted(){
      let self = this;
      self.getList(0,20);
      self.$eventBus.$on("updateTestMethodApprove",function (searchForm) {
        if(searchForm){
          self.searchParam = searchForm;
        }
        self.getList(0,20);
      })
    },
    methods:{
      getList(startIndex,pageRow) {
        let self = this;
        self.tableLoading = true;
        let searchParam = Object.assign({},this.searchParam);
        if(searchParam.endTime){
          searchParam.endTime = searchParam.endTime+" 23:59:59";
        }
        let start = typeof startIndex =="number"?startIndex:0;
        let total = typeof pageRow == "number"?pageRow:15;
        searchParam.startIndex = start;
        searchParam.totalPage = total;
        self.$http({
          url: "/drug/fmApprove/queryMethodFmApproveList",
          method: "post",
          params:searchParam
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            self.tableData = resp.result;
            self.backCount = 0;
            if(self.tableData.length > 0){
              self.backCount = self.tableData[0].count;
              self.$eventBus.$emit("updateApproveCount","method",self.tableData[0].readCount);
            }
            self.tableHeader =  [
              {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
              {"columnName": "id", "coloumNameCn": "申请号"},
              {"columnName": "methodCode", "coloumNameCn": "方法编码"},
              {"columnName": "itemName", "coloumNameCn": "检测项"},
              {"columnName": "methodName", "coloumNameCn": "方法名称"},
              {"columnName": "codeAttrName", "coloumNameCn": "方法属性","width":"70px"},
              {"columnName": "createTimeFt", "coloumNameCn": "送审时间","width":"90px"},
              {"columnName": "updateTimeFt", "coloumNameCn": "完成时间"},
              {"columnName": "checkApproveStatusCn", "coloumNameCn": "审核状态"},
            ];
            self.option.showOperate = true;
          }
        });
      },

      seeMethodApprove(rowData){
        let row = Object.assign({},rowData);
        this.$eventBus.$emit("openTestMethodApproveDialog",row);
      },
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
    border-radius:3px;
    padding: 5px 10px;
  }

  .el-button .svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
</style>
