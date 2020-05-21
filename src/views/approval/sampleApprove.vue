<template>
  <div class="app-other-approval-container">
    <el-row>
      <el-col :span="24">
        <div class="el-input-scan">
                  <span class="svg-container">
                    <img src="../../assets/img/code.png" style="width: 15px">
                  </span>
          扫码审批
          <el-input clearable  style="width: 160px; margin-left:10px;" autofocus v-model="sampleCode"
                    size="mini" />
        </div>
      </el-col>
    </el-row>
    <drug-table :backCount="backCount"  @getBackData="getList"  :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <el-button type="text" v-if="hasRole('report:approve:see')"
                     @click="seeSampleApprove(props.rowData)"
                     size='mini'>
            <!--<img src="../../assets/img/disagree.png" style="cursor: pointer;width: 18px" v-if="props.rowData.checkStatus=='4'">-->
            <img src="../../assets/img/agreeing.png" style="cursor: pointer" v-if="props.rowData.checkStatus=='2'||props.rowData.checkStatus=='1'">
            <img src="../../assets/img/view1.png" style="cursor: pointer" v-if="props.rowData.checkStatus=='5' || props.rowData.checkStatus=='4'">
          </el-button>
        </div>
      </template>
    </drug-table>
    <sample-dialog></sample-dialog>
  </div>
</template>
<script>
  import drugTable from "@/components/table/index";
  import sampleDialog from "./dialog/sampleDialog";
  export default {
    name:"sampleApprove",
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
        sampleCodeList:[],
        sampleCode:"",
        showTip:"",
        firstExc:true,
      }
    },
    components:{drugTable,sampleDialog},
    mounted(){
      let self = this;
      self.getList(0,20);
      self.getAllSampleCode();
      self.$eventBus.$on("updateSampleApprove",function (searchForm) {
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
          url: "/drug/fmApprove/querySampleFmApproveList",
          method: "post",
          params:searchParam
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            self.tableData = resp.result;
            if(self.tableData.length > 0){
              self.backCount = self.tableData[0].count;
              self.$eventBus.$emit("updateApproveCount","sample",self.tableData[0].msgCount);
            }else{
              self.backCount = 0;
              self.$eventBus.$emit("updateApproveCount","sample",0);
            }
            self.tableHeader =  [
              {"columnName": "sampleCode", "coloumNameCn": "检验号"},
              {"columnName": "materialName", "coloumNameCn": "样品名称"},
              {"columnName": "materialType", "coloumNameCn": "规格"},
              {"columnName": "materialGrade", "coloumNameCn": "等级"},
              {"columnName": "location", "coloumNameCn": "送样地点"},
              {"columnName": "userName", "coloumNameCn": "审核人"},
              {"columnName": "refusCount", "coloumNameCn": "拒绝次数"},
              {"columnName": "updateTimeFt", "coloumNameCn": "审核时间"},
              {"columnName": "checkStatusCn", "coloumNameCn": "状态"}];
            self.option.showOperate = true;
          }
        });
      },

      seeSampleApprove(rowData){
        let row = {sampleId:rowData.sampleCode};
        this.$eventBus.$emit("openSampleApproveDialog",row,"edit");
      },

      getAllSampleCode() {
        let self = this;
        self.$http({
          url: "/drug/fmApprove/queryAllSampleFmApproveList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.sampleCodeList = resp.result;
          }
        });
      },



      openSampleApproveDialog(sampleId){
        let row = {sampleId:sampleId};
        this.$eventBus.$emit("openSampleApproveDialog",row,"edit");
      },
    },
    watch:{
      sampleCode(val){
        let self =this;
        if(!val){
          return;
        }
        setTimeout( function() {
          if(self.firstExc){
            self.firstExc = false;
            if(self.showTip){
              self.$notify({
                title: '提示',
                message: self.showTip,
                type: 'error'
              });
              self.sampleCode="";
            }
            setTimeout( function() {
              self.firstExc = true;
            }, 2000);
          }
        }, 1000);
        if(self.sampleCodeList.indexOf(val) > -1){
          self.openSampleApproveDialog(self.sampleCode);
          self.showTip = "";
          self.sampleCode="";
          self.firstExc = true;
        }else{
          this.showTip = "操作无效！";
        }
      }
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
    border-radius: 3px;
    padding: 5px 10px;
  }

  .el-button .svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
</style>
