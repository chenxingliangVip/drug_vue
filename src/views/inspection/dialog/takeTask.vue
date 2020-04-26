<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             width="40%"
             :close-on-click-modal="false"
             title="检样领检">
    <div class="dialog-title"><span style='color:#cb0000'>检样领检</span></div>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规格：</label><span>{{detailData.materialType}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">检验号</label>：<span style="color: #cb0000;font-size: 14px;">{{detailData.sampleId}}</span></div>
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

    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini" @click="updateSampleItem"
                 style="width: 80px;">
        领检
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
      self.$eventBus.$on("openTakeTaskDialog",function (editData,operateType) {
        self.dialogAddVisible = true;
        self.count = 0;
        self.type = operateType;
        self.detailData = editData;
        self.getSampleItems();

      })
    },
    methods:{

      updateSampleItem(){
        let self = this;
        let params = [];
        if(self.selectChoice.length < 1){
          self.$notify({
            title: '提示',
            message: "请选择领检项！",
            type: 'warning'
          });
          return;
        }
        for(let data of self.selectChoice){
          let p = {allCount:self.tableData.length,checkStatus:"SA",sampleId:self.detailData.sampleId,id:data.id,testStaffId:self.$store.getters.userId};
          params.push(p);
        }
        if(self.count !=0){
          return;
        }
        self.$http({
          url: "/drug/sampleItem/updateSampleItem",
          method: "post",
          data: JSON.stringify(params),
          dataType: 'json',
          contentType: "application/json",
        }).then(resp => {
          if (resp.success) {
            self.dialogAddVisible = false;
            self.openPrintView();
            self.$eventBus.$emit("updateDetectionList");
            self.$notify({
              title: '提示',
              message: "领检成功！",
              type: 'success'
            });
            return
          }
          self.count--;
          self.$notify({
            title: '提示',
            message: "操作失败，请联系管理员！",
            type: 'error'
          });
        });
        this.count++;
      },

      openPrintView(){
        let time = (new Date()).getTime();
        let routeData = this.$router.resolve({ path: "/iframe?code="+this.detailData.sampleId+"&&time="+time });
        window.open(routeData.href, '_blank');
      },

      getSelection(val){
        this.selectChoice = val;
        this.choiceSize = val.length+"/"+this.tableData.length
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
            let datas = [];
            for(let data of resp.result.items){
               if(!data.testStaffId && !data.resultId){
                 datas.push(data);
               }
            }
            self.tableData = datas;
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
