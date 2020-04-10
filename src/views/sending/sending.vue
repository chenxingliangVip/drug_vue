<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <div class="filter-item">
          <span>检验单号:</span>
          <el-input clearable  v-model="searchParam.sampleCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span class="w3"
                style="margin-right: -0.5em;">申请人</span><span>:</span>
          <el-input clearable  v-model="searchParam.userName"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>样品名称:</span>
          <el-input clearable  v-model="searchParam.materialName"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>样品规格:</span>
          <el-select v-model="searchParam.materialTypeId"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in codeItemMap.type"
                       :key="item.id"
                       :label="item.itemName"
                       :value="item.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span>流程状态:</span>
          <el-select v-model="searchParam.checkStatus"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in statusMap"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </div>
        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor:pointer;"
             @click="getList">
          </i></div>
      </div>
      <div>
        <div class="filter-item">
          <span>样品编码:</span>
          <el-input clearable  v-model="searchParam.materialCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>送样地点:</span>
          <el-select v-model="searchParam.locationId"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in codeItemMap.location"
                       :key="item.id"
                       :label="item.itemName"
                       :value="item.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span>样品规模:</span>
          <el-select v-model="searchParam.sampleTypeId"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in codeItemMap.scope"
                       :key="item.id"
                       :label="item.itemName"
                       :value="item.id" />
          </el-select>

        </div>
        <div class="filter-item">
          <span>样品等级:</span>
          <el-select v-model="searchParam.materialGradeId"
                     size="mini"
                     clearable
                     style="width: 100px">
            <el-option v-for="item in codeItemMap.grade"
                       :key="item.id"
                       :label="item.itemName"
                       :value="item.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span>送检时间:</span>
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
      </div>
      <div>
        <el-button class="filter-btn-item" v-if="hasRole('yangpin:send:delete')"
                   size="mini"
                   style="margin-left: 10px;width: 80px;"
                   type="info"
                   icon="el-icon-delete"
                   @click="batchDelete">
          删除
        </el-button>
        <el-button class="filter-btn-item" v-if="hasRole('yangpin:send:add')"
                   size="mini"
                   style="margin-left: 10px;width: 80px;"
                   type="primary"
                   icon="el-icon-edit"
                   @click="addSend">
          新增
        </el-button>
      </div>
    </div>
    <drug-table :backCount="backCount" @getSelection="getSelection" @getBackData="getList" :isMultipleSelection="true" :tableData="tableData" :tableLoading="tableLoading" :tableHeader="tableHeader" :option="option">
      <template slot-scope="props" slot="operate">
        <div >
          <label @click="handleEditData(props.rowData)" v-if="hasRole('yangpin:send:see')"
                 class="table-view" style="cursor: pointer;">
            查看
          </label>
          <label @click="generateRecord(props.rowData)" v-if="props.rowData.checkStatus == '5' && hasRole('yangpin:send:report')"
                 class="table-view" style="cursor: pointer;">
            · &nbsp;报告
          </label>
        </div>
      </template>
    </drug-table>
    <send-edit ></send-edit>
    <send-see></send-see>
    <form action="/drug/file/downloadFile" method="post"
          style="display: none;" ref="downloadFile">
      <input name="path" :value="downPath"/>
    </form>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { formatDate } from '@/utils/formatDate'
