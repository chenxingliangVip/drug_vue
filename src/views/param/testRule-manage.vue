<template>
    <div class="app-container">
        <div class="filter-container">
            <div>
                <div class="filter-item">
                    <span>送样地点:</span>
                    <el-select
                        v-model="searchParam.locationId"
                        size="mini"
                        clearable
                        style="width: 100px"
                    >
                        <el-option
                            v-for="item in codeItemMap.location"
                            :key="item.id"
                            :label="item.itemName"
                            :value="item.id"
                        />
                    </el-select>
                </div>
                <div class="filter-item">
                    <span>方法属性:</span>
                    <el-select
                        v-model="searchParam.attrId"
                        size="mini"
                        clearable
                        style="width: 100px"
                    >
                        <el-option
                            v-for="item in codeItemMap.method_attr"
                            :key="item.id"
                            :label="item.itemName"
                            :value="item.id"
                        />
                    </el-select>
                </div>
                <div class="filter-item">
                    <span style="letter-spacing:0.5em;margin-right:-0.5em;">检验组</span>
                    <span>:</span>
                    <el-select
                        v-model="searchParam.deptId"
                        size="mini"
                        clearable
                        style="width: 100px"
                    >
                        <el-option
                            v-for="item in codeItemMap.dept"
                            :key="item.id"
                            :label="item.deptName"
                            :value="item.id"
                        />
                    </el-select>
                </div>
                <div>
                    <div class="filter-item">
                        <span style="letter-spacing:0.5em;margin-right:-0.5em;">规则值</span>
                        <span>:</span>
                        <el-input
                            clearable
                            v-model="searchParam.checkValue"
                            size="mini"
                            style="width: 270px;"
                            @keyup.enter.native="getList"
                        />
                    </div>
                    <div class="filter-item filter-item-btn-search">
                        <i class="el-icon-search" style="cursor: pointer" @click="getList"></i>
                    </div>
                    <el-button
                        class="filter-btn-item"
                        v-if="hasRole('testRule:param:delete')"
                        size="mini"
                        style="margin-left: 10px;width: 80px;"
                        type="info"
                        icon="el-icon-delete"
                        @click="batchDelete"
                    >删除</el-button>
                    <el-button
                        class="filter-btn-item"
                        v-if="hasRole('testRule:param:add')"
                        size="mini"
                        style="margin-left: 10px;width: 80px;"
                        type="primary"
                        icon="el-icon-edit"
                        @click="addTestRule"
                    >新增</el-button>
                </div>
            </div>
        </div>
        
    		<div class="tab-container">
			      <el-tabs style="margin-top:5px;" class="tabNav" type="border-card">
				        <el-tab-pane label="规则一" >
				          	<working-hours-pane />
				        </el-tab-pane>
				        <el-tab-pane label="规则二">
				          	<timely-rate-pane />
				        </el-tab-pane>
			      </el-tabs>
		    </div>
        <drug-table
            @getSelection="getSelection"
            :isMultipleSelection="true"
            :tableData="tableData"
            :tableLoading="tableLoading"
            :tableHeader="tableHeader"
            :option="option"
        >
            <template slot-scope="props" slot="operate">
                <div>
                    <el-button
                        type="text"
                        v-if="hasRole('testRule:param:edit')"
                        @click="handleEditData(props.rowData)"
                        size="mini"
                    >编辑</el-button>
                </div>
            </template>
        </drug-table>
        <testing :editData="editData" :type="operateType" :codeItemMap="codeItemMap"></testing>
    </div>
</template>

