<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <div class="filter-item">
          <!--<span>物料名称:</span>-->
          <!--<el-input clearable  v-model="searchParam.materialName"-->
                    <!--size="mini"-->
                    <!--style="width: 100px;"-->
                    <!--@keyup.enter.native="getList"/>-->
          <span>物料名称:</span>
          <el-select v-model="searchParam.materialName"
                     size="mini"
                     clearable
                     filterable
                     style="width: 100px">
            <el-option v-for="item in tableData"
                       :key="item.id"
                       :label="item.materialName"
                       :value="item.materialName"/>
          </el-select>

        </div>
        <div class="filter-item">
          <span>物料编码:</span>
          <el-input clearable  v-model="searchParam.materialCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList"/>
        </div>
        <div class="filter-item">
          <span>申请时间:</span>
          <el-date-picker v-model="searchParam.startTime"
                          size="mini"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          style="width: 140px;"></el-date-picker>
          <span>&nbsp;-</span>
          <el-date-picker v-model="searchParam.endTime"
                          size="mini"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          style="width: 140px;"></el-date-picker>
        </div>
      </div>
      <div class="flex-row-space-between">
        <div>
          <div class="filter-item">
            <span> 申 请 人  : </span>
            <el-input clearable  v-model="searchParam.userName"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList"/>
          </div>
          <div class="filter-item">
            <span >参考物料:</span>
            <el-input clearable  v-model="searchParam.refItem"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList"/>
          </div>
          <div class="filter-item">
            <span class="w2"
                  style="margin-right:-2em">规格</span><span>:</span>
            <el-select v-model="searchParam.materialTypeId"
                       size="mini"
                       clearable
                       style="width: 100px">
              <el-option v-for="item in grades"
                         :key="item.id"
                         :label="item.itemName"
                         :value="item.id"/>
            </el-select>
          </div>
          <div class="filter-item"
               style="margin-left:13px;">
            <span class="w2"
                  style="margin-right:-2em">等级</span><span>:</span>
            <el-select v-model="searchParam.materialGradeId"
                       size="mini"
                       clearable
                       style="width: 100px">
              <el-option v-for="item in levels"
                         :key="item.id"
                         :label="item.itemName"
                         :value="item.id"/>
            </el-select>
          </div>
          <div class="filter-item filter-item-btn-search">
            <i class="el-icon-search" style="cursor:pointer;"
               @click="getList"></i>
          </div>
        </div>
        <div>
          <el-button class="filter-btn-item" v-if="hasRole('material:send:delete')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="info"
                     icon="el-icon-delete"
                     @click="batchDelete">删除
          </el-button>
          <el-button class="filter-btn-item" v-if="hasRole('material:send:add')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="primary"
                     icon="el-icon-edit"
                     @click="addMaterial">新增
          </el-button>
        </div>
      </div>
    </div>

    <drug-table @getSelection="getSelection" :isMultipleSelection="true" :tableData="tableData"
                :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div>
          <label @click="handleSeeData(props.rowData)" v-if="hasRole('material:send:see')"
                 class="table-view">
            查看
          </label>
          <label v-if="hasRole('material:send:edit')"  @click="handleEditData(props.rowData)" v-show="props.rowData.checkStatus =='1'"
                 class="table-view">
            · 编辑
          </label>
        </div>
      </template>
    </drug-table>
    <material-edit :materialList="tableData" :editData="detailData" :type="operateType" :levels="levels" :grades="grades"></material-edit>
  </div>
</template>

<script>
  import waves from '@/views/directive/waves' // waves directive
  import {sortStr} from '@/utils/common.js'
  import drugTable from "@/components/table/index";
  import materialEdit from "./dialog/editMaterial"

  export default {
    name: 'ComplexTable',
    components: {drugTable,materialEdit},
    directives: {waves},
    data() {
      return {
        tableData: [],
        tableHeader: [],
        tableLoading: true,
        option: {showOperate: true},
        statusMap: [{label: "审核中", value: "0"}, {label: "完成", value: "2"}, {label: "驳回", value: "1"}],
        searchParam: {
          materialCode: "",
          startTime: "",
          endTime: "",
          userName: "",
          refItem: "",
          materialGradeId: "",
          materialTypeId: "",
          materialName: "",
        },
        detailData: {},
        operateType: "add",

        selectChoice: [],
        grades:[],
        levels:[],
      }
    },
    mounted() {
      let self = this;
      self.getList();
      self.getCodeAttrList();
      self.getLevelList();
      self.$eventBus.$on("updateMaterialList", function () {
        self.getList();
      })
    },
    methods: {
      getList() {
        let self = this;
        self.tableLoading = true;
        let searchParam = Object.assign({}, this.searchParam);
        if (searchParam.endTime) {
          searchParam.endTime = searchParam.endTime + " 23:59:59";
        }
        self.$http({
          url: "/drug/material/queryMaterialList",
          method: "post",
          params: searchParam
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            self.tableData = resp.result;
            self.tableHeader = [
              {"columnName": "materialNum", "coloumNameCn": "申请号"},
              {"columnName": "createTimeFt", "coloumNameCn": "时间", "width": "90px"},
              {"columnName": "userName", "coloumNameCn": "申请人", "width": "70px"},
              {"columnName": "materialCode", "coloumNameCn": "物料编码"},
              {"columnName": "materialName", "coloumNameCn": "物料名称"},
              {"columnName": "materialTypeName", "coloumNameCn": "规格"},
              {"columnName": "materialGradeName", "coloumNameCn": "等级"},
              {"columnName": "nameAbbr", "coloumNameCn": "英文简称"},
              {"columnName": "refItem", "coloumNameCn": "参考物料"},
              // {"columnName": "finalProd", "coloumNameCn": "终产品"},
              {"columnName": "remark", "coloumNameCn": "说明"},
              {"columnName": "checkMaterialStatusCn", "coloumNameCn": "状态", "width": "60px"},];
            self.option.showOperate = true;
          }
        });
      },
      getSelection(val) {
        this.selectChoice = val;
      },
      addMaterial(){
        this.detailData =  {
          materialName: "",
          finalProd: "",
          nameAbbr: "",
          materialGradeId: "",
          refItem: "",
          materialTypeId: "",
          materialCode:"",
          artNode:"",
          materialDescr:"",
          remark:"",
          materialNum:"",
        };
        this.operateType = "add";
      },
      handleSeeData(rowData) {
        this.detailData = Object.assign({}, rowData);
        this.operateType = "see";
      },

      handleEditData(rowData) {
        this.detailData = Object.assign({}, rowData);
        this.operateType = "edit";
      },
      batchDelete(){
        let param = {ids:[],materialCode:""};
        let materialCodes = [];
        for(let data of this.selectChoice){
          param.ids.push(data.id);
          materialCodes.push(data.materialCode);
        }
        param.materialCode = materialCodes.join(",");
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
            url: "/drug/material/deleteMaterial",
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
            let sortArray = sortStr(resp.result,"serialNo");
            self.levels = sortArray;
          }
        });
      },
    }
  }
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
</style>
