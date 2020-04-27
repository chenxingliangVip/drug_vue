<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin-left:10px">
      <div>
        <div class="filter-item">
          <span>检验人:</span>
          <el-input clearable  v-model="searchParam.userName"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>检验号:</span>
          <el-input clearable  v-model="searchParam.sampleCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>

        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor: pointer"
             @click="getList"></i>
        </div>
      </div>
    </div>
    <div class="el-table-frame1">
      <drug-table  :tableData="tableData" :tableLoading="tableLoading"
                   :tableHeader="tableHeader" :option="option">
        <template slot-scope="props" slot="operate">
          <img src="../../../assets/img/print.png"   @click="openPrintView(props.rowData)"
                class="svg-icon" style="cursor: pointer;width: 15px;height: 15px;margin-top: 4px">
        </template>
      </drug-table>
      <record-dialog></record-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import drugTable from "@/components/table/index";
import recordDialog from "./recordDialog"

export default {
  name: '样品检验',
  components: { drugTable ,recordDialog},
  directives: { waves },
  data() {
    return {

      searchParam: {
        userName:"",
        sampleCode: ""
      },
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
    }
  },

  mounted(){
    let self = this;
    self.$eventBus.$on("updateRecordList",function () {
      self.getList();
    })
    self.getList();
  },

  methods: {
    openPrintView(row){
      let time = (new Date()).getTime();
      let routeData = this.$router.resolve({ path: "/iframe?filePath="+row.filePath+"&&time="+time });
      window.open(routeData.href, '_blank');
      this.updatePrintCount(row);
    },

    updatePrintCount(row){
      let self = this;
      self.$http({
        url: "/drug/record/updateRecordLog",
        method: "post",
        params:{id:row.id}
      }).then(resp => {
      });
    },

    handlePrint(row){
      this.$eventBus.$emit("openRecordDialog",row.sampleId,row.filePath);
    },
    getList() {
      let self = this;
      self.tableLoading = true;
      self.$http({
        url: "/drug/record/queryRecordLogList",
        method: "post",
        params:self.searchParam
      }).then(resp => {
        if (resp.success) {
          let count =0;
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader =  [
            {"columnName": "sampleId", "coloumNameCn": "检验单号"},
            {"columnName": "workNum", "coloumNameCn": "工号"},
            {"columnName": "userName", "coloumNameCn": "姓名"},
            {"columnName": "itemNum", "coloumNameCn": "项数"},
            {"columnName": "printNum", "coloumNameCn": "打印数"},
            {"columnName": "createTimeFt", "coloumNameCn": "盖章时间"}];
          self.option.showOperate = true;
          for(let data of resp.result){
            if(data.printNum == 0){
              count++;
            }
          }
          self.$eventBus.$emit("updateRecordCount",count);
        }
      });
    },
  }
}
</script>

<style lang="scss" >
.el-button-excel {
  .el-button--text {
    color: #2995d4;
  }
}
</style>

<style lang="scss" scoped>
.el-table-frame1 {
  margin: 0 10px 10px 10px;
}
.el-button {
  .svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}

.el-dialog .el-button--primary {
  background-color: #2e827f;
  border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
}
</style>
