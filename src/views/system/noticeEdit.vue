<template>
  <el-dialog width="50%" append-to-body :title="type == 'add'?'新增·发布':'编辑·发布'"
             :close-on-click-modal="clickModalHide"
             :before-close="closeDialog"
             :visible.sync="centerDialogVisible"
        >
    <div class="dialog-title">
	  	<span v-if="type=='add'">新增发布</span>
	  	<span v-else style='color:#cb0000'>编辑发布</span>
    </div>
    <el-divider></el-divider>
    <div>
      <el-form ref="dataForm"
               :model="messageData"
               label-position="left"
               size="mini"
               label-width="0px">

        <el-row>
          <el-col :span="12">
            <div class="el-dialog-item"><label class="w2">日期</label><label><i class="i_colon">：</i></label>
              <el-date-picker v-model="createTime" disabled
                              size="mini"
                              type="date"
                              style="width: 140px;"></el-date-picker>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="el-dialog-item el-form-right"><label class="w3"
                                                             style="margin-right:-0.5em">发布人</label><i class="i_colon">：</i>
              <el-input clearable  v-model="userName"  disabled
                        size="mini"
                        style="width: 140px;" />
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="el-dialog-item"
                 style="display:flex"><label class="w3">主题</label><label><i class="i_colon">：</i></label>
              <el-input clearable  v-model="messageData.title"
                        size="mini"
                        style="width:92%" />
            </div>
          </el-col>
        </el-row>
        <quill-editor ref="text" v-model="messageData.content" class="myQuillEditor"  />
      </el-form>
      <div slot="footer"
           class="dialog-footer"
           style="margin-top:40px">
        <el-button type="primary" @click="updateNotice('0')"
                   size="mini"
                   style="width: 80px;"
                   :class="messageData.publishStatus =='1'?'disabled_btn':''"
          >
          暂 存
        </el-button>
        <el-button type="green"
                   size="mini"
                   :class="messageData.publishStatus =='1'?'disabled_btn':''"
                   style="width: 80px;margin-left:30%"  @click="updateNotice('1')">
          发 布
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import { getToken } from '@/utils/auth' // 验权
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    name:"noticeEdit",
    props:["detailData","type"],
    components:{quillEditor},
    data(){
      return{
        messageData:{publishId:"",title:"",content:""},
        centerDialogVisible: false,
        clickModalHide: false,
        count:0,
        userName:"",
        createTime:new Date()
      }
    },

    methods:{

      closeDialog() {
        this.centerDialogVisible = false;
      },

        updateNotice(publishStatus){
          let self = this;
          let url = this.type == 'add' ? "/drug/notice/addNotice" : "/drug/notice/updateNotice";
          self.messageData.publishStatus = publishStatus;
          if (this.count == 0) {
            self.$http({
              url: url,
              method: "post",
              data: JSON.stringify(self.messageData),
              dataType: 'json',
              contentType: "application/json",
            }).then(resp => {
              if (resp.success) {
                self.$eventBus.$emit("updateNTList");
                self.$notify({
                  title: '提示',
                  message: "操作成功！",
                  type: 'success'
                });
                self.centerDialogVisible = false;
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
        }
    },
    watch:{
      detailData(val){
        let user = JSON.parse(getToken());
        this.count = 0;
        this.messageData = val;
        this.centerDialogVisible = true;
        delete this.messageData.createTime;
        this.messageData.publishId = user.id;
        this.userName = user.userName;
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-button.disabled_btn {
    pointer-events: none;
    cursor: not-allowed;
    background-color: #7e8c8d !important;
    border:  #7e8c8d !important;
  }
  .el-dialog .el-button--primary {
    background-color: #d09c4f;
    border-color: #d09c4f;
    border-radius: 3px;
    padding: 5px 10px;
    &:hover {
    background-color: #d09c4f;
    border-color: #d09c4f;
    	opacity: .8;
    }
  }
</style>

