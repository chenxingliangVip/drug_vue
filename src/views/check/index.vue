<template>

  <div class="app-container1">
    <div class="tab-container">
      <el-tabs style="margin-top:5px;" class="tabNav"
               type="border-card">
        <el-tab-pane label="工时"  v-if="hasRole('hour:effiect')">
          <working-hours-pane />
        </el-tab-pane>
        <el-tab-pane label="及时率" v-if="hasRole('jishi:effiect')">
          <timely-rate-pane />
        </el-tab-pane>
        <el-tab-pane label="偏差率" v-if="hasRole('piancha:effiect')">
          <deviation-rate-pane />
        </el-tab-pane>
        <el-tab-pane label="检验记录单复打" v-if="hasRole('report:effiect')">
          <record-pane />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import waves from '@/views/directive/waves' // waves directive
import { parseTime } from '@/utils'
import workingHoursPane from './components/WorkingHoursPane'//工时
import deviationRatePane from './components/DeviationRatePane'//偏差率
import recordPane from './components/RecordPane' //检验记录单复打
import timelyRatePane from './components/TimelyRatePane'//及时率

export default {
  name: '样品检验',
  components: {
    workingHoursPane,
    deviationRatePane,
    recordPane,
    timelyRatePane
  },
  directives: { waves },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" >
.el-table-frame {
  .el-table {
    .el-table__header th {
      background-color: #d8dad7;
      color: #000;
    }
  }
}
</style>

<style lang="scss" scoped>
.app-container1 {
  padding: 20px 0;
}
.app-container {
  padding: 0 0 20px 0;
}

.svg-container {
  padding: 6px 5px 6px 15px;
  margin-right: 10px;
  color: #889aa4;
  vertical-align: middle;
  width: 40px;
  display: inline-block;
}
.tabNav {
  .el-tabs__item{
    width: 120px;
  }
}
</style>
