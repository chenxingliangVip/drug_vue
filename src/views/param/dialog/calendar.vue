<template>
    <el-dialog title="参数设定-年历管理" width="1165px" append-to-body :close-on-click-modal="false" class="el-dialog-param" :visible.sync="dialogCalendarVisible">
        <div class="dialog-title"><span style='color:#000'>年历管理</span></div>
        <el-divider></el-divider>
        <el-button class="calendarBtn" type="primary" size="mini" @click="saveCalendar">提 交</el-button>
        <div class="calendar-dropdown" >
            <CalendarDate ref="calendars"
                :zero="calendar.zero"
                :disabled="calendar.disabled"
                :lunar="calendar.lunar"
                :value="calendar.value"
                :multi="calendar.multi"
                @currentYearMon="calendar.currentYearMon"
                @next="calendar.nextMonth"
                @prev="calendar.prevMonth"
                @select="calendar.select"
                ></CalendarDate>
        </div>
    </el-dialog>
</template>
<script>
    import CalendarDate from "@/components/calendar/calendar.vue";
    import {formatDate} from '@/utils/formatDate'
    export default {
        name: "calendar",
        props: [],
        components: {
            CalendarDate
        },
        data() {
            return {
                calendar: {
                    multi: true,
                    show: true,
                    zero: true,
                    value: [
                        [2019, 7, 8],
                        [2019, 7, 9]
                    ], //默认日期
                    disabled: [
                        [2017, 12, 24],
                        [2017, 12, 25]
                    ], //默认日期
                    lunar: true, //显示农历
                    select: (value) => {

                        let displayValue = [];
                        if(value.length > 0) {

                            value.forEach(v => {
                                displayValue.push(v[0] + "/" + (v[1]) + "/" + v[2])
                            })
                        }
                        this.calendar.value = value;

                    },
                    currentYearMon: (year, mon) => {

                        // let currSelectDays = this.calendar.value.filter(v => {
                        //     return year === v[0] && mon === v[1]
                        // })
                        // this.chooseReverse(year, mon, currSelectDays)

                    },
                    nextMonth: (mon, year) => {

                    },
                    prevMonth: (mon, year) => {

                    }
                },
                dialogCalendarVisible: false,
                firstEnter:true
            }
        },
        methods: {

            saveCalendar(){
              let self = this;
              let params = [];
              let year = formatDate(new Date(), "yyyy");
              for(let data of this.calendar.value){
                if(data[0] !=year){
                  self.$notify({
                    title: '提示',
                    message: "请选择本年度！",
                    type: 'warning'
                  });
                  return;
                }
                let param = {
                  mouth:data[1]+"" ,
                  day:data[2]+"",
                  year: data[0]+""
                };
                params.push(param);
              }
              if(params.length == 0){
                self.$notify({
                  title: '提示',
                  message: "请选择月份！",
                  type: 'warning'
                });
                return;
              }
              self.$http({
                url: "/drug/calendar/updateCalendar",
                method: "post",
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: "application/json",
              }).then(resp => {
                self.dialogCalendarVisible = false;
                self.$eventBus.$emit("updateCalendarList")
              });
            },


            //当月反选
	        chooseReverse(year, mon, currSelectDays){
	            // 获取当前月天数
	            let daysCount = new Date(year, mon, 0).getDate()
	            var fullMonth = [];
	            for(var i= 1; i <= daysCount; i++) {
	                let _date = [year, mon, i]
	                fullMonth.push(_date)
	            }

	            // 从当前月去掉当前选中状态的日期
	            let reverse = []
	            let _fullMonth = []

	            fullMonth.map(v =>  _fullMonth.push(v[2]))
	            currSelectDays.map(v => {
	                _fullMonth.map(full => {
	                    if (v[2] === full) {
	                       let index = _fullMonth.indexOf(v[2])
	                       _fullMonth.splice(index, 1)
	                    }
	                })
	            })
	            _fullMonth.map(v => reverse.push([year, mon, v]) )

	        }
        },
        updated(){
          if(this.firstEnter){
            this.$refs.calendars.setMultiDays(this.calendar.value);
            this.firstEnter = false;
          }
        },
        mounted() {
          let self = this;
          self.$eventBus.$on("openCalendar", function(val) {
            self.calendar.value = val;
            self.firstEnter = true;
            self.dialogCalendarVisible = true;
          });
	    },
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
    .calendarBtn {
    	float: right;
    	width: 80px;
    }
</style>
