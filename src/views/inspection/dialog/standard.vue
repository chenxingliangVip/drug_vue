<template>
  <div class="dialog">
    <el-dialog :visible.sync="dialogAddVisible"
               width="55%"
               append-to-body
               :close-on-click-modal="false"
               :title="dialogtitle" class="standard_Dialog dialog_FormTxt">
      <div class="formClick" @click.capture="closeEdit">
        <el-form ref="dataForm"
                 label-position="left"
                 size="mini"
                 label-width="0px">
          <div class="dialog-title">
            <span v-if="type == 'edit' || type == 'approve'" style='color:#cb0000 !important'>{{title}} </span>
            <span v-else style="color: #2e827f !important">{{title}}</span>
          </div>
          <el-divider></el-divider>
          <el-row type="flex"
                  align="middle">
            <el-col :span="12"
                    style="margin-top:10px">
              <div class="el-dialog-item"><label class="w3"
                                                 style="margin-right:-0.5em">申请号</label><label><i class="i_colon">：</i></label>
                <el-input clearable  v-model="methodData.id" disabled
                          size="mini"
                          style="width: 140px;"/>
              </div>
              <div class="el-dialog-item"><label>起草时间<i class="i_colon">：</i></label>
                <el-date-picker v-model="methodData.createTime" disabled
                                size="mini"
                                type="date"
                                style="width: 140px;">
                </el-date-picker>
              </div>
              <div class="el-dialog-item"><label class="w3"
                                                 style="margin-right:-0.5em">起草人</label><label><i class="i_colon">：</i></label>
                <el-input clearable  v-model="methodData.userName" disabled
                          size="mini"
                          style="width: 140px;"/>
              </div>
              <div class="el-dialog-item"
                   style="margin-top:20px"><label>标准编号<i class="i_colon">：</i></label>
                <el-input clearable  v-model="methodData.standardCode"
                          size="mini"
                          :disabled="type == 'see' || type == 'approve'"
                          style="width: 140px;"/>
              </div>
              <div class="el-dialog-item"><label class="w2"
                                                 style="margin-right:-2em">版本</label><label><i class="i_colon">：</i></label>

                <el-select v-model="methodData.version"
                           size="mini"
                           clearable
                           filterable
                           :disabled="type == 'see'"
                           style="width: 140px">
                  <el-option v-for="item in versionList"
                             :key="item.id"
                             :label="item.versionName"
                             :value="item.versionName"/>
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="el-col-frame">
                <el-row type="flex"
                        align="middle">
                  <legend>物料信息</legend>
                  <div style="margin:15px 15px 9px 15px">
                    <div class="el-dialog-item"><label>物料编码<i class="i_colon">：</i></label>
                      <span v-if="type != 'add'">{{methodData.materialCode}}</span>
                      <el-select v-model="methodData.materialCode" v-if="type == 'add'" @change="changeMaterial"
                                 size="mini"
                                 clearable
                                 filterable
                                 style="width: 120px;">
                        <el-option v-for="item in filterEmpty(materialList)"
                                   :key="item.id"
                                   :label="item.materialCode"
                                   :value="item.materialCode"/>
                      </el-select>
                    </div>
                    <div class="el-dialog-item"><label class="w3">申请人</label><i class="i_colon">：</i>{{methodData.materialUserName}}</div>
                    <div class="el-dialog-item"><label>申请时间<i class="i_colon">：</i></label>{{methodData.materialDateFt}}</div>
                    <div class="el-dialog-item"><label>物料规格<i class="i_colon">：</i></label>{{methodData.materialType}}</div>
                    <div class="el-dialog-item"><label>物料名称<i class="i_colon">：</i></label>{{methodData.materialName}}</div>
                    <div class="el-dialog-item"><label>物料等级<i class="i_colon">：</i></label>{{methodData.materialGrade}}</div>
                  </div>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-form label-position="left"
                   label-width="66px"
                   size="mini">
            <el-form-item>
              <span class="span_colon">补充说明<i class="i_colon">:</i></span>
              <el-input clearable  type="textarea" :disabled="type == 'see'" v-model="methodData.remark"></el-input>
            </el-form-item>
          </el-form>
          <el-form label-position="left"
                   label-width="66px"
                   size="mini">
            <el-form-item v-show="type != 'add' &&type != 'dz'">
              <span class="span_colon">审批意见<i class="i_colon">:</i></span>
              {{applyReason}}
            </el-form-item>
          </el-form>
          <div class="flex-row-space-between"
               style="margin:20px 0 -20px 0;">
            <div style="line-height:20px;"><span style="color:#878989">标准明细<i class="i_colon">：</i></span></div>
            <div v-show="type != 'see'">
              <i class="el-icon-circle-plus-outline" @click="addColumn" style="cursor:pointer;"></i>
              <i class="el-icon-remove-outline" @click="deleteColumn" style="cursor:pointer;margin-left:10px"></i>
              <i class="el-icon-bottom" @click="changePositionRow(1)" style="cursor:pointer;margin-left:10px"></i>
              <i class="el-icon-top" @click="changePositionRow(-1)" style="cursor:pointer;margin-left:10px"></i>
            </div>
          </div>
        </el-form>
      </div>
      <div class="el-dialog-table el-div-green standard"
           style="margin-top:20px">
        <div class="drugTableCopy">
          <drug-edit-table  @getSelection="getSelection"
                            :compareItem="compareItem" :editType="type"
                            :filterPage="false"
                             ref="standardTable"
                            :isMultipleSelection="true"
                            @changCurrentRow="changCurrentRow"
                            :tableData="standardItemList"
                            :tableLoading="standardLoading"
                            :tableHeader="standTableHeader"  ></drug-edit-table>
        </div>
      </div>
      <drug-table  style="margin-top: 10px" :filterPage="false"
                   v-show="standardHistoryItemList.length > 0 && this.type != 'edit'"
                   :tableLoading="standardHistoryLoading"
                   :tableData="standardHistoryItemList"
                   :option="historyOption"
                   :tableHeader="standHistoryTableHeader" ></drug-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="green" v-show="type != 'see'"
                   size="mini" @click="updateStandard"
                   style="width: 80px;">
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {getToken} from '@/utils/auth' // 验权
  import {formatDate} from '@/utils/formatDate'
  import drugTable from "@/components/table/index";
  import drugEditTable from "@/components/table/editStandardTable";

  export default {
    name: "method",
    props: ["editData", "type"],
    data() {
      return {
        title: "",
        dialogtitle: "",
        methodData: {
          id: "",
          createTime: null,
          userName: "",
          userId: "",
          standardCode: "",
          version: "",
          remark: "",
          matrialStandradItems: [],

          materialCode: "",
          materialType: "",
          materialName: "",
          materialGrade: "",
          materialUserName: "",
          materialDateFt: ""
        },
        compareItem:"",
        dialogAddVisible: false,
        count: 0,
        materialStandardCount: 0,
        user: {},
        materialList: [],
        versionList: [],

        testItems: [],
        testMethodList: [],


        standardItemList: [],
        standTableHeader: [],
        standardLoading:true,
        selectChoice: [],


        standardHistoryItemList: [],
        standHistoryTableHeader: [],
        historyOption:{headerStyle:{background:'grey'}},
        standardHistoryLoading:true,
        applyReason:"",

        currentRow:{}
      }
    },
    components: {drugTable,drugEditTable},
    mounted() {
      let user = JSON.parse(getToken());
      this.user = user;
      this.getVersionList();
      this.getMaterialList();
      this.getCodeItemList();
      this.getTestMethod();
    },
    methods: {

      changCurrentRow(row){
        this.currentRow = row;
      },
      changePositionRow(index){
        if(Object.keys(this.currentRow).length == 0){
          this.$notify({
            title: "提示",
            message: "请选择一列！",
            type: "warning"
          });
          return;
        }
        let standardTable = this.$refs.standardTable.getTableData();
        let currentIndex = parseInt(this.currentRow.index.value);
        let pos = currentIndex + index;
        if(pos < 0){
          return;
        }
        if(pos == standardTable.length){
          return;
        }
        let tmp = Object.assign({},standardTable[currentIndex]);
        standardTable[currentIndex] = Object.assign({},standardTable[pos]);
        standardTable[pos] = tmp;
        standardTable[pos].index.value = pos;
        standardTable[currentIndex].index.value = currentIndex;
        this.standardItemList = standardTable;
        let self = this;
        self.$nextTick(() => {
          self.$refs.standardTable.setCurrent(pos);
        });
      },

      getSelection(val) {
        this.selectChoice = val;
      },

      deleteColumn() {
        if (this.selectChoice.length < 1) {
          this.$notify({
            title: "提示",
            message: "请选择一列！",
            type: "warning"
          });
          return;
        }
        let choiceIds = [];
        for (let data of this.selectChoice) {
          choiceIds.push(data.itemId.value + "-"+data.methodId.value);
        }
        let standardTable = this.$refs.standardTable.getTableData();
        for(let choiceId of choiceIds){
          label:
            for(let item of standardTable){
              if(choiceId == item.itemId.value + "-"+item.methodId.value){
                let index = standardTable.indexOf(item);
                standardTable.splice(index, 1);
                break label;
              }
            }
        }
        for(let i = 0 ;i<standardTable.length ;i++){
          standardTable[i].index.value = i;
        }
        this.standardItemList = standardTable;
        this.currentRow = {};
      },

      addColumn() {
        let row = {
          index: {value: ""},
          methodId: {value: ""},
          itemId: {value: "" },
          itemName: {value: "", edit: false,type:"select",list:this.testItems,tmpList:JSON.parse(JSON.stringify(this.testItems)),key:"itemName"},
          itemQualityStandard: {value: "", edit: false,type:"input"},
          methodName: {value: "", edit: false,type:"select",list:[],tmpList:JSON.parse(JSON.stringify(this.testMethodList)),key:"methodName"},
          methodCode: {value: ""},
          codeAttrName: {value: ""},
          manHour: {value: "请选择方法..."},
        };
        let standardTable = this.$refs.standardTable.getTableData();
        let count = standardTable.length;
        row.index.value = count;
        standardTable.push(row);
        this.standardItemList = standardTable;
        this.currentRow = {};
      },

      getCount() {
        let count = this.materialStandardCount;
        if (count < 10) {
          count = "0000" + count;
        } else if (count < 100) {
          count = "000" + count;
        } else if (count < 1000) {
          count = "00" + count;
        } else if (count < 10000) {
          count = "0" + count;
        }
        return count;
      },
      getRandom() {
        let code = "";
        let day = formatDate(new Date(), "yyyy");
        let count = this.getCount();
        code = "MQS" + day.substring(2) + "-" + count;
        return code;
      },
      filterEmpty(val) {
        let array = [];
        if (!val) {
          return array;
        }
        for (let data of val) {
          if (data.materialCode) {
            array.push(data);
          }
        }
        return array;
      },
      changeMaterial() {
        for (let data of this.materialList) {
          if (data.materialCode == this.methodData.materialCode) {
            this.methodData.materialType = data.materialTypeName;
            this.methodData.materialName = data.materialName;
            this.methodData.materialGrade = data.materialGradeName;
            this.methodData.materialUserName = data.userName;
            this.methodData.materialDateFt = data.createTimeFt;
            break;
          }
        }
      },
      checkValue() {
        if (!this.methodData.standardCode) {
          this.showTip("请输入标准编号！");
          return false;
        }
        if (!this.methodData.materialCode) {
          this.showTip("请输入物料编码！");
          return false;
        }
        if (!this.methodData.version) {
          this.showTip("请输入版本号！");
          return false;
        }
        if (this.standardItemList.length < 1) {
          this.showTip("请添加标准明细！");
          return false;
        }
        let standardTable = this.$refs.standardTable.getTableData();
        for (let data of standardTable) {
          if (!data.itemId.value) {
            this.showTip("请添加检测项目！");
            return false;
          }
          if (!data.itemQualityStandard.value) {
            this.showTip("请添加质量标准！");
            return false;
          }
          if (!data.methodId.value) {
            this.showTip("请添加方法！");
            return false;
          }
        }
        return true;
      },
      showTip(msg) {
        let self = this;
        self.$notify({
          title: '提示',
          message: msg,
          type: 'warning'
        });
      },

      setParam() {
        let userId = this.$store.getters.userId;
        let params = [];
        let standardTable = this.$refs.standardTable.getTableData();
        for (let data of standardTable) {
          let param = {
            standardId: "",
            itemId: data.itemId.value,
            itemQualityStandard: data.itemQualityStandard.value,
            methodId: data.methodId.value,
            userId: userId
          };
          params.push(param);
        }
        this.methodData.matrialStandradItems = params;
        this.methodData.type = this.type;
      },
      updateStandard() {
        let self = this;
        if (!self.checkValue()) {
          return;
        }
        delete self.methodData.createTime;
        delete self.methodData.updateTime;
        self.methodData.userId = self.$store.getters.userId;
        self.methodData.userName = self.$store.getters.userName;
        self.methodData.parentId = self.methodData.parentId;
        self.methodData.moduleType = self.type == 'add'?"新增质量标准":"修订质量标准";
        self.setParam();
        if(self.type == 'edit'||(self.type == 'approve') ||self.type == 'dz' ){
          self.methodData.checkStatus = '0';
        }
        let url = (this.type == 'edit'||this.type=='dz') ? "/drug/standard/updateMaterialStandard" : "/drug/standard/addMaterialStandard";
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            data: JSON.stringify(self.methodData),
            dataType: 'json',
            contentType: "application/json",
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateMaterialStandardList");
              self.$notify({
                title: '提示',
                message: "操作成功！",
                type: 'success'
              });
              self.dialogAddVisible = false;
              return
            }
            self.$notify({
              title: "提示",
              message: "版本号重复！",
              type: "warning"
            });
            this.count--;
          });
          this.count++;
        }
      },
      getMaterialList() {
        let self = this;
        self.$http({
          url: "/drug/material/queryMaterialList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.materialList = resp.result;
          }
        });
      },
      getMaterialStandardCount() {
        let self = this;
        self.$http({
          url: "/drug/standard/countMaterialStandard",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.materialStandardCount = resp.result+1;
            self.methodData.id = self.getRandom();
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
      getTestMethod() {
        let self = this;
        self.$http({
          url: "/drug/testMethod/queryAllTestMethodList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.testMethodList = resp.result;
          }
        });
      },
      getStandardItem(val) {
        let self = this;
        let param = {id: val.id, standardCode: val.standardCode,parentId: val.parentId};
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
              {"columnName": "index", "coloumNameCn": "序号","width":"55px"},
              {"columnName": "itemName", "coloumNameCn": "检测项目","columnNameRe": "itemId"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "methodName", "coloumNameCn": "方法名称","columnNameRe": "methodId"},
              {"columnName": "methodCode", "coloumNameCn": "方法编号"},
              {"columnName": "codeAttrName", "coloumNameCn": "方法属性"},
              {"columnName": "manHour", "coloumNameCn": "工时"}];
            let standardItemList = [];
            for (let data of resp.result.newVersions) {
              let row = {
                index: {value: ""},
                methodId: {value: data.methodId},
                itemId: {value: data.itemId},
                itemName: {value: data.itemName, edit: false,type:"select",list:this.testItems,tmpList:JSON.parse(JSON.stringify(this.testItems)),key:"itemName"},
                itemQualityStandard: {value: data.itemQualityStandard, edit: false,type:"input"},
                methodName: {value: data.methodName, edit: false,type:"select",list:this.testMethodList,tmpList:JSON.parse(JSON.stringify(this.testMethodList)),key:"methodName"},
                methodCode: {value: data.methodCode},
                codeAttrName: {value: data.codeAttrName},
                manHour: {value: data.manHour},
              };
              standardItemList.push(row);
            }
            self.standardItemList = standardItemList;
          }

        });
      },
      closeEdit(){
        this.$eventBus.$emit("setEditFalse");
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
      editData(val) {
        let self = this;
        this.dialogAddVisible = true;
        this.methodData = val;
        this.compareItem = this.methodData.materialGrade?this.methodData.materialGrade.substring(0,2):"";
        this.standardItemList = [];
        this.standardHistoryItemList = [];
        if(this.type !='add' && this.type !='dz'){
          this.getApplyReason();
        }
        if (this.type == 'edit') {
          this.title = "修订质量标准";
          this.dialogtitle = "修订·质量标准";
        }
        if (this.type == 'add' || this.type == 'dz') {
          this.methodData.userId = this.user.id;
          this.methodData.userName = this.user.userName;
          if(this.type == 'add'){
            this.getMaterialStandardCount();
          }
          this.title = this.type == 'add'?"新增质量标准":(this.type=='dz'?'待增质量标准':"修改质量标准");
          this.dialogtitle = this.type == 'add'?"新增·质量标准":(this.type=='dz'?"待增·质量标准":"修改·质量标准");
          this.standardLoading = true;
          this.standTableHeader = [
            {"columnName": "index", "coloumNameCn": "序号","width":"55px"},
            {"columnName": "itemName", "coloumNameCn": "检测项目","columnNameRe": "itemId"},
            {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
            {"columnName": "methodName", "coloumNameCn": "方法名称","columnNameRe": "methodId"},
            {"columnName": "methodCode", "coloumNameCn": "方法编号"},
            {"columnName": "codeAttrName", "coloumNameCn": "方法属性"},
            {"columnName": "manHour", "coloumNameCn": "工时"}
          ];
          self.$nextTick(() => {
            self.standardLoading = false;
          })
        }else{
          self.title =this.type == 'see'? "查看质量标准版本":(this.type == 'edit'?"编辑质量标准版本":"修订质量标准版本");
          self.dialogtitle =this.type == 'see'? "查看·质量标准版本":(this.type == 'edit'?"编辑·质量标准版本":"修订·质量标准版本");
          self.getStandardItem(val);
          if(this.type == 'approve'){
            self.getMaterialStandardCount();
          }
        }
        this.count = 0;
        for (let key in this.methodData) {
          if (!val.hasOwnProperty(key)) {
            val[key] = "";
          }
        }
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
    border-radius: 10px;
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
