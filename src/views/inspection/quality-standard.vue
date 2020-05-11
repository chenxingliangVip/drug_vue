<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <div class="filter-item">
          <span>申请号:</span>
          <el-input clearable  v-model="searchParam.id"
                    size="mini"
                    style="width: 90px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>审核状态:</span>
          <el-select v-model="searchParam.checkStatus"
                     size="mini"
                     clearable
                     style="width: 90px">
            <el-option v-for="item in statusMap"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </div>
        <div class="filter-item">
          <span>物料等级:</span>
          <el-select v-model="searchParam.materialGradeId"
                     size="mini"
                     clearable
                     style="width: 90px">
            <el-option v-for="item in levels"
                       :key="item.id"
                       :label="item.itemName"
                       :value="item.id"/>
          </el-select>
        </div>
        <div class="filter-item">
          <span>物料规格:</span>
          <el-select v-model="searchParam.materialTypeId"
                     size="mini"
                     clearable
                     style="width: 90px">
            <el-option v-for="item in grades"
                       :key="item.id"
                       :label="item.itemName"
                       :value="item.id"/>
          </el-select>
        </div>
        <div class="filter-item">
          <span>物料编码:</span>
          <!--<el-select v-model="searchParam.state"-->
                     <!--size="mini"-->
                     <!--clearable-->
                     <!--style="width: 90px">-->
            <!--<el-option v-for="item in levels"-->
                       <!--:key="item.id"-->
                       <!--:label="item.itemName"-->
                       <!--:value="item.id"/>-->
          <!--</el-select>-->
          <el-input clearable  v-model="searchParam.materialCode"
                    size="mini"
                    style="width: 90px;"
                    @keyup.enter.native="getList" />
        </div>
      </div>

      <div>
        <div class="filter-item">
          <span>申请人:</span>
          <!--<el-input clearable  v-model="searchParam.userName"-->
                    <!--size="mini"-->
                    <!--style="width: 90px;"-->
                    <!--@keyup.enter.native="getList" />-->
          <el-select v-model="searchParam.userId"
                     size="mini"
                     clearable
                     filterable
                     style="width: 90px">
            <el-option v-for="item in loginList"
                       :key="item.id"
                       :label="item.userName"
                       :value="item.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span>标准编码:</span>
          <el-input clearable  v-model="searchParam.standardCode"
                    size="mini"
                    style="width: 90px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span >物料名称:</span>
          <el-input clearable  v-model="searchParam.materialName"
                    size="mini"
                    style="width: 90px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>申请时间:</span>
          <el-date-picker v-model="searchParam.startTime"
                          size="mini"
                          type="date"
                          style="width: 130px;"></el-date-picker>
          <span>&nbsp;-</span>
          <el-date-picker v-model="searchParam.endTime"
                          size="mini"
                          type="date"
                          style="width: 130px;"></el-date-picker>
        </div>
        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor: pointer"
             @click="getList"></i>
        </div>
        <el-button class="filter-btn-item" v-if="hasRole('standard:check:delete')"
                   size="mini"
                   style="margin-left: 1px;width: 70px;"
                   type="danger"
                   icon="el-icon-delete"
                   @click="batchDelete">删除</el-button>
        <!--<el-button class="filter-btn-item" v-if="hasRole('standard:check:add')"-->
                   <!--size="mini"-->
                   <!--style="margin-left: 5px;width: 70px;"-->
                   <!--type="primary"-->
                   <!--icon="el-icon-edit"-->
                   <!--@click="addMaterialStandard">新增</el-button>-->
      </div>
    </div>
    <drug-table @getSelection="getSelection" :isMultipleSelection="true" :tableData="tableData"
                :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div>
          <label v-show="props.rowData.checkStatus=='4'" @click="addMaterialStandard(props.rowData,'dz')" v-if="hasRole('standard:check:add')"
                 class="table-view">
            待增
          </label>
          <label v-show="props.rowData.checkStatus!='4'" @click="lookDetail(props.rowData,'see')" v-if="hasRole('standard:check:see')"
                 class="table-view">
            查看
          </label>
          <span v-show="props.rowData.checkStatus!='0' && props.rowData.checkStatus!='4'">·</span>
          <label @click="lookDetail(props.rowData,'edit')" v-if="hasRole('standard:check:edit')"
                 class="table-view" v-show="props.rowData.checkStatus=='1' && props.rowData.checkStatus!='4'">
            编辑
          </label>
          <label  v-show="props.rowData.checkStatus=='2'&&props.rowData.checkStatus!='4'" @click="lookDetail(props.rowData,'approve')" v-if="hasRole('standard:check:imporve')"
                 class="table-view">
            修订
          </label>
        </div>
      </template>
    </drug-table>
    <standard :editData="detailData" :type="operateType"></standard>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import drugTable from "@/components/table/index";
import standard from "./dialog/standard"
import {getToken} from '@/utils/auth' // 验权

