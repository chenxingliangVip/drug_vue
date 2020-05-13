<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             width="40%"
             @closed="emitAutoInput"
             :close-on-click-modal="false"
             title="检验结果录入">
    <div class="dialog-title"><span>检验结果录入</span></div>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规格<i class="i_colon">：</i></label><span>{{detailData.materialType}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">检验号</label><i class="i_colon">：</i><span style="color: #cb0000;font-size: 14px;">{{detailData.sampleId}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>物料编码<i class="i_colon">：</i></label><span>{{detailData.materialCode}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">申请人</label><i class="i_colon">：</i><span>{{detailData.userName}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品名称<i class="i_colon">：</i></label><span>{{detailData.materialName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>申请时间<i class="i_colon">：</i></label><span>{{detailData.createTimeFt}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品等级<i class="i_colon">：</i></label><span>{{detailData.materialGrade}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>送样地点<i class="i_colon">：</i></label><span>{{detailData.location}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="el-dialog-item"><label>样品规模<i class="i_colon">：</i></label><span>{{detailData.sampleType}}</span></div>
      </el-col>
    </el-row>
    <div class="flex-row-space-between">
      <div style="line-height:15px; font-size:13px;"><span style="color:#878989">检项数量<i class="i_colon">：</i></span><span>{{item.tableData.length}}/{{item.tableData.length}}</span></div>
      <span>{{detailData.filePathName}}</span>
      <el-button type="primary"  v-show="submitBut"
                 size="mini"
                 style="width: 60px; height:15px; min-height:15px; font-size: 8px;"
                 @click="uploadSampleFile"
                >
        JPG上传
      </el-button>
      <input type="file" id="sampleFile" style="display: none;" @change="uploadFileSample">
    </div>
    <div class="el-dialog-table">
      <drug-table  :filterPage="false" ref="taskTable" :tableData="item.tableData" :tableLoading="item.tableLoading"
                   :tableHeader="item.tableHeader"  >
      </drug-table>
    </div>

    <div class="flex-row-space-between" v-show="resetItem.tableData.length >0"
         style="margin-top:10px">
      <div style="line-height:15px; font-size:13px;"><span style="color:#878989">复检项<i class="i_colon">：</i></span></div>
      <span>{{detailData.resetPathName}}</span>
      <el-button type="primary" v-show="submitBut"
                 size="mini"
                 style="width: 60px; height:15px; min-height:15px; font-size: 8px;"
                 @click="uploadSampleResetFile">
        JPG上传
      </el-button>
      <input type="file" id="sampleResetFile" style="display: none;" @change="uploadFileResetSample">
    </div>
    <div class="el-dialog-table el-div-review" v-show="resetItem.tableData.length >0">
      <drug-table  :filterPage="false" ref="taskResetTable" :tableData="resetItem.tableData" :tableLoading="item.tableLoading"
                   :tableHeader="resetItem.tableHeader"  >
      </drug-table>
    </div>

    <div slot="footer" v-show="submitBut"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini"
                 style="width: 80px;"
                 @click="takeTaskEvent"
                >
        提交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import drugTable from "@/components/table/editTable";
  export default {
    name:"myTask",
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
          sampleType:"",
          filePath:"",
          filePathName:"",
          resetPath:"",
          checkStatus:"",
          resetPathName:""
        },
        dialogAddVisible: false,
        count: 0,
        item:{
          tableData: [],
          tableHeader:[],
          tableLoading:true,
        },
        resetItem:{
          tableData: [],
          tableHeader:[],
        },

        submitBut:true

      }
    },
    mounted(){
      let self = this;
      self.$eventBus.$on("openMyTaskDialog",function (editData,operateType) {
        self.dialogAddVisible = true;
        self.count = 0;
        self.type = operateType;
        self.detailData = editData;
        self.getSampleItems();
        self.getSampleDetail();

      })
    },
    components:{
      drugTable
    },
    methods:{
      emitAutoInput(){
        this.$eventBus.$emit("autoInputJJ");
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
            for(let key in self.detailData){
              if(!resp.result.hasOwnProperty(key)){
                resp.result[key] = self.detailData[key];
              }
            }
            self.detailData = resp.result;
          }
        });
      },

      uploadSampleFile() {
        document.getElementById("sampleFile").click();
      },

      uploadSampleResetFile() {
        document.getElementById("sampleResetFile").click();
      },

      uploadFileSample(event){
        let self = this;
        let fileList = event.target.files;
        if (fileList.length > 0) {
          let file = fileList[0];
          if (/.(jpg|jpeg|png|gif)$/.test(file.name)) {
            let reader = new FileReader();
            self.detailData.filePathName = self.detailData.sampleId+"_"+file.name;
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              self.detailData.filePath = e.currentTarget.result;
            };
          } else {
            self.$notify({
              title: '提示',
              message: "上传文件必须是JPG！！",
              type: 'warning'
            });
          }
        }
      },
      uploadFileResetSample(event){
        let self = this;
        let fileList = event.target.files;
        if (fileList.length > 0) {
          let file = fileList[0];
          if (/.(jpg|jpeg|png|gif)$/.test(file.name)) {
            self.detailData.resetPathName = self.detailData.sampleId+"_reset_"+file.name;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              self.detailData.resetPath = e.currentTarget.result;
            };
          } else {
            self.$notify({
              title: '提示',
              message: "上传文件必须是JPG！！",
              type: 'warning'
            });
          }
        }
      },

      takeTaskEvent(){
        let self = this;
        if(!self.checkSample()){
          return;
        }
        let detailData = {
          sampleCode:this.detailData.sampleId,
          filePath:this.detailData.filePath,
          filePathName:this.detailData.filePathName,
          resetPath:this.detailData.resetPath,
          resetPathName:this.detailData.resetPathName,
          standardItems:[],
          standardResetItems:[]
        };
        let tableData = this.$refs.taskTable.getTableData();
        let params = [];
        for(let data of tableData){
          if(data.resultId && data.resultId.value){
            let resultId = data.resultId.value;
            if(resultId =='合格'){
              resultId = "Y";
            }
            if(resultId =='不合格'){
              resultId = "N";
            }

            let param = {testResult:data.testResult.value,id:data.id,resultId:resultId,testStaffId:self.$store.getters.userId,checkStatus:"SA"};
            params.push(param);
          }
        }
        detailData.standardItems = params;

        let tableResetData = this.$refs.taskResetTable.getTableData();
        let resetParams = [];
        for(let data of tableResetData){
          if(data.resultId && data.resultId.value){
            let resultId = data.resultId.value;
            if(resultId =='合格'){
              resultId = "Y";
            }
            if(resultId =='不合格'){
              resultId = "N";
            }
            let param = {id:data.id,resultId:resultId};
            resetParams.push(param);
          }
        }
        detailData.standardResetItems = resetParams;

        detailData.userId = self.$store.getters.userId;
        detailData.userName = self.$store.getters.userName;
        if (this.count == 0) {
          self.$http({
            url: "/drug/sampleItem/takeSampleItem",
            method: "post",
            data: JSON.stringify(detailData),
            dataType: 'json',
            contentType: "application/json",
          }).then(resp => {
            if (resp.success) {
              self.$notify({
                title: '提示',
                message: "操作成功！",
                type: 'success'
              });
              self.dialogAddVisible = false;
              self.insertFmApprove((resetParams.length > 0||self.detailData.checkStatus =='RJ')?"1":"");
              return
            }
            self.$notify({
              title: '提示',
              message: "出现异常，请联系管理员",
              type: 'error'
            });
            this.count--;
          });
          this.count++;
        }
      },

      insertFmApprove(type){
        let self = this;
        let param = {insertValue:type,sampleCode:self.detailData.sampleId,relateId:self.detailData.sId,type:"4"};
        self.$http({
          url: "/drug/sampleItem/insertFmApprove",
          method: "post",
          params:param
        }).then(resp => {
          self.$eventBus.$emit("updateDetectionList");
        });
      },

      checkSample(){
        let tableData = this.$refs.taskTable.getTableData();
        let resetData = this.$refs.taskResetTable.getTableData();
        for(let data of tableData){
          if(!data.resultId.value){
            this.$notify({
              title: '提示',
              message: "检测结果不能为空！",
              type: 'warning'
            });
            return false;
          }
        }
        for(let data of resetData){
          if(!data.resultId.value){
            this.$notify({
              title: '提示',
              message: "复检项结果不能为空！",
              type: 'warning'
            });
            return false;
          }
        }
        return true;
      },

      getSampleItems(){
        let self = this;
        self.item.tableLoading = true;
        // self.submitBut = false;
        self.submitBut = true;
        self.$http({
          url: "/drug/sampleItem/querySampleItemSend",
          method: "post",
          params:{sampleCode:self.detailData.sampleId}
        }).then(resp => {
          if (resp.success) {
            self.item.tableLoading = false;
            let datas = [];
            let datasId = [];
            for(let data of resp.result.items){
              if(data.testStaffId == self.$store.getters.userId){
                // if(!data.resultId){
                //   self.submitBut = true;
                // }
                data.testResult = {value:data.testResult,type:"input",edit:false};
                data.itemName = {value:data.itemName};
                data.itemQualityStandard = {value:data.itemQualityStandard};
                if(data.resultId == "Y"){
                  data.resultIdCn="合格";
                }
                if(data.resultId == "N"){
                  data.resultIdCn="不合格";
                }
                data.resultId = {value:data.resultIdCn,edit:false,type:"select"};
                // if(data.resultId){
                //   data.resultId = {value:data.resultIdCn,type:"select"};
                // }else{
                //   data.resultId = {value:data.resultIdCn,edit:false,type:"select"};
                // }
                datas.push(data);
                datasId.push(data.id);
              }
            }
            self.item.tableData = datas;
            self.item.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "testResult", "coloumNameCn": "检验结果"},
              {"columnName": "resultId", "coloumNameCn": "判定结果"},
               ];

            let resetDatas = [];
            for(let data of resp.result.itemResets){
              if(datasId.indexOf(data.sampleItemId) > -1){
                if(!data.resultId){
                  self.submitBut = true;
                }
                data.itemName = {value:data.itemName};
                data.itemQualityStandard = {value:data.itemQualityStandard};
                if(data.resultId == "Y"){
                  data.resultIdCn="合格";
                }
                if(data.resultId == "N"){
                  data.resultIdCn="不合格";
                }
                if(data.resultId){
                  data.resultId = {value:data.resultIdCn,type:"select"};
                }else{
                  data.resultId = {value:data.resultIdCn,edit:false,type:"select"};
                }
                resetDatas.push(data);
              }
            }
            self.resetItem.tableData = resetDatas;
            self.resetItem.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "resultId", "coloumNameCn": "检验结果"} ];

          }
        });
      }
    }
  }
</script>
