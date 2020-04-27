<template>
    <el-dialog title="参数设定-年历管理" width="1165px" append-to-body :close-on-click-modal="false" class="el-dialog-param" :visible.sync="dialogCalendarVisible">
        <div class="dialog-title"><span style='color:#000'>年历管理</span></div>
        <el-divider></el-divider>

        <div class="calendar-dropdown"  v-if="calendar.show">
            <CalendarDate 
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
        <!--<div class="el-table-calendar">
            <el-table :data="months" :show-header="false" border fit highlight-current-row style="width: 100%;margin-bottom:30px" :cell-style="stateClassName">
                <el-table-column align="center" width="50">
                    <template slot-scope="scope">
                        {{months[scope.$index]["mouth"]}}
                    </template>
                </el-table-column>
                <el-table-column min-width="34" align="center" v-for="(item,index2) in 31" :key="index2">
                    <template slot-scope="scope">
                        <span style="cursor: pointer;font-size: 20px" @click="cellClick(index2+1,scope.$index+1)">
               {{textConvert(index2+1,scope.$index)}}
            </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>-->
    </el-dialog>
</template>
<script>
    import CalendarDate from "@/components/calendar/calendar.vue";
    export default {
        name: "calendar",
        props: [],
        components: {
            CalendarDate
        },
        mounted() {
            let self = this;
            self.$eventBus.$on("openCalendar", function() {
                self.resetMap();
                self.getList();
                self.dialogCalendarVisible = true;
            });
            self.getTotalMothDay();
        },
        data() {
            return {
                calendar: {
                    display: "2019/7/8,2019/7/9",
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

                        let displayValue = []
                        if(value.length > 0) {

                            value.forEach(v => {
                                displayValue.push(v[0] + "/" + (v[1]) + "/" + v[2])
                            })
                        }
                        console.log(displayValue);
                        this.calendar.display = displayValue.join(",");
                        // this.calendar.show=false;
                        this.calendar.value = value;

                    },
                    currentYearMon: (year, mon) => {

                        let currSelectDays = this.calendar.value.filter(v => {
                            return year === v[0] && mon === v[1]
                        })
                        this.chooseReverse(year, mon, currSelectDays)

                    },
                    nextMonth: (mon, year) => {

                    },
                    prevMonth: (mon, year) => {

                    }
                },
                dialogCalendarVisible: false,
                cellMap: {},
                months: [{mouth: "一"},{mouth: "二"},{mouth: "三"},{mouth: "四"
                    },{mouth: "五"},{mouth: "六"},{mouth: "七"},{mouth: "八"},{mouth: "九"
                    },{mouth: "十"},{mouth: "十一"},{mouth: "十二"},
                ],
            }
        },
        methods: {
            getList() {
                let self = this;
                self.tableLoading = true;
                self.$http({
                    url: "/drug/calendar/queryCalendarList",
                    method: "post",
                }).then(resp => {
                    if(resp.success) {
                        for(let data of resp.result) {
                            let key = data.mouth + "-" + data.day;
                            self.$set(self.cellMap, key, "background-color: red;");
                        }
                    }
                });
            },
            resetMap() {
                for(let key in this.cellMap) {
                    this.cellMap[key] = "";
                }
            },

            stateClassName({ row, column, rowIndex, columnIndex }) {
                if(columnIndex == 0){
                    return 'background-color: #00b0ee;'
                }else{
                    let key = (rowIndex+1)+"-"+(columnIndex);
                    if(this.cellMap[key]){
                        return this.cellMap[key];
                    }
                    return 'background-color: #bdd6ed;'
                }
            },
            getTotalMothDay(){
                for(let i = 1;i<13;i++){
		          let day = this.getCurrentMothDay(i);
		        }
            },
            textConvert(index, moth){
                let day = this.getCurrentMothDay(moth + 1);
                if(day < index) {
                    return "";
                }
                return index;
            },
            getCurrentMothDay(month){
                let year = (new Date()).getFullYear();
                month = parseInt(month, 10);
                let d = new Date(year, month, 0);
                return d.getDate();
            },
            cellClick(index1, index2) {
                let self = this;
                let year = (new Date()).getFullYear();
                let key = index2 + "-" + index1;
                let param = {
                    mouth: index2 + "",
                    day: index1 + "",
                    year: year + ""
                };
                let url = "/drug/calendar/addCalendar";
                if(this.cellMap[key]) {
                    url = "/drug/calendar/deleteCalendar";
                    this.cellMap[key] = "";
                } else {
                    this.$set(this.cellMap, key, "background-color: red;");
                }
                self.$http({
                    url: url,
                    method: "post",
                    params: param
                }).then(resp => {});
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
        created() {
	        let year = new Date().getFullYear()
	        let mon = new Date().getMonth() + 1
	        let day = new Date().getDate()
	        this.calendar.value = [[year, mon, day]]
	        this.calendar.currentYearMon(year, mon, this.calendar.value)
	    },
        watch: {

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