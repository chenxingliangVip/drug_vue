<template>
  <div>
    <el-table class="el-table-notice"
              :data="list"
              :show-header=false
              style="width: 100%;"
              @row-click="handleClick">
      <el-table-column width="240">
        <template slot-scope="scope">
          <img src="../../../assets/img/view.png">
          <span style="margin-left: 10px">{{ scope.row.createTimeFt }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200"
                       :show-overflow-tooltip=true>
        <template slot-scope="scope">
          <div :class="[scope.row.readCount == 0? 'no-read':'']">{{ scope.row.title }}</div>
        </template>
      </el-table-column>
    </el-table>
    <message-detail :detailData="detailData"></message-detail>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth' // 验权
  import messageDetail from './detail';
export default {
  data() {
    return {
      list: [],
      detailData:{}
    }
  },
  components:{
    messageDetail
  },
  mounted() {
    let self = this;
    self.fetchData();
    self.$eventBus.$on("updateNoticeList",function () {
      self.fetchData();
    });
  },
  methods: {
    handleClick(row) {
      if(row.readCount == 0){
        let self = this;
        let user = JSON.parse(getToken());
        self.$http({
          url: "/drug/notice/updateReadStatus",
          method: "post",
          params: {userId:user.id,id:row.id}
        }).then(resp => {
          if (resp.success) {
            row.readCount = 1;
          }
        });
      }
      this.detailData  = Object.assign({},row);
    },
    /**
     * 获取信息列表
     */
    fetchData() {
      let self = this;
      let user = JSON.parse(getToken());
      self.$http({
        url: "/drug/notice/queryNoticeList",
        method: "post",
        params: {userId:user.id,status:"1"}
      }).then(resp => {
        if (resp.success) {
          self.list = resp.result;
        }
      });
    }
  }
}
</script>
<style lang="scss">
.el-table-notice {
  border: 0;
  th,
  tr,
  td {
    border: 0;
    background-color: #fff;
    padding: 2px 0;
  }
  &::before {
    height: 0px;
  }
  &::after {
    width: 0;
  }

  .el-table__fixed:before {
    height: 0;
  }

  .el-table__row td {
    border: none;
  }
  .el-table__body td {
    background-color: #fff;
  }
  .el-dialog__body {
    padding: 10px 40px;
    height: 500px;
    overflow: auto;
  }
  .no-read {
    color: #f56c6c;
  }
}
</style>
