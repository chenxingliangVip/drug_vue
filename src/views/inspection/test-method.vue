<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <div class="filter-item">
          <span>申请号<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.id"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>方法编号<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.methodCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>申请时间<i class="i_colon">:</i></span>
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
            <span>申请人<i class="i_colon">:</i></span>
            <el-input clearable  v-model="searchParam.userName"
                      size="mini"
                      style="width: 100px;"
                      @keyup.enter.native="getList" />
          </div>
          <div class="filter-item">
            <span>方法名称<i class="i_colon">:</i></span>
            <!--<el-input clearable  v-model="searchParam.methodName"-->
                      <!--size="mini"-->
                      <!--style="width: 100px;"-->
                      <!--@keyup.enter.native="getList" />-->
            <el-select v-model="searchParam.methodName"
                       size="mini"
                       clearable
                       filterable
                       style="width: 100px">
              <el-option v-for="item in tableData"
                         :key="item.id"
                         :label="item.methodName"
                         :value="item.methodName" />
            </el-select>
          </div>
          <div class="filter-item">
            <span>流程状态<i class="i_colon">:</i></span>
            <el-select v-model="searchParam.status"
                       size="mini"
                       clearable
                       style="width: 100px">
              <el-option v-for="item in statusMap"
                         :key="item.label"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </div>
          <div class="filter-item filter-item-btn-search">
            <i class="el-icon-search"  style="cursor:pointer;"
               @click="getList"></i>
          </div>
        </div>
        <div>
          <el-button class="filter-btn-item" v-if="hasRole('method:check:delete')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="danger"
                     icon="el-icon-delete"
                     @click="batchDelete">删除</el-button>
          <el-button class="filter-btn-item" v-if="hasRole('method:check:add')"
                     size="mini"
                     style="margin-left: 10px;width: 80px;"
                     type="primary"
                     icon="el-icon-edit"
                     @click="addTestMethod">新增</el-button>

        </div>
      </div>
    </div>

    <drug-table @getSelection="getSelection" :isMultipleSelection="true" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <label v-if="hasRole('method:check:see')" @click="handleEditData(props.rowData,'see')"  style="cursor:pointer;" v-show="props.rowData.checkStatus=='0'"
                 class="table-view">
            查看
          </label>
          <label v-if="hasRole('method:check:edit')" @click="handleEditData(props.rowData,'edit')" style="cursor:pointer;" v-show="props.rowData.checkStatus=='1'|| user.type =='1' "
                 class="table-view">
            修改
          </label>
          <label v-if="hasRole('method:check:imporve')" @click="handleEditData(props.rowData,'xd')" style="cursor:pointer;" v-show="props.rowData.checkStatus=='2'"
                 class="table-view">
            <template v-show="user.type =='1'">·&nbsp;</template>
             修订
          </label>
          <label v-if="hasRole('method:check:download')" @click="downExcel(props.rowData)" style="cursor:pointer;" v-show="props.rowData.checkStatus=='2'"
                 class="table-view">
            ·&nbsp;下载
          </label>
        </div>
      </template>
    </drug-table>
    <method-dialog :editData="detailData" :type="operateType"></method-dialog>
    <form action="/drug/file/downloadFile" method="post"
          style="display: none;" ref="downloadFile">
      <input name="path" :value="downPath"/>
    </form>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { parseTime } from '@/utils'
