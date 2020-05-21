<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             :close-on-click-modal="false"
             width="55%"
             :title="titleTxt + '·检验方法'" class="standard_Dialog">
    <el-form ref="dataForm"
             label-position="left"
             size="mini"
             label-width="0px">
      <div class="dialog-title">
      	<span v-if="type == 'xd' || type == 'edit'" style="color: #cb0000 !important">{{titleTxt}}检验方法 </span>
      	<span v-else-if="type == 'see'" >{{titleTxt}}检验方法</span>
      	<span v-else style="color: #2e827f !important">{{titleTxt}}检验方法</span>
      </div>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item"><label class="dialogTxt">检项名称<i class="i_colon">：</i></label>
            <el-select v-model="methodData.itemName" v-if="type == 'add' || type == 'edit'"
                       size="mini"
                       clearable
                       filterable
                       style="width: 140px">
              <el-option v-for="item in testItems"
                         :key="item.id"
                         :label="item.itemName"
                         :value="item.itemName"/>
            </el-select>
            <span v-else>{{methodData.itemName?methodData.itemName:"无"}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right"><label class="w3"
                                                           style="margin-right:-0.5em">申请号</label><i class="i_colon">：</i>
            <el-input clearable  v-model="formNo"
                      size="mini"
                      disabled
                      style="width: 140px;"/>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item"><label class="dialogTxt">方法依据<i class="i_colon">：</i></label>
            <el-input clearable  v-model="methodData.methodJudge"  v-if="type == 'add' || type == 'edit'"
                      size="mini"
                      style="width: 140px;"/>
            <span v-else>{{methodData.methodJudge?methodData.methodJudge:"无"}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right"><label class="w2"
                                                           style="margin-right:-2em">部门</label><i class="i_colon">：</i>
            <el-input clearable  v-model="user.deptName" disabled
                      size="mini"
                      style="width: 140px;"/>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item"><label class="dialogTxt">方法类别<i class="i_colon">：</i></label>
            <el-select v-model="methodData.methodType" v-if="type == 'add' || type == 'edit'"
                       size="mini"
                       clearable
                       style="width: 140px">
              <el-option v-for="item in methodTypeMap"
                         :key="item.id"
                         :label="item.itemName"
                         :value="item.itemName"/>
            </el-select>
            <span v-else>{{methodData.methodType?methodData.methodType:"无"}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right"><label class="w3"
                                                           style="margin-right:-0.5em">申请人</label><i class="i_colon">：</i>
            <el-input clearable  v-model="user.userName" disabled
                      size="mini"
                      style="width: 140px;"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item"><label class="dialogTxt">方法名称<i class="i_colon">：</i></label>
            <el-input clearable  v-model="methodData.methodName" v-if="type == 'add' || type == 'edit'"
                      size="mini"
                      style="width: 140px;"/>
            <span v-else>{{methodData.methodName}}</span>

          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right"><label>申请时间<i class="i_colon">：</i> </label>
            <el-date-picker v-model="nowTime"
                            disabled
                            size="mini"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            style="width: 140px;">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="el-dialog-item"><label class="dialogTxt">方法编号<i class="i_colon">：</i></label>
            <el-input clearable  v-model="methodData.methodCode" :disabled="type =='see'"
                      size="mini"
                      style="width: 140px;"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item"><label class="dialogTxt">方法属性<i class="i_colon">：</i></label>
            <el-select v-model="methodData.codeAttrId" :disabled="type != 'add' && type != 'edit'"
                       size="mini"
                       clearable
                       style="width: 140px">
              <el-option v-for="item in codeAttrs"
                         :key="item.id"
                         :label="item.itemName"
                         :value="item.id"/>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right"><label>工时<i class="i_colon">：</i></label>
            <el-input clearable  v-model="methodData.manHour"  :disabled="type =='see'"
                      size="mini"
                      type="number"
                      style="width: 140px;"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item"
               style="height:20px;"><label>检验方法<i class="i_colon">：</i></label>

          </div>
        </el-col>
        <el-col :span="12"
                class="el-button-version">
          <div class="el-dialog-item el-form-right"><label>版本<i class="i_colon">：</i></label>
            <el-select v-model="methodData.methodVersion" v-show="isCheckSelect"
                       size="mini"
                       clearable
                       style="width: 140px">
              <el-option v-for="item in versionList"
                         :key="item.id"
                         :label="item.versionName"
                         :value="item.versionName"/>
            </el-select>
            <el-input clearable  v-model="methodData.methodVersion" v-show="!isCheckSelect"
                      size="mini"
                      disabled
                      style="width: 140px;"/>
          </div>
          <el-button :type="isCheckSelect? 'primary':'info'"
                     size="mini"
                     style="width: 16px; height:16px; min-height:16px;font-size:8px;margin:2px 10px 0 0"
                     @click="checkStatus">
            正
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="el-dialog-item"
               style="margin-bottom:0px;">
               <!--<Tinymce v-if="dialogAddVisible" :readonly="type =='see'" v-model="methodData.methodDesc"></Tinymce>-->
            <quill-editor ref="editMethod" @change="onEditorChangeDesc"  :disabled="type =='see'" v-model="methodData.methodDesc" class="myQuillEditor"  />
            <!--<vue-ueditor-wrap ref="editMethod" v-model="methodData.methodDesc"  :disabled="type =='see'"></vue-ueditor-wrap>-->
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="el-dialog-item"
               style="margin-top:10px;"><label>检测记录 <i class="i_colon">：</i></label></div>
               <!--<Tinymce v-if="dialogAddVisible" :readonly="type =='see'" v-model="methodData.testRecord"></Tinymce>-->
          <quill-editor ref="editRecord" @change="onEditorChangeRecord"  :disabled="type =='see'" v-model="methodData.testRecord" class="myQuillEditor"  />
          <!--<vue-ueditor-wrap ref="editRecord"  v-model="methodData.testRecord" :disabled="type =='see'"></vue-ueditor-wrap>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="el-dialog-item"
               style="margin-top:10px;"><label>补充说明 <i class="i_colon">：</i></label></div>
          <el-input clearable
            type="textarea"
            :rows="2"
            :disabled="type =='see'"
            placeholder="请输入内容"
            v-model="methodData.remark">
          </el-input>

        </el-col>
      </el-row>
      <el-row v-show="methodData.checkStatus=='1'">
        <el-col :span="24">
          <div class="el-dialog-item"
               style="margin-top:10px;">
            <label>审批意见 <i class="i_colon">：</i></label>
            {{applyReason}}
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" v-show="type !='see'"
         class="dialog-footer">
      <el-button type="green"
                 size="mini"
                 @click="updateTestMethod"
                 style="width: 80px;">
        提 交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
	import Tinymce from '@/components/TinymceNew/index'
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { getToken } from '@/utils/auth' // 验权

  export default {
    name: "method",
    props: ["editData","type"],
    components: {quillEditor,Tinymce},
    data() {
      return {
         titleTxt: '',
          methodData: {
          id: "",
          itemName:"",
          methodType: "",
          methodName: "",
          methodCode: "",
          codeAttrId: "",
          manHour: "",
          methodVersion: "",
          testRecord: "",
          methodDesc: "",
          methodJudge: "",
          remark: "",
        },
        formNo:"提交生成",
        isCheckSelect:false,
        nowTime:new Date(),
        dialogAddVisible: false,
        count:0,
        user:{deptId:"",userName:""},
        methodTypeMap:[],
        codeAttrs:[],
        versionList:[],
        testItems:[],
        applyReason:"",
        editorConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 300,
          // 初始容器宽度
          initialFrameWidth: '100%',

          serverUrl: '/api/uploadPic',
        }
      }
    },
    mounted(){
      let user = JSON.parse(getToken());
      this.user = user;
      this.getCodeAttrList();
      this.getCodeItemList();
      this.getVersionList();
      this.getCodeTypeList();

    },
    methods: {
      onEditorChangeRecord({ editor, html, text }){
        this.methodData.testRecordSummary = text;
      },
      onEditorChangeDesc({ editor, html, text }){
        this.methodData.methodDescSummary = text;
      },
      checkStatus() {
        this.isCheckSelect = !this.isCheckSelect;
        this.methodData.methodVersion = "";
        if(!this.isCheckSelect){
          this.methodData.methodVersion = "S0";
        }
      },
      getCodeAttrList() {
        let self = this;
        self.$http({
          url: "/drug/codeItem/queryCodeItemList",
          method: "post",
          params: {itemCode: "method_attr"}
        }).then(resp => {
          if (resp.success) {
            self.codeAttrs = resp.result;
          }
        });
      },
      getCodeItemList() {
        let self = this;
        self.$http({
          url: "/drug/codeItem/queryCodeItemList",
          method: "post",
          params: {itemCode: "test_item"}
        }).then(resp => {
          if (resp.success) {
            self.testItems = resp.result;
          }
        });
      },
      getCodeTypeList() {
        let self = this;
        self.$http({
          url: "/drug/codeItem/queryCodeItemList",
          method: "post",
          params: {itemCode: "method_type"}
        }).then(resp => {
          if (resp.success) {
            self.methodTypeMap = resp.result;
          }
        });
      },
      getVersionList() {
        let self = this;
        self.$http({
          url: "/drug/version/queryVersionList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.versionList = resp.result;
          }
        });
      },
      checkValue(){
        if(!this.methodData.methodName){
          this.showTip("请输入方法名称！");
          return false;
        }
        if(!this.methodData.methodCode){
          this.showTip("请输入方法编号！");
          return false;
        }
        if(!this.methodData.codeAttrId){
          this.showTip("请输入方法属性！");
          return false;
        }
        if(!this.methodData.manHour){
          this.showTip("请输入工时！");
          return false;
        }
        if(!this.methodData.methodVersion){
          this.showTip("请输入版本号！");
          return false;
        }
        if(!this.methodData.testRecord){
          this.showTip("请输入检测方法！");
          return false;
        }
        if(!this.methodData.methodDesc){
          this.showTip("请输入检测记录！");
          return false;
        }
        return true;
      },
      showTip(msg){
        let self = this;
        self.$notify({
          title: '提示',
          message: msg,
          type: 'warning'
        });
      },
      updateTestMethod(){
        let self = this;
        if(!self.checkValue()){
          return;
        }
        delete self.methodData.createTime;
        delete self.methodData.updateTime;
//				var activeEditor = tinymce.editors[0];
//				var editBody = activeEditor.getBody();
//				activeEditor.selection.select(editBody);
//				var text = activeEditor.selection.getContent( { 'format' : 'text' } );
//
//				var activeEditor1 = tinymce.editors[1];
//				var editBody1 = activeEditor1.getBody();
//				activeEditor1.selection.select(editBody1);
//				var text1 = activeEditor1.selection.getContent( { 'format' : 'text' } );
        //给方法放出编辑用的  为了不走审核
        self.methodData.oldStatus = self.methodData.checkStatus;
        self.methodData.checkStatus = '0';
        self.methodData.userId = self.$store.getters.userId;
        self.methodData.userName = self.$store.getters.userName;
        // self.methodData.testRecordSummary = self.$refs.editRecord.getContents();
        // self.methodData.methodDescSummary = self.$refs.editMethod.getContents();

//				self.methodData.testRecordSummary = text;
//				self.methodData.methodDescSummary = text1;
        self.methodData.status = '0';
        let url = (this.type == 'add'||this.type=='xd') ? "/drug/testMethod/addTestMethod" : "/drug/testMethod/updateTestMethod";
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            data: JSON.stringify(self.methodData),
            dataType: 'json',
            contentType: "application/json",
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateTestMethodList");
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
      getApplyReason() {
        let self = this;
        self.$http({
          url: "/drug/fmApprove/queryFmApproveByRelateId",
          method: "post",
          params:{relateId:self.methodData.id}
        }).then(resp => {
          if (resp.success) {
            self.applyReason = resp.result.content;
          }
        });
      }
    },
    watch: {
      editData(val){
        this.count = 0;
        this.dialogAddVisible = true;
        for (let key in this.methodData) {
          if (!val.hasOwnProperty(key)) {
            this.$set(val,key,"");
          }
        }
        this.methodData = val;
        if(this.type != 'add'){
          this.formNo = val.id;
        }
        if(this.type =='edit'){
          this.getApplyReason();
        }
    		if(this.type =='xd'){
	      	this.titleTxt = "修订"
	      }else if(this.type == 'edit'){
	      	this.titleTxt = "修改"
	      }else if(this.type == 'add'){
	      	this.titleTxt = "新增"
	      }else if(this.type == 'see'){
	      	this.titleTxt = "查看"
	      }
      },
    }
  }
</script>
<style scoped>
	.el-dialog .el-button--primary {
    background-color: #2e827f;
    border-color: #2e827f;
    border-radius:3px;
  }
</style>
