<template>
  <div class="app-container">
    <div :class="item.class" v-for="(item,index) in dbList" :key="index" style=" clear: both;">
      <!--<svg-icon class="svg-icon" icon-class="backup" />-->
      <img src="../../assets/img/backup01.png" class="svg-icon" v-if="item.class =='red'">
      <img src="../../assets/img/backup02.png" class="svg-icon" v-if="item.class =='blue'">
      <img src="../../assets/img/backup03.png" class="svg-icon" v-if="item.class =='grey'">

      <div class="back-block">
        <div class="back-time">
          <span>{{item.createTimeFt}}</span>
        </div>
        <div class="back-message">
          <span>{{item.backStatusCn}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:"dbBack",
    data(){
      return{
        dbList:[]
      }
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList() {
        let self = this;
        self.$http({
          url: "/drug/db/queryDbBackList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            for(let i = 0;i < resp.result.length;i++){
              if(i == 0){
                resp.result[i]["class"] = "red"
              } else{
                resp.result[i]["class"] = "grey"
              }
              if(resp.result[i].backStatus == 1){
                resp.result[i]["class"] = "blue"
              }
            }
            self.dbList = resp.result;
            console.log(self.dbList)
          }
        });
      },
    }
  }
</script>


<style lang="scss" scoped>
.svg-icon {
  width: 34px;
  height: 34px;
  vertical-align: middle;
  margin-bottom: 2px;
}
.red {
  color: #d81c03;
  padding-top: 80px;
  padding-left: 160px;
}
.blue {
  color: #1290d3;
  padding-top: 40px;
  padding-left: 160px;
}
.grey {
  color: #878887;
  padding-top: 40px;
  padding-left: 160px;
}
.svg-icon {
  float: left;
}
.back-block {
  width: 350px;
  float: left;
  margin-top: 10px;
  font-size: 18px;
}
.back-time {
  width: 150px;
  float: left;
  margin-left: 30px;
}
.back-message {
  width: 150px;
  float: left;
}
.clear {
  clear: both;
}
</style>
