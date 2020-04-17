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
  }
}
</script>

