<template>
  <div class="dialog">
    <el-dialog :visible.sync="dialogAddVisible"
                width="52%"
                append-to-body
               :close-on-click-modal="false"
               title="质量标准修订·审批">
      <div class="formClick" >
        <el-form ref="dataForm"
                 label-position="left"
                 size="mini"
                 label-width="0px">
          <div class="dialog-title"><span style='color:#cb0000'>质量标准修订·审批</span>
            <img src="../../../assets/img/bohui.png" v-if="detailData.checkStatus == '4'" style="display: inline;float: right;margin-top: -19px; width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
            <img src="../../../assets/img/disapprove.jpg" v-else-if="detailData.checkStatus == '2'" style="display: inline;float: right;margin-top: -19px;width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
            <img v-else src="../../../assets/img/approve.jpg" style="display: inline;float: right;margin-top: -19px;width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;">
          </div>
          <el-divider></el-divider>
          <el-row type="flex"
                  align="middle">
            <el-col :span="12"
                    style="margin-top:10px">
              <div class="el-dialog-item">
                <label class="w3" style="margin-right:-0.5em">申请号</label><label>：</label>
                {{detailData.id}}
              </div>
              <div class="el-dialog-item"
                   style="margin-top:10px"><label>起草时间：</label>
                {{detailData.createTimeFt}}
              </div>
              <div class="el-dialog-item"><label class="w3">起草人</label><label>：</label>
                {{detailData.userName}}
              </div>
              <div class="el-dialog-item"
                   style="margin-top:20px"><label>标准编号：</label>
                {{detailData.standardCode}}
              </div>
              <div class="el-dialog-item"><label class="w2">版本</label><label>：</label>
               {{detailData.version}}
              </div>
            </el-col>
            <el-col :span="12">
              <div class="el-col-frame">
                <el-row type="flex"
                        align="middle">
                  <legend>物料信息</legend>
                  <div style="margin:15px 15px 9px 15px">
                    <div class="el-dialog-item"><label>物料编码：</label>
                      {{material.materialCode}}
                    </div>
                    <div class="el-dialog-item"><label class="w3">申请人</label>：{{material.userName}}</div>
                    <div class="el-dialog-item"><label>申请时间：</label>{{material.createTimeFt}}</div>
                    <div class="el-dialog-item"><label>物料规格：</label>{{material.materialTypeName}}</div>
                    <div class="el-dialog-item"><label>物料名称：</label>{{material.materialName}}</div>
                    <div class="el-dialog-item"><label>物料等级：</label>{{material.materialGradeName}}</div>
                  </div>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-form label-position="left"
                   label-width="66px"
                   size="mini">
            <el-form-item label="补充说明:">
              <span>{{detailData.remark}}</span>
            </el-form-item>
          </el-form>
          <div class="flex-row-space-between"
               style="margin:20px 0 -20px 0;">
            <div style="line-height:20px;"><span style="color:#878989">标准明细：</span></div>
          </div>
        </el-form>
      </div>
      <div class="el-dialog-table el-div-green standard"
           style="margin-top:20px">
        <div class="drugTableCopy">
          <drug-table :filterPage="false"
                      :tableLoading="standardLoading"
                      :tableData="standardItemList"
                      :tableHeader="standTableHeader" ></drug-table>
        </div>
      </div>
      <drug-table style="margin-top: 10px" :filterPage="false"  v-show="standardHistoryItemList.length > 0"
                  :tableLoading="standardHistoryLoading"
                  :tableData="standardHistoryItemList"
                  :option="historyOption"
                  :tableHeader="standHistoryTableHeader" ></drug-table>
      <el-row>
        <el-col :span="24"
                style="margin-top:10px">
          <div class="el-dialog-item"
               style="display: block;"><label>审批意见：</label>
            <el-input clearable  type="textarea"
                      maxlength="200"
                      :rows="2"
                      style="width: 100%"
                      size="small"
                      :disabled="detailData.checkStatus!='2'"
                      v-model="detailData.content"> </el-input>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" v-if="detailData.checkStatus=='2'"
           class="dialog-footer">
        <el-button type="red"
                   size="mini" @click="submitCheck('4')"
                   style="width: 80px;">
          驳回
        </el-button>
        <el-button type="primary"
                   size="mini" @click="submitCheck('5')"
                   style="width: 80px;margin-left:30%">
          批准
        </el-button>

      </div>
    </el-dialog>
  </div>

