<template>
    <el-dialog
        :visible.sync="dialogAddVisible"
        append-to-body
        :close-on-click-modal="false"
        width="40%"
        title="物料编码 · 审批"  class="standard_Dialog"
    >
        <div class="dialog-title">
            <span style="margin-left:25px">物料编码审批</span>
            <img
                src="../../../assets/img/disapprove.jpg"
                v-if="detailData.checkStatus == '2'"
                style="display: inline;float: right;margin-top: -19px; width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;"
            />
          <img
            v-if="detailData.checkStatus == '4'"
            src="../../../assets/img/bohui.png"
            style="display: inline;float: right;margin-top: -19px; width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;"
          />
            <img
                v-if="detailData.checkStatus != '2' && detailData.checkStatus != '4'"
                src="../../../assets/img/approve.jpg"
                style="display: inline;float: right;margin-top: -19px; width: 80px;position:relative;z-index: 10; -webkit-user-drag: none;"
            />
        </div>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label>检项名称<i class="i_colon">：</i></label>
                    <span>{{detailData.materialName}}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label class="w3">申请号</label><i class="i_colon">：</i>
                    <span>{{detailData.materialNum}}</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label>英文简称<i class="i_colon">：</i></label>
                    <span>{{detailData.nameAbbr}}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label class="w2">部门</label><i class="i_colon">：</i>
                    <span>{{detailData.name}}</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label>物料规格<i class="i_colon">：</i></label>
                    <span>{{detailData.materialTypeName}}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label class="w3">申请人</label><i class="i_colon">：</i>
                    <span>{{detailData.userName}}</span>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label>参考物料<i class="i_colon">：</i></label>
                    <span>{{detailData.refItem}}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label>申请时间<i class="i_colon">：</i></label>
                    <span>{{detailData.createTimeFt}}</span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="el-dialog-item">
                    <label>物料等级<i class="i_colon">：</i></label>
                    <span>{{detailData.materialGradeName}}</span>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <div class="el-dialog-item">
                    <label>物料编码<i class="i_colon">：</i></label>
                    <span>{{detailData.materialCode}}</span>
                </div>
            </el-col>
            <el-col :span="12" >
                <div class="el-dialog-item" v-show="detailData.checkStatus=='2'">
                    <label style="color:#2e827f">新建质量标准人<i class="i_colon">：</i></label>
                    <el-select
                        v-model="detailData.standardMan"
                        size="mini"
                        clearable
                        filterable
                        style="width: 100px"
                    >
                        <el-option
                            v-for="item in loginList"
                            :key="item.id"
                            :label="item.userName"
                            :value="item.id"
                        />
                    </el-select>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24" style="margin-top:5px">
                <div class="el-dialog-item">
                    <label class="dialogTxt">产品描述<i class="i_colon">：</i></label>
                    <div style="width:87%">
                        <span>{{detailData.materialDescr}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24" style="margin-top:5px">
                <div class="el-dialog-item">
                    <label class="dialogTxt">补充说明<i class="i_colon">：</i></label>
                    <div style="width:87%">
                        <span>{{detailData.remark}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" style="margin-top:5px">
                <div class="el-dialog-item">
                    <div>
                        <label class="dialogTxt">审批意见<i class="i_colon">：</i></label>
                    </div>
                    <el-input
                        :disabled="detailData.checkStatus!='2'"
                        clearable
                        type="textarea"
                        maxlength="200"
                        :rows="2"
                        style="width: 90%;margin-left: 2px"
                        size="small"
                        placeholder="请输入500字内的审批意见"
                        v-model="detailData.content"
                    ></el-input>
                </div>
            </el-col>
        </el-row>

        <div slot="footer" v-if="hasRole('standard:approve:do') && detailData.checkStatus=='2'" class="dialog-footer">
            <el-button
                type="red"
                v-if="hasRole('material:approve:do')"
                size="mini"
                @click="submitCheck('4')"
                style="width: 80px;"
            >驳回</el-button>
            <el-button
                type="green"
                v-if="hasRole('material:approve:do')"
                size="mini"
                @click="submitCheck('5')"
                style="width: 80px;margin-left:30%"
            >批准</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { getToken } from "@/utils/auth"; // 验权
import drugTable from "@/components/table/index";
export default {
    name: "materialDialog",
    components: { drugTable },
    props: [],
    data() {
        return {
            detailData: {
                materialName: "",
                materialNum: "",
                nameAbbr: "",
                materialTypeName: "",
                materialGradeName: "",
                userName: "",
                refItem: "",
                materialCode: "",
                createTimeFt: "",
                content: "",
                standardMan: "",
                materialDescr: "",
                remark: ""
            },
            dialogAddVisible: false,
            count: 0,
            loginList: [],
            user: {}
        };
    },
    mounted() {
        let self = this;
        self.getAllLogin();
        let user = JSON.parse(getToken());
        this.user = user;
        self.$eventBus.$on("openMaterialApproveDialog", function(editData) {
            self.dialogAddVisible = true;
            self.count = 0;
            self.detailData = editData;
        });
    },
    methods: {
        getAllLogin() {
            let self = this;
            self.$http({
                url: "/drug/queryAllLoginList",
                method: "post"
            }).then(resp => {
                if (resp.success) {
                    self.loginList = resp.result;
                }
            });
        },
        submitCheck(checkStatus) {
            let self = this;
            if(checkStatus =='5' &&!self.detailData.standardMan){
              self.$notify({
                title: "提示",
                message: "请选择质量标准人",
                type: "warning"
              });
              return;
            }
            let param = {
                userName: self.user.userName,
                userId: self.user.id,
                content: self.detailData.content,
                id: self.detailData.fId,
                relateId: self.detailData.id,
                checkStatus: checkStatus,
                standardMan: self.detailData.standardMan,
                materialCode: self.detailData.materialCode
            };
            if (this.count == 0) {
                self.$http({
                    url: "/drug/fmApprove/updateMaterialFmApprove",
                    method: "post",
                    params: param
                }).then(resp => {
                    if (resp.success) {
                        self.$eventBus.$emit("updateMaterialApprove");
                        self.$notify({
                            title: "提示",
                            message: "操作成功！",
                            type: "success"
                        });
                        self.dialogAddVisible = false;
                        return;
                    }
                    self.$notify({
                        title: "提示",
                        message: "出现异常，请联系管理员",
                        type: "error"
                    });
                    this.count--;
                });
                this.count++;
            }
        }
    }
};
</script>
<style lang="scss" >
.el-div-version {
    .el-table {
        .el-table__header th {
            background-color: #d8dad7;
            color: #7e7f7d;
        }
    }
}
</style>

<style lang="scss" scoped>
.app-container {
    padding: 20px 0;
}

.el-input-scan {
    font-size: 13px;
    color: #d81a06;
}

.svg-container {
    padding: 6px 0px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
}

.svg-pending {
    width: 50px;
    height: 50px;
    fill: currentColor;
    overflow: hidden;
    float: right;
    margin-top: -20px;
    transform: rotate(15deg);
}

.el-col-frame {
    border: 1px solid #dcdfe6;
    width: 100%;
    legend {
        background: #fff;
        margin-left: -9px;
        writing-mode: tb-rl;
        color: #878989;
        padding: 10px 0;
    }
}

.el-dialog .el-button--primary {
    background-color: #2e827f;
    border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
}

.el-button .svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-bottom: 2px;
}
.dialog-title {
	img {
		width: 80px;
		position: absolute !important;
		right: 20px;
		top: 47px;
		margin-top: 0 !important;
    	background: #fff;
	}
}
</style>
