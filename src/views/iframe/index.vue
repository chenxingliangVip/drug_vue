<template>
  <iframe width="100%" height="100%" :src="pdfUrl"></iframe>
</template>
<script>
  import { formatDate } from '@/utils/formatDate'
  export default {
    name:"iframe",
    data(){
      return{
        code:"",
        pdfUrl:""
      }
    },
    mounted(){
      let self = this;
      let now = (new Date()).getTime();
      self.code = this.$route.query.code;
      let time = this.$route.query.time;
      let filePath = this.$route.query.filePath;
      if((now - time) > 1000 *10){
        alert("请求已经过期！");
        return;
      }
      if(filePath){
        self.showPdf(filePath);
      }else{
        self.getSampleItem();
      }

    },
    methods:{
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
        cellList.push(this.getCell("样品规模",2,"EEEEEE"));
        cellList.push(this.getCell(row.sampleTypeId,2));

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
        let standardItems = row.standardItems;
        let param ={
          id:row.id,
          userId:self.$store.getters.userId,
          sampleCode:row.sampleCode,
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
              title:"检项( "+standardItems.length+"/"+row.count+" )",
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
        cellList1.push(this.getCell("检项",0,"EEEEEE"));
        cellList1.push(this.getCell("质量标准",0,"EEEEEE"));
        cellList1.push(this.getCell("检验结果",0,"EEEEEE"));
        cellList1.push(this.getCell("备注",0,"EEEEEE"));
        cellList1.push(this.getCell("工时",0,"EEEEEE"));
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
            cellList12.push(this.getCell(standardItems[k].methodDesc,k+8*k));
            cellList12.push(this.getCell("",k+8*k));
            cellList12.push(this.getCell(standardItems[k].testRecord,k+8*k));
            cellList12.push(this.getCell("",k+8*k));
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

          cellList12.push(this.getCell("样品检验时间：",9*(standardItems.length)));
          cellList12.push(this.getCell("年  月  日",9*(standardItems.length)));

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
            self.showPdf(resp.result);
          }
        });
      },
      showPdf(data) {
        let self = this;
        self.$http({
          url: "/drug/sample/getFileBase",
          method: "post",
          params: {filePath: data}
        }).then(resp => {
          if (resp.success) {
            self.pdfUrl = "data:application/pdf;base64," + resp.result;
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

      getSampleItem(){
        let self = this;
        self.$http({
          url: "/drug/sampleItem/queryExportSampleRecord",
          method: "post",
          params:{sampleCode:self.code,userId:self.$store.getters.userId}
        }).then(resp => {
          if (resp.success) {
            self.generateRecord(resp.result[0]);
          }
        });
      },
    }
  }
</script>
