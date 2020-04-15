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
    self.getNoticeCount();
    setInterval(() => {
      self.getNoticeCount();
    }, 5000);
  },
  methods:{
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