<script>
import waves from "@/views/directive/waves"; // waves directive
import drugTable from "@/components/table/index";
import testing from "./dialog/testRuleDialog";
export default {
  	name: 'TestRuleManage',
    components: { drugTable, testing },
    directives: { waves },
    data() {
        return {
            tableData: [],
            tableHeader: [],
            tableLoading: true,
            option: { showOperate: true },
            selectChoice: [],
            searchParam: {
                locationId: "",
                attrId: "",
                typeId: "",
                deptId: "",
                checkValue: ""
            },
            codeItemMap: {
                location: [],
                method_attr: [],
                regular: [],
                dept: []
            },
            operateType: "add",
            editData: {}
        };
    },
    mounted() {
        let self = this;
        self.$eventBus.$on("updateRuleList", function() {
            self.getList();
        });
        this.getList();
        this.getDeptList();
        this.getItemCode();
    },
    methods: {
        getList() {
            let self = this;
            self.tableLoading = true;
            self.$http({
                url: "/drug/rule/queryRuleList",
                method: "post",
                params: self.searchParam
            }).then(resp => {
                if (resp.success) {
                    self.tableLoading = false;
                    self.tableData = resp.result;
                    self.tableHeader = [
                        { columnName: "serialNo", coloumNameCn: "等级", width: "60px" },
                        { columnName: "location", coloumNameCn: "送样地点" },
                        { columnName: "attrName", coloumNameCn: "方法属性" },
                        { columnName: "typeName", coloumNameCn: "检验规则" },
                        { columnName: "checkValue", coloumNameCn: "规则值" },
                        { columnName: "deptNames", coloumNameCn: "检验组" }
                    ];
                    self.option.showOperate = true;
                }
            });
        },

        getSelection(val) {
            this.selectChoice = val;
        },

        handleEditData(rowData) {
            this.editData = Object.assign({}, rowData);
            this.operateType = "edit";
        },
        addTestRule() {
            this.editData = {
                locationId: "",
                attrId: "",
                typeId: "",
                checkValue: "",
                deptIds: []
            };
            this.operateType = "add";
        },
        batchDelete() {
            let param = { ids: [] };
            for (let data of this.selectChoice) {
                param.ids.push(data.id);
            }
            this.deleteRow(param);
        },
        getItemCode() {
            let self = this;
            self.codeItemMap = {
                location: [],
                method_attr: [],
                regular: [],
                dept: []
            };
            self.$http({
                url: "/drug/codeItem/queryCodeItemList",
                method: "post"
            }).then(resp => {
                if (resp.success) {
                    for (let data of resp.result) {
                        if (self.codeItemMap.hasOwnProperty(data.itemCode)) {
                            self.codeItemMap[data.itemCode].push(data);
                        }
                    }
                }
            });
        },
        deleteRow(param) {
            let self = this;
            if (!param || param.ids.length < 1) {
                self.$notify({
                    title: "提示",
                    message: "至少选择一条记录！",
                    type: "warning"
                });
                return;
            }
            self.$confirm("确定删除该信息？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                self.$http({
                    url: "/drug/rule/deleteTestRule",
                    method: "post",
                    data: JSON.stringify(param),
                    dataType: "json",
                    contentType: "application/json"
                }).then(resp => {
                    if (resp.success) {
                        self.getList();
                        self.$notify({
                            title: "提示",
                            message: "删除成功！",
                            type: "success"
                        });
                        return;
                    }
                    self.$notify({
                        title: "提示",
                        message: "操作失败，请联系管理员！",
                        type: "error"
                    });
                });
            });
        },
        getDeptList() {
            let self = this;
            self.$http({
                url: "/drug/dept/queryDeptChooseList",
                method: "post"
            }).then(resp => {
                if (resp.success) {
                    if (resp.result.length > 0) {
                        self.codeItemMap.dept = resp.result;
                    }
                }
            });
        }
    }
};
</script>


<style lang="scss" scoped>
.el-form-no {
    text-align: right;
    font-size: 18px;
    color: #cb0000;
}

.el-dialog .el-button--primary {
    background-color: #2e827f;
    border-color: #2e827f;
    border-radius: 3px;
    padding: 5px 10px;
}

.el-dialog-dep {
    border: solid 1px #2e827f;
    overflow: auto;
    margin-top: 3px;
    padding: 10px 10px 10px 30px;
    height: 100px;
    border-radius: 4px;
    .el-checkbox {
        width: 90px;
    }
}

.el-dialog-group {
    display: flex;
    flex-direction: row;
    color: #878989;
    font-size: 13px;
    margin-bottom: 10px;
}
</style>