import drugTable from "@/components/table/index";
import sendEdit from "./dialog/sendEdit"
import sendSee from "./dialog/sendSee"
import {getToken} from '@/utils/auth' // 验权
export default {
  name: '送检',
  components: { drugTable,sendEdit,sendSee },
  directives: { waves },
  data() {
    return {
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      statusMap:[
        {label:"待领检",value:"0"},
        {label:"未送样",value:"1"},
        {label:"检测中",value:"2"},
        {label:"复检",value:"3"},
        {label:"拒绝",value:"4"},
        {label:"完成",value:"5"}
        ],
      searchParam: {
        sampleCode:"",
        userName:"",
        startTime:"",
        endTime:"",
        materialName:"",
        materialGradeId:"",
        checkStatus:"",
        materialCode:"",
        locationId:"",
        sampleTypeId:"",
        materialTypeId:"",
      },
      detailData:{},
      operateType:"add",

      selectChoice:[],

      backCount:0,
      codeItemMap:{location:[],type:[],dept:[],grade:[],scope:[]},
      downPath:""
    }
  },
  mounted() {
    let self = this;
    let user = JSON.parse(getToken());
    this.user = user;
    self.getList(0,20);
    self.getItemCode();
    self.$eventBus.$on("updateSampleList",function () {
      for(let key in self.searchParam){
        self.searchParam[key] = "";
      }
      self.getList(0,20);
    })
  },
  methods: {

    generateRecord(row){
      let self = this;
      let cellList = [];
      cellList.push(this.getCell("物料编码",0,"EEEEEE"));
      cellList.push(this.getCell(row.materialCode,0));
      cellList.push(this.getCell("检 验 号",0,"EEEEEE"));
      cellList.push(this.getCell(row.sampleCode,0));
      cellList.push(this.getCellCode(row.sampleCode,0));

      cellList.push(this.getCell("样品名称",1,"EEEEEE"));
      cellList.push(this.getCell(row.materialName,1));


      cellList.push(this.getCell("样品规格",2,"EEEEEE"));
      cellList.push(this.getCell(row.materialType,2));
      cellList.push(this.getCell("样品规模",2,"sampleTypeName"));
      cellList.push(this.getCell(row.materialType,2));

      cellList.push(this.getCell("样品等级",3,"EEEEEE"));
      cellList.push(this.getCell(row.materialGrade,3));
      cellList.push(this.getCell("申 请 人",3,"EEEEEE"));
      cellList.push(this.getCell(row.userName,3));

      cellList.push(this.getCell("样品批号",4,"EEEEEE"));
      cellList.push(this.getCell(row.sampleNum,4));
      cellList.push(this.getCell("申请时间",4,"EEEEEE"));
      cellList.push(this.getCell(row.createTimeFt,4));
      let splitRow = [];
      splitRow.push("4,3,4,0");
      splitRow.push("2,0,1,1");
      splitRow.push("3,0,1,1");
      splitRow.push("4,0,3,1");
      let day =  formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      let param ={
        id:row.id,
        sampleCode:row.sampleCode,
        title:"检验报告",
        printPerson:"打印人："+this.user.userName +" "+day,
        graphWordList:[
          {
            title:"No.1 检样信息",
            colIndex:5,
            cellList:[],
            splitRow:[]
          },
          {
            title:"",
            colIndex:5,
            cellList:[],
            splitRow:[]
          },
          {
            title:"",
            colIndex:4,
            cellList:[],
            splitRow:[]
          }
        ]
      };
      param.graphWordList[0].cellList = cellList;
      param.graphWordList[0].splitRow = splitRow;

      let cellList1 = [];
      cellList1.push(this.getCell("检项",0,"EEEEEE"));
      cellList1.push(this.getCell("质量标准",0,"EEEEEE"));
      cellList1.push(this.getCell("检验结果",0,"EEEEEE"));
      cellList1.push(this.getCell("备注",0,"EEEEEE"));
      cellList1.push(this.getCell("工时",0,"EEEEEE"));

      param.graphWordList[1].cellList = cellList1;

      let cellList2 = [];
      cellList2.push(this.getCell("审批状态",0,"EEEEEE"));
      cellList2.push(this.getCell("",0));
      cellList2.push(this.getCell("审批人",0,"EEEEEE"));
      cellList2.push(this.getCell("",0));

      cellList2.push(this.getCell("审批时间",1,"EEEEEE"));
      cellList2.push(this.getCell("审批时间",1));
      cellList2.push(this.getCell("审批意见",1,"EEEEEE"));
      cellList2.push(this.getCell("审批意见",1));

      param.graphWordList[2].cellList = cellList2;

      self.$http({
        url: "/drug/sample/querySamplePath",
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

    getList(startIndex,pageRow) {
      let self = this;
      self.tableLoading = true;
      let searchParam = Object.assign({},this.searchParam);
      if(searchParam.endTime){
        searchParam.endTime = searchParam.endTime+" 23:59:59";
      }
      let start = typeof startIndex =="number"?startIndex:0;
      let total = typeof pageRow == "number"?pageRow:20;
      searchParam.startIndex = start;
      searchParam.totalPage = total;
      self.$http({
        url: "/drug/sample/querySampleList",
        method: "post",
        params:searchParam
      }).then(resp => {
        if (resp.success) {
          self.tableLoading = false;
          self.tableData = resp.result;
          if(self.tableData.length > 0){
            self.backCount = self.tableData[0].count;
          }
          self.tableHeader =  [
            {"columnName": "sampleCode", "coloumNameCn": "检单号"},
            {"columnName": "userName", "coloumNameCn": "申请人","width":"70px"},
            {"columnName": "createTimeFt", "coloumNameCn": "送检时间"},
            {"columnName": "materialName", "coloumNameCn": "样品名称"},
            {"columnName": "materialType", "coloumNameCn": "样品规格"},
            {"columnName": "materialGrade", "coloumNameCn": "样品等级"},
            {"columnName": "sampleTypeName", "coloumNameCn": "样品规模"},
            {"columnName": "sampleNum", "coloumNameCn": "样品批号"},
            {"columnName": "locationName", "coloumNameCn": "送样地点"},
            {"columnName": "checkStatusCn", "coloumNameCn": "流程状态"}];
          self.option.showOperate = true;
        }
      });
    },
    getSelection(val){
      this.selectChoice = val;
    },
    handleEditData(rowData){
      this.detailData = Object.assign({},rowData);
      this.detailData.materialTypeId = this.detailData.materialType;
      this.detailData.materialGradeId = this.detailData.materialGrade;
      this.$eventBus.$emit("openSendSee",this.detailData);
    },
    addSend(){
      this.detailData =  {
        id: "",
        saveTmp:false,
        sampleCode:"",
        locationId:"",
        finalProduct:"",
        sampleTypeId:"",
        materialName:"",
        materialCode:"",
      };
      this.operateType = "add";
      this.$eventBus.$emit("openSendEdit",this.detailData,this.operateType,this.codeItemMap);
    },

    batchDelete(){
      let param = {ids:[],sampleCode:""};
      let sampleCodes = [];
      for(let data of this.selectChoice){
        param.ids.push(data.id);
        sampleCodes.push(data.sampleCode);
      }
      param.sampleCode = sampleCodes.join(",");
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
          url: "/drug/sample/batchDeleteSample",
          method: "post",
          data: JSON.stringify(param),
          dataType: 'json',
          contentType: "application/json",
        }).then(resp => {
          if (resp.success) {
            self.getList(0,20);
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

    getItemCode() {
      let self = this;
      self.codeItemMap = {location:[],type:[],dept:[],grade:[],scope:[]};
      self.$http({
        url: "/drug/codeItem/queryCodeItemList",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          for(let data of resp.result){
            if(self.codeItemMap.hasOwnProperty(data.itemCode)){
              self.codeItemMap[data.itemCode].push(data);
            }
          }

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


</style>
