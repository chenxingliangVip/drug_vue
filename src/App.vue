<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    let self = this;
    setInterval(() => {
      self.getNoticeCount();
      self.getStandardFlag();
    }, 5000);
    setInterval(() => {
      self.getApproveCount();
    }, 10000);
    self.getApproveCount();
    self.getDbBackCount();
  },
  methods:{
    getStandardFlag() {
      let self = this;
      let userId = this.$store.getters.userId;
      if(userId){
        self.$http({
          url: "/drug/standard/countMaterialStandardByCheckStatus",
          method: "post",
          params: {userId:userId}
        }).then(resp => {
          if (resp.success) {
            self.$eventBus.$emit("updateStandard",resp.result);
          }
        });
      }
    },
    getNoticeCount() {
      let self = this;
      let userId = this.$store.getters.userId;
      if(userId){
        self.$http({
          url: "/drug/notice/queryUnreadNoticeCount",
          method: "post",
          params: {userId:userId}
        }).then(resp => {
          if (resp.success) {
            self.$eventBus.$emit("updateNoticeCount",resp.result);
          }
        });
      }
    },
    getApproveCount() {
      let self = this;
      let user = this.$store.getters.user;
      if(user&&user.permission){
        self.$http({
          url: "/drug/fmApprove/queryApproveUnReadCount",
          method: "post",
          params: {permission:user.permission.length>0?user.permission.join(","):''}
        }).then(resp => {
          if (resp.success) {
            self.$eventBus.$emit("updateApproveCount",resp.result);
          }
        });
      }
    },
    getDbBackCount() {
      let self = this;
      self.$http({
        url: "/drug/db/queryDbBackList",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          if(resp.result.length > 0 && resp.result[0].backStatus == '1'){
            self.$eventBus.$emit("updateDbBack");
          }
        }
      });
    },
  }
}
</script>

