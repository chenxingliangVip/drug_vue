<template>
  <el-dialog  width="80%"
             :close-on-click-modal="clickModalHide"
             :before-close="closeDialog"
             :visible.sync="centerDialogVisible"
             :title="type == 'add'?'新增·角色权限管理':'编辑·角色权限管理'">
    <div class="dialog-title">
	  	<span v-if="type=='add'"><i class="el-icon-folder-add"></i> {{titleTxt}}角色权限管理</span>
	  	<span v-else style='color:#cb0000'><i class="el-icon-edit"></i> {{titleTxt}}角色权限管理</span>
    </div>
    <el-divider></el-divider>
    <div class="el-dialog-item"
         style="margin-left:20px;"><label>角色名称</label><label>：</label>
      <el-input clearable   size="mini" style="width: 15%" v-model="roleData.roleName"/>
    </div>
    <div class="el-dialog-role">
      <el-table  :data="copyPermission"
                :show-header="false"
                border
                fit
                height="380px"
                size="mini"
                highlight-current-row
                style="width: 100%;"
                :span-method="arraySpanMethod">

        <el-table-column label="序号"
                         prop="index"
                         align="center"
                         width="55">
        </el-table-column>
        <el-table-column label="主标题"
                         prop="title"
                         width="160"
                         align="center">
        </el-table-column>
        <el-table-column label="副序号"
                         prop="subIndex"
                         width="60"
                         align="center">
        </el-table-column>
        <el-table-column label="副标题"
                         width="160"
                         prop="subTitle"
                         align="center">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.secondCheck" @change="changeSecondCheck(row)">{{ row.subTitle }}</el-checkbox>

          </template>
        </el-table-column>
        <el-table-column label="操作"
                         class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-checkbox-group v-model="row.checkedRole"
                               @change="handleCheckedRoleChange(row)">
              <el-checkbox :label="item.value" v-for="(item,index) in row.thirdModule"  :key="index"
                           :disabled="!row.secondCheck">{{item.title}}</el-checkbox>
            </el-checkbox-group>

          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer"
         class="dialog-footer">
      <el-button type="info"
                 size="mini"
                 style="width: 80px;"
                 @click="closeDialog">
        返 回
      </el-button>
      <el-button type="green"
                 size="mini"
                 @click="savePermission"
                 style="width: 80px;margin-left:30%"
                >
        提 交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name:"roleEdit",
    props:["editData","type","roles","selfValue"],
    components:{},
    data(){
      return{
        roleData:{roleName:"",rolePermission:""},
        permissionList:[],
        copyPermission:[],
        centerDialogVisible: false,
        clickModalHide: false,
        count:0,
        titleTxt: ''
      }
    },
    mounted(){
      this.getAllPermission();
    },
    methods:{
      closeDialog() {
        this.centerDialogVisible = false;
      },
      getAllPermission(){
        let self = this;
        self.$http({
          url: "/drug/permission/queryActionPermission",
          method: "post",
        }).then(resp => {
          if (resp.success) {
             let permissionList = [];
             let i = 1;
             for(let per of resp.result){
               let span = false;
               let subK = 1;
               for(let _c of per.children){
                 let obj ={value:_c.permission,index: i,span: per.children.length, title: per.moduleName, subIndex: "", subTitle: per.moduleName, checkedRole: [],secondCheck:false,thirdModule:[]};
                 obj.subTitle = _c.moduleName;
                 obj.subIndex = i+"."+subK;
                 if(_c.children){
                   for(let _cc of _c.children){
                     let child = {title:_cc.moduleName,value:_cc.permission};
                     obj.thirdModule.push(child);
                   }
                 }
                 if(span){
                   obj.span = 0;
                 }
                 permissionList.push(obj);
                 subK ++;
                 span = true;
               }
               i++;
             }
             self.permissionList = permissionList;
          }
        });
      },
      changeSecondCheck(row){
        row.checkedRole = [];
        if(row.secondCheck){
          for(let c of row.thirdModule){
            row.checkedRole.push(c.value);
          }
        }
      },
      handleCheckedRoleChange(value) {
        console.log(value)
      },
      savePermission(){
        let self =this;
        let permissionList = [];
        for(let data of this.copyPermission){
          if(data.secondCheck){
            permissionList.push(data.value);
          }
          permissionList.push(...data.checkedRole);
        }
        this.roleData.rolePermission = permissionList.join(",");
        let url = this.type == 'add' ? "/drug/role/addRole" : "/drug/role/updateRole";
        if(this.roles){
          for(let r of this.roles){
            if(this.type == 'add' && r.roleName.trim() == this.roleData.roleName.trim()){
              self.$notify({
                title: '提示',
                message: "角色重复！",
                type: 'error'
              });
              return;
            }
            if(this.type == 'edit' && this.selfValue.trim() != this.roleData.roleName.trim()&& r.roleName.trim() == this.roleData.roleName.trim()){
              self.$notify({
                title: '提示',
                message: "角色重复！",
                type: 'error'
              });
              return;
            }
          }
        }
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            params: this.roleData,
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateRoleList");
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
      },
      arraySpanMethod({ row, columnIndex }) {
        if (columnIndex < 2) {
          if (row.span === 0) {
            return [0, 0]
          } else {
            return [row.span, 1]
          }
        }
      },

      showCheckPermission(rolePermission){
        if(rolePermission){
          let array = rolePermission.split(",");
          for(let p of this.copyPermission){
            if(array.indexOf(p.value) > -1){
              p.secondCheck = true;
            }
            for(let t of p.thirdModule){
              if(array.indexOf(t.value) > -1){
                p.checkedRole.push(t.value);
              }
            }
          }
        }
      }
    },
    watch:{
      editData(val){
        this.copyPermission = JSON.parse(JSON.stringify(this.permissionList));
        this.roleData = {roleName:"",rolePermission:"",id:""};
        if(this.type == "edit"){
          this.roleData.roleName = val.roleName;
          this.roleData.id = val.id;
          this.showCheckPermission(val.rolePermission);
        }
        this.centerDialogVisible = true;
        this.count = 0;
        if(this.type == "add"){
        	this.titleTxt = "新增"
        }else if(this.type == "edit"){
        	this.titleTxt = "编辑"
        }
      }
    }
  }
</script>
