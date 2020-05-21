<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             :close-on-click-modal="false"
             width="55%"
             title="检验方法 · 审批">

    <div class="dialog-title"><span style="margin-left:25px">检验方法审批</span>
      <img src="../../../assets/img/bohui.png" v-if="detailData.checkStatus == '4'" style="display: inline;float: right;margin-top: -19px; width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
      <img src="../../../assets/img/disapprove.jpg" v-else-if="detailData.checkStatus == '2'" style="display: inline;float: right;margin-top: -19px;width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
      <img v-else src="../../../assets/img/approve.jpg" style="display: inline;float: right;margin-top: -19px;width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
    </div>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>检项名称<i class="i_colon">：</i></label><span>{{detailData.itemName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">申请号</label><i class="i_colon">：</i><span>{{detailData.id}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>方法依据<i class="i_colon">：</i></label><span>{{detailData.methodJudge}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w2">部门</label><i class="i_colon">：</i><span>{{detailData.deptName}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>方法类别<i class="i_colon">：</i></label><span>{{detailData.methodTypeName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">申请人</label><i class="i_colon">：</i><span>{{detailData.userName}}</span></div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>方法名称<i class="i_colon">：</i></label><span>{{detailData.methodName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>申请时间<i class="i_colon">：</i></label><span>{{detailData.createTimeFt}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>方法编号<i class="i_colon">：</i></label><span>{{detailData.methodCode}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w2">工时</label><i class="i_colon">：</i><span>{{detailData.manHour}}</span></div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>方法属性<i class="i_colon">：</i></label><span>{{detailData.codeAttrName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w2">版本</label><i class="i_colon">：</i><span>{{detailData.methodVersion}}</span></div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24"
              style="margin-top:5px">
        <div class="el-dialog-item"
             style="display: block;"><label>检验方法<i class="i_colon">：</i></label>
          <!--<el-input clearable  type="textarea"-->
                    <!--maxlength="200"-->
                    <!--:rows="4"-->
                    <!--disabled-->
                    <!--style="width: 100%"-->
                    <!--size="small"-->
                    <!--v-model="detailData.methodDescSummary"> </el-input>-->
                   
               <!--<Tinymce v-if="dialogAddVisible" v-model="detailData.methodDescSummary" :readonly="true"></Tinymce>-->
          <quill-editor ref="text" disabled  v-model="detailData.methodDescSummary" class="myQuillEditor"  />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24"
              style="margin-top:5px">
        <div class="el-dialog-item"
             style="display: block;"><label>检验记录<i class="i_colon">：</i></label>
          <!--<el-input clearable  type="textarea"-->
                    <!--maxlength="200"-->
                    <!--:rows="4"-->
                    <!--disabled-->
                    <!--style="width: 100%"-->
                    <!--size="small"-->
                    <!--v-model="detailData.testRecordSummary"> </el-input>-->
                    
               <!--<Tinymce v-if="dialogAddVisible" v-model="detailData.testRecordSummary" :readonly="true"></Tinymce>-->
          <quill-editor ref="text" disabled  v-model="detailData.testRecordSummary" class="myQuillEditor"  />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24"
              style="margin-top:5px">
        <div class="el-dialog-item"
             style="display: block;"><label>审批意见<i class="i_colon">：</i></label>
          <el-input clearable  type="textarea"
                    maxlength="200"
                    :disabled="detailData.checkStatus != '2'"
                    :rows="2"
                    style="width: 100%"
                    size="small"
                    v-model="detailData.content"> </el-input>
        </div>
      </el-col>
    </el-row>

    <div slot="footer" v-if="hasRole('standard:check:do')&& detailData.checkStatus == '2'"
         class="dialog-footer">
      <el-button type="red"
                 size="mini" @click="submitCheck('4')"
                 style="width: 80px;">
        驳回
      </el-button>
      <el-button type="green"
                 size="mini" @click="submitCheck('5')"
                 style="width: 80px;margin-left:30%">
        批准
      </el-button>

    </div>
  </el-dialog>
</template>
<script>
	import Tinymce from '@/components/TinymceNew/index'
  import drugTable from "@/components/table/index";
  import {getToken} from '@/utils/auth' // 验权
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'


  export default {
    name:"testMethodDialog",
    components:{drugTable,quillEditor,Tinymce},
    props:[],
    data(){
      return{
        detailData: {
          id: "",
          itemName:"",
          methodTypeName: "",
          methodName: "",
          methodCode: "",
          codeAttrId: "",
          manHour: "",
          methodVersion: "",
          testRecord: "",
          methodDesc: "",
          methodJudge: "",
          remark:"",
          content:""
        },
        dialogAddVisible: false,
        count: 0,
        loginList:[],
        user:{}
      }
    },
    mounted(){
      let self = this;
      let user = JSON.parse(getToken());
      this.user = user;
      self.$eventBus.$on("openTestMethodApproveDialog",function (editData) {
        self.dialogAddVisible = true;
        self.count = 0;
        self.detailData = editData;
      })
    },
    methods:{

      submitCheck(checkStatus) {
        let self = this;
        let param = {
          userName:self.user.userName,
          userId:self.user.id,
          content:self.detailData.content,
          id:self.detailData.fId,
          relateId:self.detailData.id,
          checkStatus:checkStatus,
        };
        if (this.count == 0) {
          self.$http({
            url: "/drug/fmApprove/updateMethodFmApprove",
            method: "post",
            params:param
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateTestMethodApprove");
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
