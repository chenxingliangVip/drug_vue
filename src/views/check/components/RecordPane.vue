<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin-left:10px">
      <div>
        <div class="filter-item">
          <span>检验人<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.userName"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>
        <div class="filter-item">
          <span>检验号<i class="i_colon">:</i></span>
          <el-input clearable  v-model="searchParam.sampleCode"
                    size="mini"
                    style="width: 100px;"
                    @keyup.enter.native="getList" />
        </div>

        <div class="filter-item filter-item-btn-search">
          <i class="el-icon-search" style="cursor: pointer"
             @click="getList"></i>
        </div>
      </div>
    </div>
    <div class="el-table-frame1">
      <drug-table  :tableData="tableData" :tableLoading="tableLoading"
                   :tableHeader="tableHeader" :option="option">
        <template slot-scope="props" slot="operate">
          <div >
            <label @click="seePrint(props.rowData)"
                   class="table-view" style="cursor: pointer;">
              查看
            </label>
            <label @click="openPrintView(props.rowData)"
                   class="table-view" style="cursor: pointer;">
              · &nbsp;打印
            </label>
          </div>
          <!--<img src="../../../assets/img/print.png"   @click="openPrintView(props.rowData)"-->
                <!--class="svg-icon" style="cursor: pointer;width: 15px;height: 15px;margin-top: 4px">-->
        </template>
      </drug-table>
      <record-dialog></record-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import drugTable from "@/components/table/index";
import recordDialog from "./recordDialog"
import { formatDate } from '@/utils/formatDate'
import { Loading } from 'element-ui';

