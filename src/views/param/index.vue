<template>
    <div class="btn-container">
        <ul class="btn-ul">
            <li v-for="(item,index) in paramList" :key="index" class="itemList" @click="openDialog(item.type)" align="center">
		            <img :src="item.imgSrc" />
		            <p>{{item.label}}</p>
                <!--<div class="btn-div">
                    <el-button class="filter-btn-item"
                     size="mini"
                     style="margin-left: 10px;width: 120px;height:40px;"
                     type="primary"
                     :icon="item.icon"  @click="openDialog(item.type)"
                     >{{item.label}}</el-button>
                </div>-->
            </li>
            <div class="clear"></div>
        </ul>
        <div class="footImg"></div>
        <level-dialog :paramData="paramList[0].paramData" v-if="hasRole(paramList[0].ps)"></level-dialog>
        <material-dialog :paramData="paramList[1].paramData" v-if="hasRole(paramList[1].ps)"></material-dialog>
        <attr-dialog :paramData="paramList[2].paramData" v-if="hasRole(paramList[2].ps)"></attr-dialog>
        <method-dialog :paramData="paramList[3].paramData" v-if="hasRole(paramList[3].ps)"></method-dialog>
        <address-dialog :paramData="paramList[4].paramData" v-if="hasRole(paramList[4].ps)"></address-dialog>
        <size-dialog :paramData="paramList[5].paramData" v-if="hasRole(paramList[5].ps)"></size-dialog>
        <item-dialog :paramData="paramList[6].paramData" v-if="hasRole(paramList[6].ps)"></item-dialog>
        <calendar-dialog v-if="hasRole(paramList[7].ps)"></calendar-dialog>
    </div>
</template>
<script>
    import levelDialog from "./dialog/level"
    import materialDialog from "./dialog/material"
    import attrDialog from "./dialog/attr"
    import methodDialog from "./dialog/method"
    import addressDialog from "./dialog/address"
    import sizeDialog from "./dialog/size"
    import itemDialog from "./dialog/item"
    import calendarDialog from "./dialog/calendar"

    export default {
        name: '参数管理',
        components: {
            calendarDialog,
            levelDialog,
            materialDialog,
            attrDialog,
            methodDialog,
            addressDialog,
            sizeDialog,
            itemDialog
        },
        data() {
            return {
                paramList: [{
                        label: "物料等级",
                        type: "level",
                        paramData: {},
                        ps: "manage:param:level",
                        icon: "el-icon-coin",
                        imgSrc: require("@/assets/img/paramImg1.png")
                    },
                    {
                        label: "物料规格",
                        type: "material",
                        paramData: {},
                        ps: "manage:param:mType",
                        icon: "el-icon-s-data",
                        imgSrc: require("@/assets/img/paramImg2.jpg")
                    },
                    {
                        label: "方法属性",
                        type: "attr",
                        paramData: {},
                        ps: "manage:param:atrr",
                        icon: "el-icon-setting",
                        imgSrc: require("@/assets/img/paramImg3.jpg")
                    },
                    {
                        label: "方法类别",
                        type: "method",
                        paramData: {},
                        ps: "manage:param:method",
                        icon: "el-icon-menu",
                        imgSrc: require("@/assets/img/paramImg4.jpg")
                    },
                    {
                        label: "样品规模",
                        type: "size",
                        paramData: {},
                        ps: "manage:param:size",
                        icon: "el-icon-copy-document",
                        imgSrc: require("@/assets/img/paramImg5.jpg")
                    },
                    {
                        label: "检项名称",
                        type: "item",
                        paramData: {},
                        ps: "manage:param:name",
                        icon: "el-icon-share",
                        imgSrc: require("@/assets/img/paramImg6.jpg")
                    },
                    {
                        label: "送样地点",
                        type: "address",
                        paramData: {},
                        ps: "manage:param:address",
                        icon: "el-icon-map-location",
                        imgSrc: require("@/assets/img/paramImg7.jpg")
                    },
                    {
                        label: "年历管理",
                        type: "cal",
                        paramData: {},
                        ps: "manage:param:cal",
                        icon: "el-icon-s-tools",
                        imgSrc: require("@/assets/img/paramImg8.jpg")
                    }
                ],

              chooseCal:[]
            }
        },

      mounted(){
        let self = this;
        self.getList();
        self.$eventBus.$on("updateCalendarList",function () {
          self.getList();
        })
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
                let choose = [];
                for(let data of resp.result){
                  let year = parseInt(data.year);
                  let mouth = parseInt(data.mouth);
                  let day = parseInt(data.day);
                  choose.push([year, mouth, day])
                }
                self.chooseCal = choose;
              }
            });
          },
            openDialog(type) {
                for(let data of this.paramList) {
                    if(type == "cal") {
                        this.$eventBus.$emit("openCalendar",this.chooseCal);
                    } else if(data.type == type) {
                        data.paramData = {
                            id: ""
                        };
                    }
                }
            }
        }
    }
</script>
<style lang="scss">

</style>

<style lang="scss" scoped>
    .btn-container {
        padding-top: 20px;
        padding-left: 50px;
        padding-right: 50px;
        height: calc(100vh - 148px);
    }

    .btn-ul {
        list-style-type: none;
        width: 100%;
        padding-left: 0;
    }

    .btn-ul li {
        width: 20%;
        float: left;
        /*margin-top: 50px;*/
        padding: 15px;
        cursor: pointer;
        border: 1px solid transparent;
        margin-bottom: 10px;
        img {
            width: 140px;
            border-radius: 8px;
            height: 90px;
        }
        p {
            width: 140px;
            text-align: center;
            margin: 5px auto;
            font-size: 14px;
        }
        &:hover {
        	border: 1px solid #409eff;
    			background-color: #eff6ff;
    			transition: all 0.5s;
        }
    }

    .clear {
        clear: both;
    }

    .el-dialog-item {
        display: inline-block;
    }

    .el-button--mini {
        border-radius: 8px;
        font-size: 18px;
    }

    .el-button [class*=el-icon-]+span {
        line-height: 36px;
    }
    .footImg {
    	width: 40%;
    	height: 200px;
    	position: absolute;
    	bottom: 0;
    	right: 0;
    	background: url(../../assets/img/background_img.png) 100%;
    	background-size: cover;
    }
</style>
