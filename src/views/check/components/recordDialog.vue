<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             width="40%"
             :close-on-click-modal="false"
             title="检验记录单复打">
    <div class="dialog-title"><span style='color:#cb0000'>检验记录单复打</span></div>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规格：</label><span>{{detailData.materialType}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">检验号</label>：<span>{{detailData.sampleId}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>物料编码：</label><span>{{detailData.materialCode}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">申请人</label>：<span>{{detailData.userName}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品名称：</label><span>{{detailData.materialName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>申请时间：</label><span>{{detailData.createTimeFt}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品等级：</label><span>{{detailData.materialGrade}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>送样地点：</label><span>{{detailData.location}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="el-dialog-item"><label>样品规模：</label><span>{{detailData.sampleType}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="el-dialog-item"><label>检项数量：</label><span>{{choiceSize}}</span></div>
      </el-col>
    </el-row>
    <div class="el-dialog-table">
      <drug-table  @getSelection="getSelection" :filterPage="false" :isMultipleSelection="true"
                   :tableData="tableData" :tableLoading="tableLoading"
                   :tableHeader="tableHeader"  >
      </drug-table>
    </div>

    <div slot="footer" v-if="hasRole('report:effiect:print')"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini" @click="printSample"
                 style="width: 80px;">

        复打
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import drugTable from "@/components/table/index";
  export default {
    name:"takeTask",
    data(){
      return{
        detailData: {
          materialType:"",
          sampleId:"",
          materialCode:"",
          userName:"",
          materialName:"",
          createTimeFt:"",
          materialGrade:"",
          location:"",
          sampleType:""
        },
        dialogAddVisible: false,
        count: 0,
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        selectChoice:[],
        choiceSize:""
      }
    },
    components:{
      drugTable
    },
    mounted(){
      let self = this;
      self.$eventBus.$on("openRecordDialog",function (sampleId,operateType) {
        self.dialogAddVisible = true;
        self.count = 0;
        self.detailData.sampleId = sampleId;
        self.getSampleItems();
        self.getSampleDetail();

      })
    },
    methods:{

      printSample(){
        let self = this;
        if(self.selectChoice.length < 1){
          self.$notify({
            title: '提示',
            message: "请选择领检项！",
            type: 'warning'
          });
          return;
        }
        if(self.count ==0){
          self.$http({
            url: "/drug/record/addPrintRecordLogDetail",
            method: "post",
            params:{sampleId:self.detailData.sampleId,itemNum:self.choiceSize,printNum:"1",userId:self.$store.getters.userId}
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateRecordList");
              self.$notify({
                title: '提示',
                message: "打印成功！",
                type: 'success'
              });
              self.dialogAddVisible = false;
              return
            }
            self.$notify({
              title: '提示',
              message: "出现异常，请联系管理员",
              type: 'error'
            });
            this.count--;
          });
        }
        this.count++;
      },

      getSelection(val){
        this.selectChoice = val;
        this.choiceSize = val.length+"/"+this.tableData.length
      },


      getSampleDetail(){
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/sampleItem/querySampleWithPrint",
          method: "post",
          params:{sampleCode:self.detailData.sampleId}
        }).then(resp => {
          if (resp.success) {
            self.detailData = resp.result;
          }
        });
      },


      getSampleItems(){
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/sampleItem/querySampleItemSend",
          method: "post",
          params:{sampleCode:self.detailData.sampleId}
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            self.tableData = resp.result.items;
            self.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"}];
            self.choiceSize = "0/"+self.tableData.length
          }
        });
      }
    }
  }
</script>