export default {
  name: '样品检验',
  components: { drugTable ,recordDialog},
  directives: { waves },
  data() {
    return {

      loadingOptions:{text:"正在修复文档，请勿关闭窗口，占用您5秒时间..."},
      searchParam: {
        userName:"",
        sampleCode: ""
      },
      tableData: [],
      tableHeader:[],
      tableLoading:true,
      option:{showOperate:true},
      type:""
    }
  },

  mounted(){
    let self = this;
    self.$eventBus.$on("updateRecordList",function () {
      self.getList();
    });
    self.getList();
  },

  methods: {
    openPrintView(row){
      let time = (new Date()).getTime();
      this.type = "print";
      if(!row.filePath){
         this.generatePdfPath(row.sampleId,row.userId,row.id,row.itemNum);
         return;
      }
      let routeData = this.$router.resolve({ path: "/iframe?filePath="+row.filePath+"&&time="+time });
      window.open(routeData.href, '_blank');
      this.updatePrintCount(row);
    },
    seePrint(row){
      let time = (new Date()).getTime();
      this.type = "see";
      if(!row.filePath){
        this.generatePdfPath(row.sampleId,row.userId,row.id,row.itemNum);
        return;
      }
      let routeData = this.$router.resolve({ path: "/iframe?filePath="+row.filePath+"&&time="+time });
      window.open(routeData.href, '_blank');
    },

    getCell(text,index,backGround,width){
      let cell = {
        text:text,
        fontSize:11,
        family:"黑体",
        index:index?index:0,
        width:width?width:0
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

    generatePdfPath(sampleId,userId,id,itemNum){
      let self = this;
      let loadingInstance = Loading.service(self.loadingOptions);
      self.$http({
        url: "/drug/sampleItem/queryExportSampleRecord",
        method: "post",
        params:{sampleCode:sampleId,userId:userId}
      }).then(resp => {
        if (resp.success) {
          self.generateRecord(resp.result[0],id,userId,loadingInstance,itemNum);
        }
      });
    },
    generateRecord(row,id,current_user,loadingInstance,itemNum){
      let self = this;
      let cellList = [];
      cellList.push(this.getCell("物料编码",0,"EEEEEE",1500));
      cellList.push(this.getCell(row.materialCode,0,""));
      cellList.push(this.getCell("检 验 号",0,"EEEEEE",1500));
      cellList.push(this.getCell(row.sampleCode,0));
      cellList.push(this.getCellCode(row.sampleCode,0,"",3000));

      cellList.push(this.getCell("样品名称",1,"EEEEEE",1500));
      cellList.push(this.getCell(row.materialName,1,""));


      cellList.push(this.getCell("样品规格",2,"EEEEEE",1500));
      cellList.push(this.getCell(row.materialType,2,""));
      cellList.push(this.getCell("样品规模",2,"EEEEEE",1500));
      cellList.push(this.getCell(row.sampleType,2));

      cellList.push(this.getCell("样品等级",3,"EEEEEE",1500));
      cellList.push(this.getCell(row.materialGrade,3,""));
      cellList.push(this.getCell("申 请 人",3,"EEEEEE",1500));
      cellList.push(this.getCell(row.userName,3));

      cellList.push(this.getCell("样品批号",4,"EEEEEE",1500));
      cellList.push(this.getCell(row.sampleNum,4,""));
      cellList.push(this.getCell("申请时间",4,"EEEEEE",1500));
      cellList.push(this.getCell(row.createTimeFt,4));
      let splitRow = [];
      splitRow.push("4,3,4,0");
      splitRow.push("2,0,1,1");
      splitRow.push("3,0,1,1");
      splitRow.push("4,0,3,1");
      let day =  formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      let standardItems = row.standardItems;
      let param ={
        id:row.id,
        userId:current_user,
        sampleCode:row.sampleCode,
        title:"威尔研究院测试中心检验报告",
        printPerson:"打印人："+this.$store.getters.userName +" "+day,
        graphWordList:[
          {
            title:"检样信息：",
            colIndex:5,
            cellList:[],
            splitRow:[]
          },
          {
            title:"检项：( "+itemNum+" )",
            colIndex:5,
            cellList:[],
            splitRow:[]
          },
          {
            title:"检验方法：",
            colIndex:4,
            cellList:[],
            splitRow:[]
          }
        ]
      };
      param.graphWordList[0].cellList = cellList;
      param.graphWordList[0].splitRow = splitRow;
      let cellList1 = [];
      cellList1.push(this.getCell("检项",0,"EEEEEE",1500));
      cellList1.push(this.getCell("质量标准",0,"EEEEEE"));
      cellList1.push(this.getCell("检验结果",0,"EEEEEE",1000));
      cellList1.push(this.getCell("备注",0,"EEEEEE",1000));
      cellList1.push(this.getCell("工时",0,"EEEEEE",800));
      if(standardItems && standardItems.length  > 0){
        for(let i = 0 ; i < standardItems.length ;i++){
          cellList1.push(this.getCell(standardItems[i].itemId,i+1));
          cellList1.push(this.getCell(standardItems[i].itemQualityStandard,i+1));
          cellList1.push(this.getCell(standardItems[i].testResult,i+1));
          cellList1.push(this.getCell(standardItems[i].remark,i+1));
          cellList1.push(this.getCell(standardItems[i].manHour,i+1));
        }
      }
      param.graphWordList[1].cellList = cellList1;
      let cellList12 = [];
      let splitRow1 = [];
      if(standardItems &&standardItems.length  > 0){
        for(let k = 0 ; k < standardItems.length ;k++){
          let methodDesc =standardItems[k].methodDesc?standardItems[k].methodDesc:"无方法描述";
          let testRecord = standardItems[k].testRecord?standardItems[k].testRecord:"无测试记录";
          cellList12.push(this.getCell(methodDesc,k+8*k));
          cellList12.push(this.getCell("",k+8*k));
          cellList12.push(this.getCell(testRecord,k+8*k,"",3000));
          cellList12.push(this.getCell("",k+8*k,"",3000));
          for(let i = 1;i<9;i++){
            cellList12.push(this.getCell("",i+9*k));
            cellList12.push(this.getCell("",i+9*k));
            cellList12.push(this.getCell("",i+9*k));
            cellList12.push(this.getCell("",i+9*k));
          }

          splitRow1.push("0,"+(9*k)+","+(9*k+8)+",1");
          splitRow1.push(9*k+",0,1,0");
          splitRow1.push(9*k+",2,3,0");
          splitRow1.push("1,"+(9*k)+","+(9*k+8)+",1");
          splitRow1.push((9*k+1)+",0,1,0");
          splitRow1.push((9*k+1)+",2,3,0");
          splitRow1.push("2,"+(9*k)+","+(9*k+8)+",1");
          splitRow1.push((9*k+2)+",0,1,0");
          splitRow1.push((9*k+2)+",2,3,0");
          splitRow1.push("3,"+(9*k)+","+(9*k+8)+",1");
          splitRow1.push((9*k+3)+",0,1,0");
          splitRow1.push((9*k+3)+",2,3,0");
          splitRow1.push((9*k+4)+",0,1,0");
          splitRow1.push((9*k+4)+",2,3,0");
          splitRow1.push((9*k+5)+",0,1,0");
          splitRow1.push((9*k+5)+",2,3,0");
          splitRow1.push((9*k+6)+",0,1,0");
          splitRow1.push((9*k+6)+",2,3,0");
          splitRow1.push((9*k+7)+",0,1,0");
          splitRow1.push((9*k+7)+",2,3,0");
          splitRow1.push((9*k+8)+",0,1,0");
          splitRow1.push((9*k+8)+",2,3,0");
        }
        splitRow1.push((9*(standardItems.length)+1)+",1,3,0");
        cellList12.push(this.getCell("检验人",9*(standardItems.length)));
        cellList12.push(this.getCell(row.userName,9*(standardItems.length)));

        cellList12.push(this.getCell("检验时间",9*(standardItems.length),"",2200));
        cellList12.push(this.getCell(" 年  月  日 ",9*(standardItems.length),"",2300));

        cellList12.push(this.getCell("说  明",9*(standardItems.length)+1));
        cellList12.push(this.getCell(row.remark,9*(standardItems.length)+1));
        cellList12.push(this.getCell("",9*(standardItems.length)+1));
        cellList12.push(this.getCell("",9*(standardItems.length)+1));
      }

      param.graphWordList[2].cellList = cellList12;
      param.graphWordList[2].splitRow = splitRow1;

      self.$http({
        url: "/drug/sample/queryIframePath",
        method: "post",
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
      }).then(resp => {
        if (resp.success) {
          let time = (new Date()).getTime();
          let routeData = self.$router.resolve({ path: "/iframe?filePath="+resp.result+"&&time="+time });
          window.open(routeData.href, '_blank');
          loadingInstance.close();
          if(self.type != 'see'){
            self.updatePrintCount(id);
          }
        }
      });
    },

    updatePrintCount(id){
      let self = this;
      self.$http({
        url: "/drug/record/updateRecordLog",
        method: "post",
        params:{id:id}
      }).then(resp => {
        self.getList();
      });
    },

    handlePrint(row){
      this.$eventBus.$emit("openRecordDialog",row.sampleId,row.filePath);
    },
    getList() {
      let self = this;
      self.tableLoading = true;
      self.$http({
        url: "/drug/record/queryRecordLogList",
        method: "post",
        params:self.searchParam
      }).then(resp => {
        if (resp.success) {
          let count =0;
          self.tableLoading = false;
          for(let data of resp.result){
            let printNum = parseInt(data.printNum);
            data.repeatPrintNum = (printNum - 1) > 0 ?(printNum - 1):0;
          }
          self.tableData = resp.result;
          self.tableHeader =  [
            {"columnName": "sampleId", "coloumNameCn": "检验单号"},
            {"columnName": "workNum", "coloumNameCn": "工号"},
            {"columnName": "userName", "coloumNameCn": "姓名"},
            {"columnName": "itemNum", "coloumNameCn": "项数"},
            {"columnName": "printNum", "coloumNameCn": "打印数"},
            {"columnName": "repeatPrintNum", "coloumNameCn": "复打数"},
            {"columnName": "createTimeFt", "coloumNameCn": "盖章时间"}];
          self.option.showOperate = true;
          for(let data of resp.result){
            if(data.printNum == 0){
              count++;
            }
          }
          self.$eventBus.$emit("updateRecordCount",count);
        }
      });
    },
  }
}
</script>

<style lang="scss" >
.el-button-excel {
  .el-button--text {
    color: #2995d4;
  }
}
</style>

<style lang="scss" scoped>
.el-table-frame1 {
  margin: 0 10px 10px 10px;
}
.el-button {
  .svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}

.el-dialog .el-button--primary {
  background-color: #2e827f;
  border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
}
</style>