</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {formatDate} from '@/utils/formatDate'
  import drugTable from "@/components/table/index";
  import {getToken} from '@/utils/auth' // 验权
  export default {
    name: "method",
    props: ["editData"],
    data() {
      return {
        detailData: {
          id: "",
          userName: "",
          standardCode: "",
          version: "",
          remark: "",
          content:""
        },
        material:{},
        dialogAddVisible: false,
        count: 0,


        standardItemList: [],
        standTableHeader: [],
        standardLoading:true,
        selectChoice: [],


        standardHistoryItemList: [],
        standHistoryTableHeader: [],
        historyOption:{headerStyle:{background:'grey'}},
        standardHistoryLoading:true,
        user:{}
      }
    },
    components: {drugTable},
    mounted() {
      let self = this;
      let user = JSON.parse(getToken());
      this.user = user;
      self.$eventBus.$on("openStandardApproveDialog",function (editData) {
        self.getMaterialList(editData.sampleCode);
        self.dialogAddVisible = true;
        self.count = 0;
        self.detailData = editData;
        this.standardItemList = [];
        this.standardHistoryItemList = [];
        self.getStandardItem();
      })
    },
    methods: {

      showTip(msg) {
        let self = this;
        self.$notify({
          title: '提示',
          message: msg,
          type: 'warning'
        });
      },


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
            url: "/drug/fmApprove/updateMaterialStandardApprove",
            method: "post",
            params:param
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateMaterialStandardApprove");
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
      getMaterialList(materialCode) {
        let self = this;
        self.$http({
          url: "/drug/material/queryMaterialList",
          method: "post",
          params: {materialCode:materialCode}
        }).then(resp => {
          if (resp.success) {
            self.material = resp.result[0];
            console.log(self.material)
          }
        });
      },

      getStandardItem() {
        let self = this;
        let param = {id: self.detailData.id, standardCode: self.detailData.standardCode};
        self.standardHistoryLoading = true;
        self.standardLoading = true;
        self.$http({
          url: "/drug/standard/queryMatrialStandradItemList",
          method: "post",
          params: param
        }).then(resp => {
          if (resp.success) {
            self.standardHistoryLoading = false;
            self.standardLoading = false;
            self.standardHistoryItemList = resp.result.histories;
            self.standHistoryTableHeader = [
              {"columnName": "standardCode", "coloumNameCn": "标准编号"},
              {"columnName": "version", "coloumNameCn": "版本"},
              {"columnName": "remark", "coloumNameCn": "补充说明"},
              {"columnName": "userName", "coloumNameCn": "修订人"},
              {"columnName": "createTimeFt", "coloumNameCn": "修改时间"}];

            self.standTableHeader = [
              {"columnName": "itemName", "coloumNameCn": "检测项目","columnNameRe": "itemId"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "methodName", "coloumNameCn": "方法名称","columnNameRe": "methodId"},
              {"columnName": "methodCode", "coloumNameCn": "方法编号"},
              {"columnName": "codeAttrName", "coloumNameCn": "方法属性"},
              {"columnName": "manHour", "coloumNameCn": "工时"}];
            self.standardItemList = resp.result.newVersions;
          }

        });
      }
    }
  }
</script>
<style lang="scss">
  .el-div-version {
    .el-table .el-table__header th {
      background-color: #d8dad7;
      color: #7e7f7d;
    }
  }
</style>

<style lang="scss" scoped>
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

</style>
<style>
  .drugTableCopy .cell {
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
  }

  .drugTableCopy .el-table__header, .el-table__body, .el-table__footer {
    table-layout: fixed;
  }

  .drugTableCopy .cell .el-input__inner {
    height: 20px !important;
    line-height: 30px !important;
    margin-top: 5px !important;
    padding: 0 4px !important;
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
</style>
