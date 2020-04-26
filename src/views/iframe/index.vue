<template>
  <iframe width="100%" height="100%" :src="pdfUrl"></iframe>
</template>
<script>
  import { formatDate } from '@/utils/formatDate'
  export default {
    name:"iframe",
    data(){
      return{
        pdfUrl:""
      }
    },
    mounted(){
      let self = this;
      let now = (new Date()).getTime();
      let time = this.$route.query.time;
      let filePath = this.$route.query.filePath;
      if((now - time) > 1000 *10){
        alert("请求已经过期！");
        return;
      }
      self.showPdf(filePath);
    },
    methods:{
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
    }
  }
</script>
