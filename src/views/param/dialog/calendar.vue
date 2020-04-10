<template>
  <el-dialog title="参数设定-年历管理"
             width="1165px"
             append-to-body
             :close-on-click-modal="false"
             class="el-dialog-param"
             :visible.sync="dialogCalendarVisible">
    <div class="dialog-title"><span style='color:#000'>年历管理</span></div>
    <el-divider></el-divider>
    <div class="el-table-calendar">
      <el-table :data="months"
                :show-header="false"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-bottom:30px"
                :cell-style="stateClassName">
        <el-table-column align="center"
                         width="50">
          <template slot-scope="scope">
            {{months[scope.$index]["mouth"]}}
          </template>
        </el-table-column>
        <el-table-column min-width="34"
                         align="center"
                         v-for="(item,index2) in 31"
                         :key="index2">
          <template slot-scope="scope">
            <span style="cursor: pointer;font-size: 20px" @click="cellClick(index2+1,scope.$index+1)">
               {{textConvert(index2+1,scope.$index)}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name:"calendar",
    props:[],
    components:{},
    mounted(){
      let self = this;
      self.$eventBus.$on("openCalendar",function () {
        self.resetMap();
        self.getList();
        self.dialogCalendarVisible = true;
      });
      self.getTotalMothDay();
    },
    data(){
      return{
        dialogCalendarVisible: false,
        cellMap:{},
        months: [
                  {mouth:"一"},
                  {mouth:"二"},
                  {mouth:"三"},
                  {mouth:"四"},
                  {mouth:"五"},
                  {mouth:"六"},
                  {mouth:"七"},
                  {mouth:"八"},
                  {mouth:"九"},
                  {mouth:"十"},
                  {mouth:"十一"},
                  {mouth:"十二"},
                ]
      }
    },
    methods:{
      getList() {
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/calendar/queryCalendarList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            for(let data of resp.result){
              let key = data.mouth+"-"+data.day;
              self.$set(self.cellMap,key,"background-color: red;");
            }
          }
        });
      },
      resetMap(){
        for(let key in this.cellMap){
          this.cellMap[key] = "";
        }
      },

      stateClassName({row, column, rowIndex, columnIndex}) {
        if (columnIndex == 0) {
          return '  background-color: #00b0ee;'
        } else {
          let key = (rowIndex+1)+"-"+(columnIndex);
          if(this.cellMap[key]){
            return this.cellMap[key];
          }
          return '  background-color: #bdd6ed;'
        }
      },
      getTotalMothDay(){
        for(let i = 1;i<13;i++){
          let day = this.getCurrentMothDay(i);
        }
      },
      textConvert(index,moth){
        let day = this.getCurrentMothDay(moth+1);
        if(day < index){
          return "";
        }
        return index;
      },
      getCurrentMothDay(month){
        let year = (new Date()).getFullYear();
        month = parseInt(month, 10);
        let  d= new Date(year, month, 0);
        return d.getDate();
      },
      cellClick(index1,index2){
        let self = this;
        let year = (new Date()).getFullYear();
        let key = index2+"-"+index1;
        let param = {mouth:index2+"",day:index1+"",year:year+""};
        let url = "/drug/calendar/addCalendar";
        if(this.cellMap[key]){
          url = "/drug/calendar/deleteCalendar";
          this.cellMap[key] = "";
        }else{
          this.$set(this.cellMap,key,"background-color: red;");
        }
        self.$http({
          url: url,
          method: "post",
          params: param
        }).then(resp => {
        });
      }
    },
    watch:{

    }

  }

</script>
<style lang="scss" scoped>
  .btn-container {
    padding-top: 20px;
    padding-left: 50px;
    padding-right: 50px;
  }
  .btn-ul {
    list-style-type: none;
    width: 100%;
  }
  .btn-ul li {
    width: 20%;
    float: left;
    margin-top: 50px;
  }
  .clear {
    clear: both;
  }
  .el-dialog-item {
    display: inline-block;
  }
</style>