export default {
  name: '检验方法',
  components: { drugTable,standard },
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      tableLoading: true,
      option: {showOperate: true},
      statusMap: [{label: "审核中", value: "0"}, {label: "完成", value: "2"}, {label: "驳回", value: "1"}],
      searchParam: {
        id:"",
        userName: "",
        materialCode: "",
        startTime: "",
        endTime: "",
        materialGradeId: "",
        materialTypeId: "",
        materialName: "",
        finalProd: "",
        checkStatus:"",
        userId:"",
        standardCode:""
      },
      loginList:[],
      detailData: {},
      operateType: "add",

      selectChoice: [],
      grades:[],
      levels:[],
      statusMap: [{label: "审核中", value: "0"}, {label: "完成", value: "2"}, {label: "驳回", value: "1"}],
    }
  },

  mounted() {
    let self = this;
    self.getList();
    self.getCodeAttrList();
    self.getLevelList();
    self.getAllLogin();
    self.$eventBus.$on("updateMaterialStandardList", function () {
      self.getList();
    })
  },
  methods: {

    getAllLogin(){
      let self = this;
      self.$http({
        url: "/drug/queryAllLoginList",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          self.loginList = resp.result;
        }
      });
    },

    getSelection(val) {
      this.selectChoice = val;
    },
    getCodeAttrList() {
      let self = this;
      self.$http({
        url: "/drug/codeItem/queryCodeItemList",
        method: "post",
        params: {itemCode: "type"}
      }).then(resp => {
        if (resp.success) {
          self.grades = resp.result;
        }
      });
    },
    getLevelList() {
      let self = this;
      self.$http({
        url: "/drug/codeItem/queryCodeItemList",
        method: "post",
        params: {itemCode: "grade"}
      }).then(resp => {
        if (resp.success) {
          self.levels = resp.result;
        }
      });
    },
    getList() {
      let self = this;
      let user = JSON.parse(getToken());
      if(user.type !='1'){
        this.searchParam.userId = user.id;
      }
      self.tableLoading = true;
      let searchParam = Object.assign({}, this.searchParam);
      if (searchParam.endTime) {
        searchParam.endTime = searchParam.endTime + " 23:59:59";
      }
      self.$http({
        url: "/drug/standard/queryMaterialStandardList",
        method: "post",
        params: searchParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader = [
            {"columnName": "createTimeFt", "coloumNameCn": "时间", "width": "90px"},
            {"columnName": "id", "coloumNameCn": "申请号", "width": "70px"},
            {"columnName": "userName", "coloumNameCn": "申请人", "width": "70px"},
            {"columnName": "standardCode", "coloumNameCn": "标准编码"},
            {"columnName": "materialName", "coloumNameCn": "物料名称"},
            {"columnName": "materialType", "coloumNameCn": "规格"},
            {"columnName": "materialGrade", "coloumNameCn": "等级"},
            {"columnName": "materialCode", "coloumNameCn": "物料编码"},
            {"columnName": "remark", "coloumNameCn": "补充说明"},
            {"columnName": "checkStatusCn", "coloumNameCn": "状态", "width": "60px"},];
          self.option.showOperate = true;
        }
      });
    },

    lookDetail(rowData,type){
      this.detailData = Object.assign({},rowData);
      this.operateType = type;
    },

    addMaterialStandard(row,type){
      this.detailData = {
        id: "",
        createTime:new Date(),
        userName:"",
        standardCode:"",
        version: "",
        remark:"",
        materialCode:"",
        materialType:"",
        materialName:"",
        materialGrade:"",
        materialUserName:"",
        materialDateFt:""
      };
      if(row){
        this.detailData = Object.assign({},row);
      }
      this.operateType = type?type:"add";
    },
    handleEditData(rowData) {
      this.detailData = Object.assign({}, rowData);
      this.operateType = "edit";
    },
    batchDelete(){
      let param = {ids:[],id:""};
      for(let data of this.selectChoice){
        param.ids.push(data.id);
      }
      param.id = param.ids.join(",");
      param.userName = this.$store.getters.userName;
      this.deleteRow(param);
    },
    deleteRow(param) {
      let self = this;
      if(!param || param.ids.length < 1){
        self.$notify({
          title: '提示',
          message: "至少选择一条记录！",
          type: 'warning'
        });
        return
      }
      self.$confirm('确定删除该信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http({
          url: "/drug/standard/deleteMaterialStandard",
          method: "post",
          data: JSON.stringify(param),
          dataType: 'json',
          contentType: "application/json",
        }).then(resp => {
          if (resp.success) {
            self.getList();
            self.$notify({
              title: '提示',
              message: "删除成功！",
              type: 'success'
            });
            return
          }
          self.$notify({
            title: '提示',
            message: "操作失败，请联系管理员！",
            type: 'error'
          });
        });
      });
    },
  }
}
</script>

<style lang="scss" >
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
