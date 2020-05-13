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
          <span class="w3"
                style="margin-right: -0.5em;">领检人<i class="i_colon">:</i></span>
          <el-select v-model="searchParam.userId"
                     size="mini"
                     clearable
                     filterable
                     style="width: 140px">
            <el-option v-for="item in loginList"
                       :key="item.id"
                       :label="item.userName"
                       :value="item.id" />
          </el-select>
        </div>
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
    </div>
    <drug-table :backCount="backCount" @emitSpanFun="emitSpanFun"  @getBackData="getList" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
    </drug-table>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { formatDate } from '@/utils/formatDate'
import drugTable from "@/components/table/index";
import {getToken} from '@/utils/auth' // 验权
export default {
  name: '送检',
  components: { drugTable},
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:false},
      searchParam: {
        sampleCode:"",
        userId:"",
        startTime:"",
        endTime:"",
      },
      loginList:[],
      backCount:0,
    }
  },
  mounted() {
    let self = this;
    self.initPickerTime();
    self.getList(0,20);
    self.getAllLogin();
  },
  methods: {
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
        url: "/drug/sampleItem/querySampleItemDeptTaskList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          for(let data of resp.result){
            data.itemCount = data.singleCount+"/"+data.totalCount;
          }
          self.tableLoading = false;
          self.tableData = resp.result;
          if(self.tableData.length > 0){
            self.backCount = self.tableData[0].count;
          }else{
            self.backCount = 0;
          }
          self.tableHeader =  [
            {"columnName": "sampleId", "coloumNameCn": "检验单号"},
            {"columnName": "userName", "coloumNameCn": "领检人","width":"70px"},
            {"columnName": "createTimeFt", "coloumNameCn": "领检时间"},
            {"columnName": "materialCode", "coloumNameCn": "物料编码"},
            {"columnName": "itemId", "coloumNameCn": "样品名称"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "location", "coloumNameCn": "地点"},
            {"columnName": "itemCount", "coloumNameCn": "检项数"},
            {"columnName": "resultIdCn", "coloumNameCn": "结果录入"},
            {"columnName": "updateTimeFt", "coloumNameCn": "录入时间"},
            {"columnName": "checkStatusCn", "coloumNameCn": "状态","isClick":true},];
          self.option.showOperate = false;
        }
      });
    },
    emitSpanFun(row){
      let self = this;
      self.$http({
        url: "/drug/fmApprove/queryFmApproveByRelateId",
        method: "post",
        params:{relateId:row.sId}
      }).then(resp => {
        if (resp.success) {
          this.$alert(resp.result.content, '审核意见');
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
