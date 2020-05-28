<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             width="40%"
             :close-on-click-modal="false"
             title="检样领检">
    <div class="dialog-title"><span style='color:#cb0000'>检样领检</span></div>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品规格<i class="i_colon">：</i></label><span>{{detailData.materialType}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">检验号</label><i class="i_colon">：</i><span style="color: #cb0000;font-size: 14px;">{{detailData.sampleId}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>物料编码<i class="i_colon">：</i></label><span>{{detailData.materialCode}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label class="w3">申请人</label><i class="i_colon">：</i><span>{{detailData.userName}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品名称<i class="i_colon">：</i></label><span>{{detailData.materialName}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>申请时间<i class="i_colon">：</i></label><span>{{detailData.createTimeFt}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="el-dialog-item"><label>样品等级<i class="i_colon">：</i></label><span>{{detailData.materialGrade}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="el-dialog-item"><label>送样地点<i class="i_colon">：</i></label><span>{{detailData.location}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="el-dialog-item"><label>样品规模<i class="i_colon">：</i></label><span>{{detailData.sampleType}}</span></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="el-dialog-item"><label>检项数量<i class="i_colon">：</i></label><span>{{choiceSize}}</span></div>
      </el-col>
    </el-row>
    <div class="el-dialog-table">
      <drug-table  @getSelection="getSelection" :filterPage="false" :isMultipleSelection="true"
                   :tableData="tableData" :tableLoading="tableLoading"
                   :tableHeader="tableHeader"  >
      </drug-table>
    </div>

    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini" @click="updateSampleItem"
                 style="width: 80px;">
        领检
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import drugTable from "@/components/table/index";
  import { formatDate } from '@/utils/formatDate'
  export default {
    name:"takeTask",
    data(){
      return{
        detailData: {
          materialType:"",
          sampleId:"",
          materialCode:"",
          userName:"",
          materialName:"",
          createTimeFt:"",
          materialGrade:"",
          location:"",
          sampleType:""
        },
        dialogAddVisible: false,
        count: 0,
        tableData: [],
        tableHeader:[],
        tableLoading:true,
        selectChoice:[],
        choiceSize:""
      }
    },
    components:{
      drugTable
    },
    mounted(){
      let self = this;
      self.$eventBus.$on("openTakeTaskDialog",function (editData,operateType) {
        self.dialogAddVisible = true;
        self.count = 0;
        self.type = operateType;
        self.detailData = editData;
        self.getSampleItems();

      })
    },
    methods:{

      updateSampleItem(){
        let self = this;
        let params = [];
        if(self.selectChoice.length < 1){
          self.$notify({
            title: '提示',
            message: "请选择领检项！",
            type: 'warning'
          });
          return;
        }
        for(let data of self.selectChoice){
          let p = {allCount:self.tableData.length,checkStatus:"SA",sampleId:self.detailData.sampleId,id:data.id,testStaffId:self.$store.getters.userId};
          params.push(p);
        }
        if(self.count !=0){
          return;
        }
        self.$http({
          url: "/drug/sampleItem/updateSampleItem",
          method: "post",
          data: JSON.stringify(params),
          dataType: 'json',
          contentType: "application/json",
        }).then(resp => {
          if (resp.success) {
            self.dialogAddVisible = false;
            // self.generatePdfPath(self.detailData.sampleId);
            self.generateRecord(self.detailData,self.selectChoice);
            self.$eventBus.$emit("updateDetectionList");
            self.$notify({
              title: '提示',
              message: "领检成功！",
              type: 'success'
            });
            return
          }
          self.count--;
          self.$notify({
            title: '提示',
            message: "操作失败，请联系管理员！",
            type: 'error'
          });
        });
        this.count++;
      },


      generatePdfPath(sampleId){
        let self = this;
        self.$http({
          url: "/drug/sampleItem/queryExportSampleRecord",
          method: "post",
          params:{sampleCode:sampleId,userId:self.$store.getters.userId}
        }).then(resp => {
          if (resp.success) {
            self.generateRecord(resp.result[0]);
          }
        });
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

      generateRecord(row,standardItems){
        let self = this;
        let cellList = [];
        cellList.push(this.getCell("物料编码",0,"EEEEEE",1500));
        cellList.push(this.getCell(row.materialCode,0,""));
        cellList.push(this.getCell("检 验 号",0,"EEEEEE",1500));
        cellList.push(this.getCell(row.sampleId,0));
        cellList.push(this.getCellCode(row.sampleId,0,"",3000));

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
        // let standardItems = row.standardItems;
        let param ={
          id:row.id,
          userId:self.$store.getters.userId,
          sampleCode:row.sampleId,
          title:"威尔研究院测试中心检验报告",
          printPerson:"打印人："+this.$store.getters.userName +" "+day,
          graphWordList:[
            {
              title:"检样信息",
              colIndex:5,
              cellList:[],
              splitRow:[]
            },
            {
              title:"检项( "+row.itemCount+" )",
              colIndex:5,
              cellList:[],
              splitRow:[]
            },
            {
              title:"检验方法",
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
        if(standardItems && standardItems.length  > 0){
          for(let k = 0 ; k < standardItems.length ;k++){
            let methodDesc = standardItems[k].methodDesc?standardItems[k].methodDesc:"无方法描述";
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

          cellList12.push(this.getCell("检验时间",9*(standardItems.length),"",2400));
          cellList12.push(this.getCell(" 年  月  日 ",9*(standardItems.length),"",2400));

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
            // self.showPdf(resp.result);
          }
        });
      },

      openPrintView(){
        let time = (new Date()).getTime();
        let routeData = this.$router.resolve({ path: "/iframe?code="+this.detailData.sampleId+"&&time="+time });
        window.open(routeData.href, '_blank');
      },

      getSelection(val){
        this.selectChoice = val;
        this.choiceSize = val.length+"/"+this.tableData.length
      },
      getSampleItems(){
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/sampleItem/querySampleItemSend",
          method: "post",
          params:{sampleCode:self.detailData.sampleId}
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            let datas = [];
            for(let data of resp.result.items){
               if(!data.testStaffId && !data.resultId){
                 datas.push(data);
               }
            }
            self.tableData = datas;
            self.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"}];
            self.choiceSize = "0/"+self.tableData.length
          }
        });
      }
    }
  }
</script>
