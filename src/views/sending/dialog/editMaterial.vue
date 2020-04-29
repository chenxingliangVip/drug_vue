<template>
  <el-dialog
    width="40%"
    :title="type=='add'?'新增·物料编码':(type =='see'?'查看·物料编码':'编辑·物料编码')"
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="dialogAddVisible" class="standard_Dialog"
  >
    <el-form ref="dataForm" label-position="left" size="mini" label-width="0px">
      <div class="dialog-title">
        <span v-if="type=='add'">新增物料编码</span>
        <span v-else-if="type=='see'">查看物料编码</span>
        <span v-else style="color: #cb0000">编辑物料编码</span>
      </div>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item">
            <label class="dialogTxt">物料名称：</label>
            <el-input
              clearable
              v-model="materialData.materialName"
              size="mini"
              :disabled="type == 'see'"
              style="width: 130px;"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right">
            <label class="w3" style="margin-right:-0.5em">申请号</label>：
            <el-input
              clearable
              v-model="materialData.materialNum"
              disabled
              size="mini"
              style="width: 130px;"
            />
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item">
            <label class="dialogTxt">英文缩写：</label>
            <el-input
              clearable
              v-model="materialData.nameAbbr"
              :disabled="type == 'see'"
              size="mini"
              style="width: 130px;"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right">
            <label class="dialogTxt">所属部门：</label>
            <el-input
              clearable
              v-model="user.deptName"
              disabled
              size="mini"
              style="width: 130px;"
            />
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item">
            <label class="dialogTxt">物料规格：</label>
            <el-select
              v-model="materialData.materialTypeId"
              :disabled="type == 'see'"
              @change="changeMaterialType"
              size="mini"
              clearable
              style="width: 130px"
            >
              <el-option
                v-for="item in grades"
                :key="item.id"
                :label="item.itemName"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right">
            <label class="w3" style="margin-right:-0.5em">申请人</label>：
            <el-input
              clearable
              v-model="user.userName"
              disabled
              size="mini"
              style="width: 130px;"
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item">
            <label class="dialogTxt">参考物料：</label>
            <el-select
              v-model="materialData.refItem"
              :disabled="type == 'see' || refMaterialDisabled"
              size="mini"
              clearable
              filterable
              allow-create
              style="width: 130px"
            >
              <el-option
                v-for="item in filterValue(materialList)"
                :key="item.id"
                :label="item.materialName"
                :value="item.materialCode"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right">
            <label class="dialogTxt">申请时间：</label>
            <el-date-picker
              v-model="nowTime"
              disabled
              size="mini"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 130px;"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item">
            <label class="dialogTxt">物料等级：</label>
            <el-select
              v-model="materialData.materialGradeId"
              @change="changeMaterialGrade"
              :disabled="type == 'see'"
              size="mini"
              style="width: 130px"
            >
              <el-option
                v-for="item in levels"
                :key="item.id"
                :label="item.itemName"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="el-dialog-item">
            <label class="dialogTxt">物料编码：</label>
            <el-input
              clearable
              v-model="materialData.materialCode"
              disabled
              size="mini"
              style="width: 130px;"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-dialog-item el-form-right">
            <label class="dialogTxt">工艺节点：</label>
            <el-input
              clearable
              v-model="materialData.artNode"
              disabled
              size="mini"
              style="width: 130px;"
            />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="el-dialog-item" style>
            <label>产品描述：</label>
            <el-input
              clearable
              type="textarea"
              maxlength="200"
              style="width: calc(100% - 65px)"
              :rows="2"
              size="small"
              placeholder="请输入200字内的描述"
              v-model="materialData.materialDescr"
              :disabled="type == 'see'"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="el-dialog-item">
            <label>补充说明：</label>
            <el-input
              clearable
              type="textarea"
              maxlength="200"
              style="width: calc(100% - 65px)"
              :rows="2"
              size="small"
              placeholder="请输入200字内的说明"
              v-model="materialData.remark"
              :disabled="type == 'see'"
            ></el-input>
          </div>
        </el-col>
      </el-row>

      <el-row v-show="this.type != 'add'">
        <el-col :span="24">
          <div class="el-dialog-item">
            <label>审批意见：</label>
            <span>{{applyReason}}</span>
          </div>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" v-show="type == 'edit'||type == 'add'" class="dialog-footer">
      <el-button type="green" size="mini" style="width: 80px;" @click="updateMaterial">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {getToken} from "@/utils/auth"; // 验权
  import {formatDate} from "@/utils/formatDate";

  export default {
    name: "editMaterial",
    props: ["editData", "type", "grades", "levels", "materialList"],
    data() {
      return {
        user: {deptName: "", userName: ""},
        nowTime: new Date(),
        materialData: {
          materialName: "",
          finalProd: "",
          nameAbbr: "",
          materialGradeId: "",
          refItem: "",
          materialTypeId: "",
          materialCode: "",
          artNode: "",
          materialDescr: "",
          remark: "",
          materialNum: ""
        },
        dialogAddVisible: false,
        count: 0,
        applyReason: "",

        //参考物料
        refMaterialDisabled:true,

        materialCount: 0,
        materialGradeValue:"",
        materialGradeValueMap:{"工业级":"01","药用级":"02","注射级":"03"}
      };
    },
    mounted() {
      let user = JSON.parse(getToken());
      this.user = user;
    },
    methods: {
      getCount() {
        let count = this.materialCount;
        if (count < 10) {
          count = "000" + count;
        } else if (count < 100) {
          count = "00" + count;
        } else if (count < 1000) {
          count = "0" + count;
        }
        return count;
      },
      getRandom() {
        let code = "";
        let day = formatDate(new Date(), "MMdd");
        let count = this.getCount();
        code = day + "-" + count;
        return count;
      },

      changeMaterialGrade(){
        for (let data of this.levels) {
          if (data.id == this.materialData.materialGradeId) {
            this.materialGradeValue = this.materialGradeValueMap[data.itemName];
            if(this.materialData.materialCode){
              this.materialData.materialCode = this.materialData.materialCode.substring(0,1)+this.materialGradeValue+this.materialData.materialCode.substring(3,this.materialData.materialCode.length);
            }
            break;
          }
        }
      },

      changeMaterialType() {
        this.materialData.materialCode = "";
        this.materialData.refItem = "";
        for (let data of this.grades) {
          if (data.id == this.materialData.materialTypeId) {
            let tag = "P";
            if (data.itemName == "原料") {
              tag = "M";
            }
            this.refMaterialDisabled = (data.itemName == "原料" || data.itemName == "成品")?true:false;
            this.materialData.materialCode = tag+this.materialGradeValue+this.getRandom();
            this.materialData.artNode =data.itemName.replace(/[^0-9]/ig,"");
            break;
          }
        }
      },
      filterValue(val) {
        let array = [];
        if (val) {
          for (let data of val) {
            if (data.materialCode) {
              array.push(data);
            }
          }
        }
        return array;
      },
      checkValue() {
        if (!this.materialData.materialName) {
          this.showTip("请输入物料名称！");
          return false;
        }
        if (!this.materialData.materialGradeId) {
          this.showTip("请输入物料等级！");
          return false;
        }
        if (!this.materialData.materialTypeId) {
          this.showTip("请输入物料规格！");
          return false;
        }
        return true;
      },
      showTip(msg) {
        let self = this;
        self.$notify({
          title: "提示",
          message: msg,
          type: "warning"
        });
      },
      updateMaterial() {
        let self = this;
        if (!self.checkValue()) {
          return;
        }
        delete self.materialData.createTime;
        delete self.materialData.updateTime;
        self.materialData.userId = self.$store.getters.userId;
        self.materialData.userName = self.$store.getters.userName;
        self.materialData.checkStatus = "0";
        let url =
          this.type == "add"
            ? "/drug/material/addMaterial"
            : "/drug/material/updateMaterial";
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            data: JSON.stringify(self.materialData),
            dataType: "json",
            contentType: "application/json"
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateMaterialList");
              self.$notify({
                title: "提示",
                message: "操作成功！",
                type: "success"
              });
              self.dialogAddVisible = false;
              return;
            }
            self.$notify({
              title: "提示",
              message: "出现异常，请联系管理员",
              type: "error"
            });
            this.count--;
          });
          this.count++;
        }
      },

      getMaterialNum() {
        let count = this.materialCount;
        if (count < 10) {
          count = "0000" + count;
        } else if (count < 100) {
          count = "000" + count;
        } else if (count < 1000) {
          count = "00" + count;
        } else if (count < 10000) {
          count = "0" + count;
        }
        this.materialData.materialNum = "BM" + count;
      },
      getMaterialCount() {
        let self = this;
        self.$http({
          url: "/drug/material/queryMaterialCount",
          method: "post"
        }).then(resp => {
          if (resp.success) {
            self.materialCount = resp.result;
            self.getMaterialNum();
          }
        });
      },
      getApplyReason() {
        let self = this;
        self.$http({
          url: "/drug/fmApprove/queryFmApproveByRelateId",
          method: "post",
          params: {relateId: self.materialData.id}
        }).then(resp => {
          if (resp.success) {
            self.applyReason = resp.result.content;
          }
        });
      }
    },
    watch: {
      editData(val) {
        this.dialogAddVisible = true;
        this.count = 0;
        this.materialData = val;
        this.refMaterialDisabled = true;
        if (this.type == "add") {
          if (this.levels && this.levels.length > 0) {
            this.materialData.materialGradeId = this.levels[0].id
            this.materialGradeValue = this.materialGradeValueMap[this.levels[0].itemName];
          }
          this.getMaterialCount();
        } else {
          this.getApplyReason();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-col-line {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }

  .el-dialog .el-button--primary {
    background-color: #2e827f;
    border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
  }

  .el-dialog .el-button--red {
    background-color: #c00400;
    border-color: #c00400;
  }

  // .el-dialog-item {
  // 	label {
  // 		width: 80px;
  // 		.el-input {
  // 			width: calc(100% - 80px);
  // 		}
  // 	}
  // }
</style>