import drugTable from "@/components/table/index";
import methodDialog from  "./dialog/method"
import { formatDate } from '@/utils/formatDate'
import {getToken} from '@/utils/auth' // 验权
export default {
  name: '检验方法',
  components: { drugTable,methodDialog },
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      statusMap:[{label:"审核中",value:"0"},{label:"完成",value:"2"},{label:"驳回",value:"1"}],
      searchParam: {
        id:"",
        methodCode:"",
        startTime:"",
        endTime:"",
        userName:"",
        methodName:"",
        status:"",
      },
      detailData:{},
      operateType:"add",
      user:{},
      selectChoice:[],
      downPath:""
    }
  },
  mounted() {
    let self = this;
    self.getList();
    let user = JSON.parse(getToken());
    this.user = user;
    self.$eventBus.$on("updateTestMethodList",function () {
      self.getList();
    })
  },
  methods: {
    getList() {
      let self = this;
      self.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      self.$http({
        url: "/drug/testMethod/queryTestMethodList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          self.tableHeader =  [
            {"columnName": "createTimeFt", "coloumNameCn": "时间","width":"90px"},
            {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
            {"columnName": "id", "coloumNameCn": "申请号"},
            {"columnName": "methodCode", "coloumNameCn": "方法编码"},
            {"columnName": "methodName", "coloumNameCn": "方法名称"},
            {"columnName": "codeAttrName", "coloumNameCn": "方法属性","width":"70px"},
            {"columnName": "manHour", "coloumNameCn": "工时","width":"50px"},
            {"columnName": "methodDescSummary", "coloumNameCn": "检测方法"},
            {"columnName": "testRecordSummary", "coloumNameCn": "检测记录"},
            {"columnName": "checkStatusCn", "coloumNameCn": "状态"},];
          self.option.showOperate = true;
        }
      });
    },
    getSelection(val){
      this.selectChoice = val;
    },

    downExcel(row){
      let self = this;
      let day =  formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      let cellList = [];
      cellList.push(this.getCell("方法编码",0,"EEEEEE"));
      cellList.push(this.getCell(row.methodCode,0));
      cellList.push(this.getCell("申 请 号",0,"EEEEEE"));
      cellList.push(this.getCell(row.id,0));
      cellList.push(this.getCellCode(row.id,0));

      cellList.push(this.getCell("检项名称",1,"EEEEEE"));
      cellList.push(this.getCell(row.itemName,1));


      cellList.push(this.getCell("方法属性",2,"EEEEEE"));
      cellList.push(this.getCell(row.codeAttrName,2));
      cellList.push(this.getCell("工    时",2));
      cellList.push(this.getCell(row.manHour,2));

      cellList.push(this.getCell("方法类别",3,"EEEEEE"));
      cellList.push(this.getCell(row.methodType,3));
      cellList.push(this.getCell("申 请 人",3,"EEEEEE"));
      cellList.push(this.getCell(row.userName,3));

      cellList.push(this.getCell("部    门",4,"EEEEEE"));
      cellList.push(this.getCell("",4));
      cellList.push(this.getCell("申请时间",4,"EEEEEE"));
      cellList.push(this.getCell(row.createTimeFt,4));
      let splitRow = [];
      splitRow.push("4,3,4,0");
      splitRow.push("2,0,1,1");
      splitRow.push("3,0,1,1");
      splitRow.push("4,0,3,1");
      let param ={
        id:row.id,
        title:"检验记录单",
        sampleCode:row.id,
        printPerson:"打印人："+this.user.userName +" "+day,
        graphWordList:[
          {
            title:"No.1 检样信息",
            colIndex:5,
            cellList:[],
            splitRow:[]
          },
          {
            title:"No.2 检验方法",
            colIndex:4,
            cellList:[],
            splitRow:[]
          }
        ]
      };

      param.graphWordList[0].cellList = cellList;
      param.graphWordList[0].splitRow = splitRow;

      let cellList1 = [];
      cellList1.push(this.getCell(row.methodDescSummary,0));
      cellList1.push(this.getCell("",0));

      cellList1.push(this.getCell(row.testRecordSummary,0));
      cellList1.push(this.getCell("",0));
      for(let i = 1;i<9;i++){
        cellList1.push(this.getCell("",i));
        cellList1.push(this.getCell("",i));
        cellList1.push(this.getCell("",i));
        cellList1.push(this.getCell("",i));
      }
      cellList1.push(this.getCell("检验人",9));
      cellList1.push(this.getCell(row.userName,9));

      cellList1.push(this.getCell("检 验 时 间",9));
      cellList1.push(this.getCell("  "+row.updateTimeFt+"  ",9));

      cellList1.push(this.getCell("说  明",10));
      cellList1.push(this.getCell(row.remark,10));
      cellList1.push(this.getCell("",10));
      cellList1.push(this.getCell("",10));

      let splitRow1 = [];
      splitRow1.push("0,0,8,1");
      splitRow1.push("1,0,8,1");
      splitRow1.push("2,0,8,1");
      splitRow1.push("3,0,8,1");
      splitRow1.push("0,0,1,0");
      splitRow1.push("0,2,3,0");
      splitRow1.push("1,0,1,0");
      splitRow1.push("1,2,3,0");
      splitRow1.push("2,0,1,0");
      splitRow1.push("2,2,3,0");
      splitRow1.push("3,0,1,0");
      splitRow1.push("3,2,3,0");
      splitRow1.push("4,0,1,0");
      splitRow1.push("4,2,3,0");
      splitRow1.push("5,0,1,0");
      splitRow1.push("5,2,3,0");
      splitRow1.push("6,0,1,0");
      splitRow1.push("6,2,3,0");
      splitRow1.push("7,0,1,0");
      splitRow1.push("7,2,3,0");
      splitRow1.push("8,0,1,0");
      splitRow1.push("8,2,3,0");
      splitRow1.push("10,1,3,0");

      param.graphWordList[1].cellList = cellList1;
      param.graphWordList[1].splitRow = splitRow1;

      self.$http({
        url: "/drug/sample/queryTestMethodPath",
        method: "post",
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
      }).then(resp => {
        if (resp.success) {
          self.downPath = resp.result;
          self.$nextTick(()=>{
            self.$refs.downloadFile.submit();
          });
        }
      });
    },
    getCell(text,index,backGround){
      let cell = {
        text:text,
        fontSize:11,
        family:"黑体",
        index:index?index:0
      };
      if(backGround){
        cell.backGround = "EEEEEE"
      }
      return cell;
    },

    getCellCode(text){
      let cell = {
        code:text,
        index:0
      };
      return cell;
    },
    handleEditData(rowData,type){
      this.detailData = Object.assign({},rowData);
      this.operateType = type;
    },
    addTestMethod(){
      this.detailData =  {
          id: "",
          itemName:"",
          methodType: "",
          methodName: "",
          methodCode: "",
          codeAttrId: "",
          manHour: "",
          methodVersion: "S0",
          testRecord: "",
          methodDesc: "",
          methodJudge: "",
          remark: ""
      };
      this.operateType = "add";
    },

    batchDelete(){
      let param = {ids:[],methodCode:""};
      let methodCodes = [];
      for(let data of this.selectChoice){
        param.ids.push(data.id);
        methodCodes.push(data.methodCode);
      }
      param.methodCode = methodCodes.join(",");
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
          url: "/drug/testMethod/deleteTestMethod",
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
.el-button-version {
  .el-button--mini {
    padding: 0;
  }
}
</style>


<style lang="scss" scoped>
.el-button-version {
  display: flex;
  flex-direction: row-reverse;
}
</style>
