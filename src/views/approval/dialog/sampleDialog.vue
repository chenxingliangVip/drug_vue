<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             width="42%"
             :close-on-click-modal="false"
             :title="detailData.checkStatus =='3'?'复检 · 审批':'检验报告·审批'" class="standard_Dialog">

    <div class="dialog-title"><span style="color:#cb0000;margin-left:25px">{{detailData.checkStatus =='3'?'复检审批':'检验报告审批'}}</span>
      <img src="../../../assets/img/bohui.png" v-if="detailData.checkStatus == '4'" style="display: inline;float: right;margin-top: -19px; width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
      <img src="../../../assets/img/disapprove.jpg" v-else-if="detailData.checkStatus == '2'||detailData.checkStatus == '3'" style="display: inline;float: right;margin-top: -19px; width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
      <img v-else src="../../../assets/img/approve.jpg" style="display: inline;float: right;margin-top: -19px;width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
    </div>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>物料编码<i class="i_colon">：</i></label><span>{{detailData.materialCode}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">检验号</label><i class="i_colon">：</i><span>{{detailData.sampleCode}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品名称<i class="i_colon">：</i></label><span>{{detailData.materialName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规格<i class="i_colon">：</i></label><span>{{detailData.materialType}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品等级<i class="i_colon">：</i></label><span>{{detailData.materialGrade}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">申请人</label><i class="i_colon">：</i><span>{{detailData.userName}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规模<i class="i_colon">：</i></label><span>{{detailData.sampleTypeName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>送样地点<i class="i_colon">：</i></label><span>{{detailData.locationName}}</span></div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品批号<i class="i_colon">：</i></label><span>{{detailData.sampleNum}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>申请时间<i class="i_colon">：</i></label><span>{{detailData.createTimeFt}}</span></div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24"
              style="margin-top:10px;">
        <div class="el-dialog-item"><label>标准编号<i class="i_colon">：</i></label><span>{{detailData.standardCode}}</span></div>
      </el-col>
    </el-row>

    <div class="flex-row-space-between"
         style="margin:0">
      <div style="line-height:16px;"><span style="color:#878989">检项<i class="i_colon">：</i></span></div>
    </div>
    <div class="el-dialog-table el-div-version"
         style="border: 0px; margin-top: 0px;">

      <drug-table  :filterPage="false" ref="approveItemTable" :tableData="item.tableData" :tableLoading="item.tableLoading"
                   :tableHeader="item.tableHeader"  >
      </drug-table>


    </div>
    <el-row>
      <el-col :span="24"
              style="margin-top:10px;">
        <div class="el-dialog-item"><label>结果判定<i class="i_colon">：</i></label><span>{{detailData.finalResult}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="el-dialog-item">
          <div><label class="dialogTxt">审批意见<i class="i_colon">：</i></label></div>
          <el-input clearable  type="textarea" :disabled="(detailData.checkStatus != '2' && detailData.checkStatus != '3') || resetItem.tableData.length > 0"
                    maxlength="200"
                    :rows="2"
                    size="small"
                    placeholder="请输入500字内的审批意见"
                    v-model="detailData.content">
          </el-input>
        </div>
      </el-col>
    </el-row>
    <div v-show="resetItem.tableData.length > 0">
      <div class="flex-row-space-between"
           style="margin:0">
        <div style="line-height:16px;"><span style="color:#cb0000">复检项<i class="i_colon">：</i></span></div>

      </div>
      <div class="el-dialog-table el-div-version"
           style="border: 0px; margin-top: 0px;">

        <drug-edit-table  :filterPage="false" ref="taskResetTable" :tableData="resetItem.tableData" :tableLoading="item.tableLoading"
                     :tableHeader="resetItem.tableHeader"  >
        </drug-edit-table>

      </div>
      <el-row  v-show="detailData.checkStatus!='3'">
        <el-col :span="24"
                style="margin-top:10px">
          <div class="el-dialog-item"><label style="color:#cb0000">复检判定<i class="i_colon">：</i></label>
            <el-radio-group v-model="detailData.result">
              <el-radio label="1">无误</el-radio>
              <el-radio label="2">偏差</el-radio>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
    </div>

    <div slot="footer" v-show="detailData.checkStatus == '3'||detailData.checkStatus == '2'"
         class="dialog-footer ">
      <el-button type="red"
                 size="mini"
                 style="width: 80px;" @click="submitCheck('4')"
                >
        驳回
      </el-button>
      <el-button type="primary" v-if="resetItem.tableData.length > 0" @click="submitCheck('5')"
                 size="mini"
                 style="width: 120px;margin-left:20%"
                >
        复检批准
      </el-button>
      <el-button type="green" v-else @click="submitCheck('5')"
                 size="mini"
                 style="width: 80px;margin-left:30%"
                >
        批准
      </el-button>

    </div>
  </el-dialog>
</template>
<script>
  import {getToken} from '@/utils/auth' // 验权
  import drugTable from "@/components/table/index";

  import drugEditTable from "@/components/table/editTable";
  export default {
    name:"sampleDialog",
    components:{drugTable,drugEditTable},
    data(){
      return{
        detailData: {
          sampleCode:"",
          materialCode:"",
          materialName:"",
          deptName:"",
          materialGrade:"",
          userName:"",
          sampleType:"",
          location:"",
          sampleNum:"",
          createTimeFt:"",
          standardCode:"",
          result:"",
          finalResult:"",
          content:""
        },
        dialogAddVisible: false,
        count: 0,
        user:{},
        type:"",
        item:{
          tableData: [],
          tableHeader:[],
          tableLoading:true,
        },
        resetItem:{
          tableData: [],
          tableHeader:[],
        },

      }
    },
    mounted(){
      let self = this;
      let user = JSON.parse(getToken());
      this.user = user;
      self.$eventBus.$on("openSampleApproveDialog",function (editData,type) {
        self.dialogAddVisible = true;
        self.count = 0;
        self.getAllSampleCode(editData.sampleId);
      })
    },
    methods:{

      submitCheck(checkStatus) {
        let self = this;
        if('4' == checkStatus &&(!self.detailData.content ||!self.detailData.content.trim())){
          self.$notify({
            title: '提示',
            message: "请填写驳回原因！",
            type: 'warning'
          });
          return;
        }
        if(self.detailData.checkStatus == '3'){
          checkStatus = checkStatus =='5' ?'7':'';
        }
        let param = {userName:self.user.userName,userId:self.user.id,sampleCode:self.detailData.sampleCode,id:self.detailData.fId,result:self.detailData.result,content:self.detailData.content,checkStatus:checkStatus};
        if('4' == checkStatus){
          param.refusCount = self.detailData.refusCount+1;
        }
        if (this.count == 0) {
          self.$http({
            url: "/drug/fmApprove/updateSampleFmApprove",
            method: "post",
            params:param
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateSampleApprove");
              self.$notify({
                title: '提示',
                message: "操作成功！",
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
          this.count++;
        }

      },

      getAllSampleCode(sampleId) {
        let self = this;
        self.item.tableLoading = true;
        self.$http({
          url: "/drug/fmApprove/querySampleFmApproveDetail",
          method: "post",
          params:{sampleCode:sampleId}
        }).then(resp => {
          if (resp.success) {
            self.item.tableLoading = false;
            resp.result.result = resp.result.result?resp.result.result:"1";
            self.detailData = resp.result;
            self.detailData.finalResult = "合格";
            for(let data of self.detailData.standardItems){
              if(data.resultId == "Y"){
                data.resultIdCn="合格";
              }
              if(data.resultId == "N"){
                data.resultIdCn="不合格";
                self.detailData.finalResult = "不合格";
              }
            }
            self.item.tableData = self.detailData.standardItems;
            self.item.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "testResult", "coloumNameCn": "检验结果"},
              {"columnName": "resultIdCn", "coloumNameCn": "结果判定"},
              {"columnName": "userName", "coloumNameCn": "检验人"},
              ];
            let resetDatas = [];
            for(let data of resp.result.standardResetItems){
              data.itemName = {value:data.itemName};
              data.itemQualityStandard = {value:data.itemQualityStandard};
              if(data.resultId == "Y"){
                data.resultIdCn="合格";
              }
              if(data.resultId == "N"){
                data.resultIdCn="不合格";
              }
              // if(data.resultId){
              //   data.resultId = {value:data.resultIdCn,type:"select"};
              // }else{
              //   data.resultId = {value:data.resultIdCn,edit:false,type:"select"};
              // }
              data.resultId = {value:data.resultIdCn,type:"select"};
              resetDatas.push(data);
            }

            self.resetItem.tableData = resetDatas;
            self.resetItem.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "resultId", "coloumNameCn": "检验结果"} ];
          }
        });
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
    border-radius: 3px;
    padding: 5px 10px;
  }

  .el-button .svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
.dialog-title {
	img {
		width: 80px;
		position: absolute !important;
		right: 20px;
		top: 47px;
		margin-top: 0 !important;
    background: #fff;
	}
}
</style>
