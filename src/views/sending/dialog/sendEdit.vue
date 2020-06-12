<template>
  <el-dialog :title="type == 'add'?'新增·样检':'查看·样检'"
             width="50%"
             append-to-body
             :close-on-click-modal="false"
             :visible.sync="dialogAddVisible" class="Input_Dialog dialog_FormTxt">
    <el-form ref="dataForm"
             size="mini"
             label-width="80px" style="position: relative;">
      <div class="dialog-title"><span>新增样品送检</span></div>
      <el-divider></el-divider>

      <el-form-item>
  			<span class="span_colon">申  请  人<i class="i_colon">：</i></span>
        <el-input clearable  v-model="user.userName" disabled
                  size="mini"
                  style="width: 100px;margin-left: 6px;"></el-input>
      </el-form-item>
      <el-form-item>
  			<span class="span_colon">申请时间<i class="i_colon">：</i></span>
        <el-date-picker v-model="nowTime" disabled
                        size="mini"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width: 180px;"
                        type="datetime" />
      </el-form-item>

      <div class="el-form-right float_right">
        <el-form-item label-width="0px">
          <div class="el-form-no" style="color:#cb0000;font-size: 18px">
          	<img class="NoImg" src="../../../assets/img/noNum.png" />{{detailData.sampleCode}}</div>
        </el-form-item>
        <el-form-item v-show="type == 'add'"
                      class="el-form-check">
  				<span class="span_colon">是否存样<i class="i_colon">：</i></span>
          <el-checkbox v-model="detailData.saveTmp"></el-checkbox>

        </el-form-item>
      </div>
      <el-form-item>
      	<span class="span_colon">送样地点<i class="i_colon">：</i></span>
        <el-radio-group v-model="detailData.locationId">
          <el-radio v-for="item in codeItemMap.location"
                    :key="item.id"
                    :label="item.id" >{{item.itemName}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--<el-form-item label="终 产 品：">-->

        <!--<el-select v-model="detailData.finalProduct"  :disabled="finalProductEdit" @change="finalChange"-->
                   <!--size="mini"-->
                   <!--filterable-->
                   <!--clearable-->
                   <!--style="width: 100px">-->
          <!--<el-option v-for="item in finalProds"-->
                     <!--:key="item.id"-->
                     <!--:label="item.finalProd"-->
                     <!--:value="item.finalProd" />-->
        <!--</el-select>-->
      <!--</el-form-item>-->
			<el-form-item>
      	<span class="span_colon">样品规格<i class="i_colon">：</i></span>
        <el-select v-model="detailData.materialTypeId" @change="typeChange"
                   size="mini" clearable disabled class="right_Input"
                   style="width: calc(100% - 70px) !important;">
          <el-option v-for="item in codeItemMap.type"
                     :key="item.id"
                     :label="item.itemName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
			<!--<el-row>
			  <el-col :span="16">
			  	<el-form-item>
		      	<span class="span_colon">样品规格<i class="i_colon">：</i></span>
		        <el-radio-group v-model="detailData.materialTypeId" class="left_Radio">
		          <el-radio key="1" label="1" >产品</el-radio>
		          <el-radio key="2" label="2" >原料</el-radio>
		          <el-radio key="3" label="3" >中间体</el-radio>
		          <el-radio key="4" label="4" >中控</el-radio>
		        </el-radio-group>
		      </el-form-item>
			  </el-col>
			  <el-col :span="8">
			  	<el-form-item>
		        <span class="span_colon">终产品<i class="i_colon">：</i></span>
		        <el-select v-model="detailData.materialTypeId" @change="typeChange"
		                   size="mini" clearable disabled class="right_Input"
		                   style="width: calc(100% - 70px) !important;">
		          <el-option v-for="item in codeItemMap.type"
		                     :key="item.id"
		                     :label="item.itemName"
		                     :value="item.id" />
		        </el-select>
	      	</el-form-item>
			  </el-col>
			</el-row>-->
      
      
      <el-form-item>
      	<span class="span_colon">样品名称<i class="i_colon">：</i></span>
        <el-select v-model="detailData.materialName"  :disabled="materialNameEdit" @change="materialChange"
                   size="mini"
                   filterable
                   clearable
                   style="width: 100px">
          <el-option v-for="item in materials"
                     :key="item.id"
                     :label="item.materialName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
      	<span class="span_colon">样品批号<i class="i_colon">：</i></span>
        <el-input clearable  v-model="detailData.sampleNum"
                  size="mini"
                  style="width: 100px;"></el-input>
      </el-form-item>

      <el-form-item>
      	<span class="span_colon">物料编码<i class="i_colon">：</i></span>
        <el-input clearable  v-model="detailData.materialCode"
                  size="mini" disabled
                  style="width: 100px;"></el-input>
      </el-form-item>

      <el-form-item>
      	<span class="span_colon">样品等级<i class="i_colon">：</i></span>
        <el-select v-model="detailData.materialGradeId" disabled
                   size="mini"
                   clearable
                   style="width: 100px">
          <el-option v-for="item in codeItemMap.grade"
                     :key="item.id"
                     :label="item.itemName"
                     :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
      	<span class="span_colon">样品规模<i class="i_colon">：</i></span>
        <el-radio-group v-model="detailData.sampleTypeId">
          <el-radio v-for="item in codeItemMap.scope"
                    :key="item.id"
                    :label="item.id" >{{item.itemName}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <div>
        <div><span class="i_colon" style="color:#878989">检项选择：</span></div>
        <div class="el-dialog-table">

        </div>
      </div>
      <drug-table  @getSelection="getSelection" :filterPage="false" :isMultipleSelection="true"
                   :tableData="tableData" :tableLoading="tableLoading"
                   :tableHeader="tableHeader"  >
      </drug-table>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="green"
                 size="mini" @click="updateSendDetail"
                 style="width: 80px;">
        提 交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {getToken} from '@/utils/auth' // 验权
  import { formatDate } from '@/utils/formatDate'
  import drugTable from "@/components/table/index";

  export default {
    name: "sendEdit",
    components:{drugTable},
    data() {
      return {
        type:"",
        codeItemMap:{},
        user: {deptName: "", userName: ""},
        nowTime: new Date(),
        detailData: {
          saveTmp:false,
          sampleCode:"",
          locationId:"",
          finalProduct:"",
          sampleTypeId:"",
          materialName:"",
          materialCode:"",
          sampleNum:"",
        },
        dialogAddVisible: false,
        count: 0,

        sampleCount:0,

        finalProdMap:{},
        typeMap:{},
        materials:[],
        finalProds:[],
        finalProductEdit:true,
        materialNameEdit:true,
        selectChoice:[],

        tableData: [],
        tableHeader:[],
        tableLoading:true,

        reset:false,

        printCount:1,
      }
    },
    mounted() {
      let self = this;
      let user = JSON.parse(getToken());
      this.user = user;
      this.getMaterials();
      self.$eventBus.$on("openSendEdit",function (editData,operateType,codeItemMap) {
        self.dialogAddVisible = true;
        self.finalProductEdit = true;
        self.materialNameEdit = true;
        self.count = 0;
        self.type = operateType;
        self.codeItemMap = codeItemMap;
        self.detailData = editData;
        if(self.type == 'add'){
          self.getSampleCount();
          self.getTableData();
        }else{
          self.getSampleItems();
          self.nowTime = new Date(editData.createTime);
        }
      })
    },
    computed:{
      materialCode(){
        return this.detailData.materialCode;
      }
    },
    methods: {
      getSelection(val){
        this.selectChoice = val;
      },
      finalChange(val){
        // this.detailData.materialGradeId ="";
        // this.detailData.materialCode = "";
        // this.detailData.materialName = "";
        // this.materials = this.finalProdMap[val];
        // if(this.materials.length == 1){
        //   this.detailData.materialName = this.materials[0].materialName;
        //   this.detailData.materialGradeId = this.materials[0].materialGradeId;
        //   this.detailData.materialCode = this.materials[0].materialCode;
        // }
      },
      materialChange(val){
        for(let data of this.materials){
          if(data.id == val){
            this.detailData.materialGradeId = data.materialGradeId;
            this.detailData.materialCode = data.materialCode;
            //打印
            this.detailData.materialType = data.materialTypeId;
            this.detailData.materialGrade = data.materialGradeId;
            this.detailData.materialNameCn = data.materialName;
          }
        }
        this.selectChoice = [];
      },
      typeChange(val){
        this.materials = this.typeMap[val];
        this.detailData.materialCode = "";
        this.detailData.materialName = "";
        this.finalProds = [];
        let repeat = [];
        for(let val of this.materials){
          if(val.finalProd && repeat.indexOf(val.finalProd) < 0){
            repeat.push(val.finalProd);
            this.finalProds.push(val);
          }
        }
        this.finalProductEdit = false;
        this.materialNameEdit = false;
      },

      getCount(){
        let count = this.sampleCount;
        if(count <10){
          count = "0000"+count;
        }
        else if(count <100){
          count = "000"+count;
        }
        else if(count <1000){
          count = "00"+count;
        }
        else if(count <10000){
          count = "0"+count;
        }
         return count;
      },
      getRandom(){
        let code = "";
        let day = formatDate(new Date(), "yyyy");
        let count = this.getCount();
        code = "T"+day+count;
        return code;
      },

      changeMaterialType(){
        this.detailData.materialCode = "";
        for(let data of this.grades){
          if(data.id == this.detailData.materialTypeId){
             if(data.itemName == '成品'){
               this.detailData.materialCode =  "CP"+this.getRandom();
               break;
             }
            if(data.itemName == '原料'){
              this.detailData.materialCode = "";
              break;
            }
            if(data.itemName.indexOf("中控") > -1){
              this.detailData.materialCode = "P"+this.getRandom()+"C";
              break;
            }
            if(data.itemName.indexOf("中间体") >-1){
              this.detailData.materialCode = data.itemName+"-"+this.getCount();
              break;
            }
          }
        }
      },
      checkValue(){
        if(!this.detailData.locationId){
          this.showTip("请选择地点！");
          return false;
        }
        if(!this.detailData.materialTypeId){
          this.showTip("请输入物料规格！");
          return false;
        }
        if(!this.detailData.materialName){
          this.showTip("请选择物料！");
          return false;
        }
        if(this.selectChoice.length < 1){
          this.showTip("请选择标准！");
          return false;
        }
        return true;
      },
      showTip(msg){
        let self = this;
        self.$notify({
          title: '提示',
          message: msg,
          type: 'warning'
        });
      },
      updateSendDetail(){
        let self = this;
        if(!self.checkValue()){
          return;
        }
        delete self.detailData.createTime;
        delete self.detailData.updateTime;
        self.detailData.userId = self.$store.getters.userId;
        self.detailData.userName = self.$store.getters.userName;
        self.detailData.saveTmp = self.detailData.saveTmp?"1":"0";
        let standardItems = [];
        for(let data of this.selectChoice){
          let o = {methodDesc:data.methodDesc,testRecord:data.testRecord,
            testStaffOrg:self.user.deptId,methodId:data.methodId,
            manHour:data.manHour,sampleId:self.detailData.sampleCode,
            itemId:data.itemId,itemName:data.itemName,
            itemQualityStandard:data.itemQualityStandard};
            standardItems.push(o);
        }
        self.detailData.standardItems = standardItems;
        let url = this.type == 'add' ? "/drug/sample/addSampleDetail" : "/drug/sample/updateSample";
        self.getPrintCount();
        self.detailData.printCount = self.printCount;
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            data: JSON.stringify(self.detailData),
            dataType: 'json',
            contentType: "application/json",
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateSampleList");
              self.$notify({
                title: '提示',
                message: "操作成功！",
                type: 'success'
              });
              self.dialogAddVisible = false;
              return
            }
            self.$notify({
              title: '提示',
              message: "出现异常，请联系管理员",
              type: 'error'
            });
            this.count--;
          });
          this.count++;
        }
      },

      getPrintCount(){
        if(this.type == 'add'){
          this.printCount = 1;
          if(this.detailData.saveTmp == '1'){
            this.printCount++;
          }
          let locationFlag = false;
          for(let location of this.codeItemMap.location){
            if(this.detailData.locationId == location.id &&location.itemName == '江北'){
              locationFlag = true;
              break;
            }
          }
          let wswFlag = false;
          let rdsFlag = false;
          let yqFlag = false;
          for(let data of this.detailData.standardItems){
            if(data.itemName.indexOf('微生物') >-1){
              wswFlag = true;
            }
            if(data.itemName.indexOf('肉毒素') >-1){
              rdsFlag = true;
            }
            if(data.itemName.indexOf('仪器') >-1){
              yqFlag = true;
            }
          }
          if(wswFlag){
            this.printCount++;
          }
          if(rdsFlag){
            this.printCount++;
          }
          if(yqFlag&&locationFlag){
            this.printCount++;
          }
        }
      },
      getSampleCount() {
        let self = this;
        self.$http({
          url: "/drug/sample/querySampleCount",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.sampleCount = resp.result;
            let count = self.getRandom();
            self.detailData.sampleCode = count;
          }
        });
      },
      getMaterials() {
        let self = this;
        self.$http({
          url: "/drug/material/queryAllMaterials",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.materials = resp.result.list;
            self.finalProdMap = resp.result.map;
            self.typeMap = resp.result.typeMap;
          }
        });
      },
      getTableData(){
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/standard/selectMatrialStandradItemsListByCode",
          method: "post",
          params:{code:self.detailData.materialCode}
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            self.tableData = resp.result;
            self.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"}];
          }
        });
      },
      getSampleItems(){
        let self = this;
        self.tableLoading = true;
        self.$http({
          url: "/drug/sampleItem/querySampleItemSend",
          method: "post",
          params:{sampleCode:self.detailData.sampleCode}
        }).then(resp => {
          if (resp.success) {
            self.tableLoading = false;
            for(let data of resp.result.items){
              if(data.resultId == "Y"){
                data.resultIdCn="合格";
              }
              if(data.resultId == "N"){
                data.resultIdCn="不合格";
              }
            }
            self.tableData = resp.result.items;
            self.tableHeader =  [
              {"columnName": "itemName", "coloumNameCn": "检项名称"},
              {"columnName": "itemQualityStandard", "coloumNameCn": "质量标准"},
              {"columnName": "testResult", "coloumNameCn": "检测结果"},
              {"columnName": "resultIdCn", "coloumNameCn": "判定结果"},
            ];
          }
        });
      }
    },
    watch: {
      materialCode(val){
        if(this.type == 'add'){
          this.getTableData();
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-col-line {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }

  .el-dialog .el-button--red {
    background-color: #c00400;
    border-color: #c00400;
  }
  .Input_Dialog {
  	.el-input,.el-select {
  		width: 180px !important
  	}
  }
  .NoImg {
  	width: 30px
  }
  .el-form-right.float_right {
  	position: absolute;
  	right: 0;
  	top: 45px;
  }
  .right_Input {
  		max-width: 180px;
  	.el-select {
  	}
  }
</style>
