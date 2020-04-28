<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             width="35%"
             :close-on-click-modal="false"
             :title="type == 'add'?'新增·存样':'修改·存样'" class="standard_Dialog ">
    <el-form ref="dataForm"
             label-position="left"
             size="mini">
      <div class="dialog-title">
      	<span v-if="type == 'add'" style="color: #2e827f !important">新增存样</span>
      	<span v-else style="color: #cb0000 !important">修改存样</i></span>
      </div>
      <el-divider></el-divider>
      <div class="el-dialog-item"><label class="w3 dialogTxt"
                                         style="margin-right:0em">检验号</label><label>：</label>
        <el-input clearable  v-model="detailData.sampleId" placeholder="扫码输入"  id="blur_input" :disabled="type !='add'"
                  size="mini"
                  style="width: 84%" />
      </div>
      <div class="el-dialog-item"><label class="dialogTxt">样品名称</label><label>：</label>
        <el-input clearable  v-model="detailData.materialName"  disabled
                  size="mini"
                  style="width: 84%" />
      </div>
      <div class="el-dialog-item"><label class="dialogTxt">样品规格</label><label>：</label>
        <el-input clearable  v-model="detailData.materialType"  disabled
                  size="mini"
                  style="width: 84%" />
      </div>
      <div class="el-dialog-item"><label class="w3 dialogTxt"
                                         style="margin-right:0em">库位号</label><label>：</label>
        <el-input clearable  v-model="detailData.house"
                  size="mini"
                  style="width: 84%" />
      </div>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="green"
                 size="mini" @click="updateDetail"
                 style="width: 80px;">
        	提 交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name:"managementEdit",
    data(){
      return{
        detailData:{sampleId:"",materialName:"",materialType:"",house:"",saveTmp:""},
        type:"",
        count:0,
        dialogAddVisible:false,
        sampleMap:{},
        needChange:true
      }
    },
    updated(){
      if(this.type == 'add'){
        let dom = document.getElementById("blur_input");
        if(dom && this.needChange){
          dom.focus();
          this.needChange = false;
        }
      }
    },
    computed:{
      sampleId(){
        return this.detailData.sampleId;
      }
    },
    mounted(){
      let self =this;
      self.getSamples();
      self.$eventBus.$on("openSampleSaveDialog",function (editData,type) {
          self.needChange = true;
          self.detailData = editData;
          self.type = type;
          self.count = 0;
          self.dialogAddVisible = true;
      });
    },
    methods:{
      getSamples(){
        let self = this;
        self.$http({
          url: "/drug/sample/queryAllSampleList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.sampleMap = resp.result;
          }
        });
      },
      checkValue(){
        if(!this.detailData.sampleId){
          this.showTip("检验号不能为空！");
          return false;
        }
        if(!this.detailData.materialName){
          this.showTip("检验号不存在！");
          return false;
        }
        if(!this.detailData.house){
          this.showTip("库位号不能为空！");
          return false;
        }
        if(this.detailData.saveTmp !='1'){
          this.showTip("检验方法未存样！");
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
      updateDetail(){
        let self = this;
        if(!self.checkValue()){
          return;
        }
        delete self.detailData.createTime;
        delete self.detailData.updateTime;
        self.detailData.userId = self.$store.getters.userId;
        let url = this.type == 'add' ? "/drug/sampleSave/addSample" : "/drug/sampleSave/updateSample";
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            params:self.detailData
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateSampleSaveList");
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
              message: "记录已经存在！",
              type: 'error'
            });
            this.count--;
          });
          this.count++;
        }
      },
    },
    watch:{
      sampleId(val){
        let data = this.sampleMap[val];
        if(data){
          this.detailData.materialName = data.materialName;
          this.detailData.materialType = data.materialType;
          this.detailData.saveTmp = data.saveTmp;
        }else{
          this.detailData.materialName = "";
          this.detailData.materialType = "";
          this.detailData.saveTmp = "";
        }
      }
    }
  }
</script>
<style scoped>
	.el-dialog .el-button--primary {
    background-color: #2e827f;
    border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
  }
</style>