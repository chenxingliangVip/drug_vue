<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <div class="filter-item">
          <span>检验单号<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.sampleCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>样品名称<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.materialName"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <!--<div class="filter-item">-->
          <!--<span class="w3"-->
                <!--style="margin-right: -0.5em;">送检人<i class="i_colon">:</i></span>-->
          <!--<el-select v-model="searchParam.userId"-->
                     <!--size="mini"-->
                     <!--clearable-->
                     <!--filterable-->
                     <!--style="width: 140px">-->
            <!--<el-option v-for="item in loginList"-->
                       <!--:key="item.id"-->
                       <!--:label="item.userName"-->
                       <!--:value="item.id" />-->
          <!--</el-select>-->
        <!--</div>-->
        <div class="filter-item">
          <span>领检时间<i class="i_colon">:</i></span>
          <el-date-picker v-model="searchParam.startTime"
                          size="mini"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          type="date"
                          style="width: 140px;">
          </el-date-picker>
          <span> - </span>
          <el-date-picker v-model="searchParam.endTime"
                          size="mini"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          type="date"
                          style="width: 140px;">
          </el-date-picker>
        </div>
        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor:pointer;"
             @click="getList">
          </i></div>
      </div>
      <div v-if="hasRole('send:dept:contrast')">
        <el-button class="filter-btn-item same-contrast"
                   size="mini"
                   style="margin-left: 10px;width: 80px;float: right;"
                   type="green"
                   @click="sameContrast">
          同样对比
        </el-button>
      </div>
    </div>
    <drug-table :backCount="backCount"   @getSelection="getSelection" :isMultipleSelection="true"   @getBackData="getList" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div  v-if="hasRole('send:dept:see')">
          <label @click="handleEditData(props.rowData)"
                 class="table-view" style="cursor: pointer;">
            查看
          </label>
        </div>
      </template>
    </drug-table>
    <same-contrast></same-contrast>
    <send-see></send-see>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { formatDate } from '@/utils/formatDate'
import drugTable from "@/components/table/index";
import {getToken} from '@/utils/auth' // 验权
import sendSee from "./dialog/sendSee"
import sameContrast from "./dialog/sameContrast"
export default {
  name: '送检',
  components: { drugTable,sendSee,sameContrast},
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:false},
      searchParam: {
        sampleCode:"",
        materialName:"",
        userId:"",
        startTime:"",
        endTime:"",
      },
      loginList:[],
      backCount:0,
      detailData:{},
      selectChoice:[]
    }
  },
  mounted() {
    let self = this;
    self.initPickerTime();
    self.getList(0,20);
    self.getAllLogin();
  },
  methods: {

    getSelection(val){
      this.selectChoice = val;
    },

    sameContrast() {
      let choiceIds = [];
      if (this.selectChoice.length == 0) {
        this.$notify({
          title: '提示',
          message: "请选择对比项！",
          type: 'warning'
        });
        return;
      }
      if (this.selectChoice.length == 1) {
        this.$notify({
          title: '提示',
          message: "请至少选择两项对比！",
          type: 'warning'
        });
        return;
      }
      let materialName = "";
      for (let data of this.selectChoice) {
        if (!materialName) {
          materialName = data.materialName;
        }
        if (materialName != data.materialName) {
          this.$notify({
            title: '提示',
            message: "请选择相同样品名称对比！",
            type: 'warning'
          });
          return;
        }
        choiceIds.push(data.sampleCode);
      }
      this.$eventBus.$emit("openSameContrast",materialName,this.searchParam,choiceIds);
    },

    handleEditData(rowData){
      this.detailData = Object.assign({},rowData);
      this.detailData.materialTypeId = this.detailData.materialType;
      this.detailData.materialGradeId = this.detailData.materialGrade;
      this.$eventBus.$emit("openSendSee",this.detailData);
    },

    initPickerTime(){
      let year = formatDate(new Date(), "yyyy");
      let mouth = formatDate(new Date(), "MM");
      let day = new Date(parseInt(year),parseInt(mouth),0).getDate();
      day = day > 10 ?(day+""):("0"+day);
      this.searchParam.startTime = year+"-"+mouth+"-01";
      this.searchParam.endTime = year+"-"+mouth +"-" +day;
    },
    getAllLogin() {
      let self = this;
      self.$http({
        url: "/drug/queryAllLoginList",
        method: "post"
      }).then(resp => {
        if (resp.success) {
          self.loginList = resp.result;
        }
      });
    },
    getList(startIndex,pageRow) {
      let self = this;
      self.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      let start = typeof startIndex =="number"?startIndex:0;
      let total = typeof pageRow == "number"?pageRow:15;
      searchParam.startIndex = start;
      searchParam.totalPage = total;
      let user = JSON.parse(getToken());
      searchParam.deptId = user.deptId;
      self.$http({
        url: "/drug/sample/querySampDeptTaskList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.backCount = self.tableData.length > 0?self.tableData[0].count:0;
          self.tableHeader =  [
            {"columnName": "sampleCode", "coloumNameCn": "检验单号"},
            {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
            {"columnName": "createTimeSecondFt", "coloumNameCn": "送检时间"},
            {"columnName": "materialName", "coloumNameCn": "样品名称"},
            {"columnName": "sampleNum", "coloumNameCn": "样品批号"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "sampleTypeName", "coloumNameCn": "样品规模"},
            {"columnName": "locationName", "coloumNameCn": "送样地点"},
            {"columnName": "checkStatusCn", "coloumNameCn": "流程状态"}];
          self.option.showOperate = true;
        }
      });
    },
  },
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
.same-contrast {
	background: #2e827f;
	&:hover {
		opacity: .8;
	}
}

</style>
