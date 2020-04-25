<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             width="40%"
             title="查看·样检">
    <div class="el-form-no">
    	<img class="NoImg" src="../../../assets/img/noNum.png" />{{detailData.sampleCode}}
    </div>
    <div class="dialog-title"><span style='color:#000'><i class="el-icon-view"></i> 检样结果速览</span></div>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规格：</label><span>{{detailData.materialTypeId}}</span></div>
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
        <div class="el-dialog-item"><label>物料编码：</label><span>{{detailData.materialCode}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>送样地点：</label><span>{{detailData.locationName}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="el-dialog-item"><label>样品等级：</label><span>{{detailData.materialGradeId}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规模：</label><span>{{detailData.sampleTypeName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品批号：</label><span style="width: 100px">{{detailData.sampleNum}}</span></div>
      </el-col>
    </el-row>
    <div class="flex-row-space-between"
         style="margin:10px 0 3px 0;">
      <div style="line-height:20px;"><span style="color:#878989">检项选择：</span></div>
      <el-button :type="isCheckSelect? 'red':'info'" @click="changeCheck" v-if="buttonShow"
                 size="mini"
                 style="width: 60px; height:20px; min-height:20px;">
        复检
      </el-button>
    </div>
    <div class="el-dialog-table">
      <drug-table  @getSelection="getSelection" :filterPage="false" :isMultipleSelection="true"
                   :tableData="tableData" :tableLoading="tableLoading"
                   :tableHeader="tableHeader"  >
      </drug-table>
    </div>
    <div>
      <div style="color:#878989;padding:10px 0 3px 0"><span>复检原因：</span></div>
      <div>
        <el-input clearable  type="textarea"
                  maxlength="300"
                  :rows="2"
                  size="small" v-model="detailData.remark"
                  :disabled="!isCheckSelect || !buttonShow"
                  placeholder="请输入300字内的原因">
        </el-input>
      </div>
    </div>
    <div slot="footer" v-show="isCheckSelect && buttonShow"
         class="dialog-footer">
      <el-button type="red" @click="updateSendDetail"
                 size="mini"
                 style="width: 80px;">
        提交复检
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {getToken} from '@/utils/auth' // 验权
  import { formatDate } from '@/utils/formatDate'
  import drugTable from "@/components/table/index";

  export default {
    name: "sendSee",
    components:{drugTable},
    data() {
      return {
        user: {deptName: "", userName: ""},
        detailData: {
          sampleCode:"",
          locationName:"",
          finalProduct:"",
          sampleTypeName:"",
          materialName:"",
          materialCode:"",
          sampleNum:"",
          createTime:""
        },
        dialogAddVisible: false,
        count: 0,

        selectChoice:[],

        tableData: [],
        tableHeader:[],
        tableLoading:true,

        isCheckSelect:false,

        buttonShow:false,

        resetItem:[]
      }
    },
    mounted() {
      let self = this;
      let user = JSON.parse(getToken());
      this.user = user;
      self.$eventBus.$on("openSendSee",function (editData) {
        let time = (new Date()).getTime();
        let stamp = (time - editData.updateTime)/(1000*3600);
        self.detailData = editData;
        self.dialogAddVisible = true;
        self.count = 0;
        self.buttonShow = (editData.checkStatus == '4'||editData.checkStatus == '5')?true:false;
        self.buttonShow = (self.buttonShow && (stamp < 72)) ?true:false;
        self.buttonShow = (self.buttonShow && (self.detailData.userId == self.$store.getters.userId)) ?true:false;
        self.getSampleItems();
      })
    },
    methods: {

      changeCheck(){
        if(this.detailData.userId == this.$store.getters.userId){
          this.isCheckSelect = !this.isCheckSelect;
        }
      },

      getSelection(val){
        this.selectChoice = val;
      },


      showTip(msg){
        let self = this;
        self.$notify({
          title: '提示',
          message: msg,
          type: 'warning'
        });
      },
      updateSendDetail(){
        let self = this;
        if(!self.checkReset()){
          return;
        }
        let standardItems = [];
        for(let data of this.selectChoice){
          let o = {sampleItemId:data.id,sampleId:data.sampleId,itemName:data.itemName,itemQualityStandard:data.itemQualityStandard};
          standardItems.push(o);
        }
        let param = {sampleCode:this.selectChoice[0].sampleId,id:self.detailData.id,remark:self.detailData.remark,standardResetItems:standardItems,checkStatus:"3"};
        if (this.count == 0) {
          self.$http({
            url: "/drug/sample/addResetSampleItem",
            method: "post",
            data: JSON.stringify(param),
            dataType: 'json',
            contentType: "application/json",
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateSampleList");
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

      checkReset(){
        if(this.selectChoice.length == 0){
          this.showTip("请选择复检项");
          return false;
        }
        for(let data of this.selectChoice){
          if(this.resetItem.length > 0){
            if(this.resetItem.indexOf(data.id) > -1){
              this.showTip(data.itemName+"已经复检过");
              return false;
            }
          }
          // if(data.resultId == 'Y'){
          //   this.showTip("检验项合格，无需复检");
          //   return false;
          // }
          if(!data.resultId ){
            this.showTip("检验项未检测，无需复检");
            return false;
          }
        }
        return true;
      },

      getSampleItems(){
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/sampleItem/querySampleItemSend",
          method: "post",
          params:{sampleCode:self.detailData.sampleCode}
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            for(let data of resp.result.items){
              if(data.resultId == "Y"){
                data.resultIdCn="合格";
              }
              if(data.resultId == "N"){
                data.resultIdCn="不合格";
              }
              if(data.resultId ){
                self.isCheckSelect = true;
              }
            }
            if(self.detailData.userId != self.$store.getters.userId){
              self.isCheckSelect = false;
            }
            self.tableData = resp.result.items;
            self.resetItem = [];
            for(let rd of resp.result.itemResets){
              self.resetItem.push(rd.sampleItemId);
            }
            self.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "resultIdCn", "coloumNameCn": "检测结果"},
            ];
          }
        });
      }
    },
    watch: {

    }
  }
</script>
<style lang="scss" scoped>
  .el-form-no {
    text-align: right;
    font-size: 18px;
    color: #cb0000;
  }

  .el-dialog .el-button--primary {
    background-color: #2e827f;
    border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
  }
	.NoImg {
  	width: 30px
  }
</style>
