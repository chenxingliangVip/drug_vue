<template>
  <el-dialog :title="type=='add'?'新增·样检':'修改·样检'"
             width="50%"
             append-to-body
             :close-on-click-modal="false"
             :visible.sync="dialogAddVisible">
    <el-form ref="dataForm" size="mini" label-width="80px">
      <div class="dialog-title"><span>样品送检</span></div>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="24">
          <div class="el-dialog-item"><label>规则序号：</label>
            <el-input clearable  v-model.number="inspectData.serialNo"
                      size="mini"
                      style="width: 100px;" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item"><label>检验规则：</label>
            <el-select v-model="inspectData.typeId"
                       size="mini"
                       clearable
                       style="width: 100px">
              <el-option v-for="item in regular"
                         :key="item.id"
                         :label="item.itemName"
                         :value="item.id" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item"><label>规 则 值：</label>
            <el-input clearable  v-model="inspectData.checkValue"
                      size="mini"
                      style="width: 100px;" />
          </div>
        </el-col>
      </el-row>

      <div class="el-dialog-group"><label>送样地点：</label>
        <el-checkbox-group v-model="locationIds"
                           style="width:87%"
                           @change="handleCheckedLocationChange">
          <el-checkbox v-for="city in location"
                       :label="city.id"
                       :key="city.id">{{city.itemName}}</el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="el-dialog-group"><label>方法属性：</label>
        <el-checkbox-group v-model="attrIds"
                           style="width:87%"
                           @change="handleCheckedAttrChange">
          <el-checkbox v-for="item in method_attr"
                       :label="item.id"
                       :key="item.id">{{item.itemName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="el-dialog-group"><label>送样部门：</label>
        <el-checkbox-group v-model="inspectData.deptIds"
                           style="width:87%">
          <el-checkbox v-for="item in dept"
                       :label="item.id"
                       :key="item.id">{{item.deptName}}</el-checkbox>
        </el-checkbox-group>
      </div>

    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini"
                 style="width: 80px;"
         @click="updateRule">完成</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name:"inspect",
    props:["editData","type","codeItemMap"],
    components:{},
    data(){
      return{
        count:0,
        inspectData:{locationId:"",attrId:"",typeId:"",checkValue:"",serialNo:"",deptIds:[]},
        dialogAddVisible: false,
        rules:[],
        location:[],
        method_attr:[],
        regular:[],
        dept:[],

        attrIds:[],
        locationIds:[]
      }
    },
    methods:{
      handleCheckedLocationChange(value){
         for(let i = 0;i <this.locationIds.length;i++){
            if(this.locationIds[i] != value){
              this.locationIds.splice(i,1);
            }
         }
         this.inspectData.locationId = this.locationIds.length > 0?this.locationIds[0]:"";
      },
      handleCheckedAttrChange(value){
         for(let i = 0;i <this.attrIds.length;i++){
            if(this.attrIds[i] != value){
              this.attrIds.splice(i,1);
            }
         }
        this.inspectData.attrId = this.attrIds.length > 0?this.attrIds[0]:"";
      },
      checkInput(){
        if(!this.inspectData.serialNo){
          this.$notify({
            title: '提示',
            message: "规则序号不能为空！",
            type: 'warning'
          });
          return false;
        }
        if(!this.inspectData.typeId){
          this.$notify({
            title: '提示',
            message: "规则不能为空！",
            type: 'warning'
          });
          return false;
        }
        if(!this.inspectData.checkValue){
          this.$notify({
            title: '提示',
            message: "规则值不能为空！",
            type: 'warning'
          });
          return false;
        }
        return true;
      },
      updateRule(){
        let self = this;
        if(!self.checkInput()){
          return;
        }
        this.inspectData.userId = self.$store.getters.userId;
        let url = this.type == 'add' ? "/drug/rule/addTestRule" : "/drug/rule/updateTestRule";
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            data: JSON.stringify(self.inspectData),
            dataType: 'json',
            contentType: "application/json",
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateRuleList");
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
      }
    },
    watch:{
      editData(val){
        this.count= 0;
        this.attrIds = [];
        this.locationIds = [];
        if(this.type == 'edit'){
          if(val.locationId){
            this.locationIds.push(val.locationId)
          }
          if(val.attrId){
            this.attrIds.push(val.attrId)
          }
        }
        this.location = this.codeItemMap["location"];
        this.method_attr = this.codeItemMap["method_attr"];
        this.regular = this.codeItemMap["regular"];
        this.dept = this.codeItemMap["dept"];
        this.dialogAddVisible = true;
        this.inspectData = val;
      }
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

  .el-dialog-dep {
    border: solid 1px #2e827f;
    overflow: auto;
    margin-top: 3px;
    padding: 10px 10px 10px 30px;
    height: 100px;
    border-radius: 4px;
    .el-checkbox {
      width: 90px;
    }
  }

  .el-dialog-group {
    display: flex;
    flex-direction: row;
    color: #878989;
    font-size: 13px;
    margin-bottom: 10px;
  }
</style>
