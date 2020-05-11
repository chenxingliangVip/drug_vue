<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button class="filter-btn-item" v-if="hasRole('org:system:add')"
                 size="mini"
                 style="margin-left: 10px;width: 80px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-btn-item" v-if="hasRole('org:system:add')"
                 size="mini"
                 style="margin-left: 10px;width: 80px;"
                 type="success"
                 icon="el-icon-edit-outline"
                 @click="handleEdit">
        编辑
      </el-button>

      <el-button class="filter-btn-item" v-if="hasRole('org:system:delete')"
                 size="mini"
                 style="margin-left: 10px;width: 80px;"
                 type="danger"
                 icon="el-icon-delete"
                 @click="handleDelete">
        删除
      </el-button>
    </div>
    <div class="app-main-container">
      <div class="el-dev-logo">
        <img src="../../assets/img/org.png" class="svg-icon">
      </div>
      <div class="el-dev-line">
        <div class="el-dev-divider"></div>
        <div class="el-div-tree mytree">
          <el-tree :data="deptList"
                   show-checkbox
                   :indent="0"
                   :default-expanded-keys="['0','4fa2f931-b307-40d5-83fb-81a199f8c621']"
                   node-key="id"
                   ref="tree"
                   check-strictly
                   :props="defaultProps"
                   highlight-current>
          </el-tree>
        </div>

      </div>
    </div>
    <div class="footImg"></div>
    <organize-edit :editData="editData" :deptList="deptList"></organize-edit>
    <organize-add ></organize-add>
  </div>
</template>
<script>
import organizeEdit from './organizeEdit';
import organizeAdd from './organizeAdd';
export default {
  name: '组织管理',
  data() {
    return {
      deptList:[],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      editData:{}
    }
  },
  components:{organizeEdit,organizeAdd},
  mounted(){
    let self = this;
    self.getList();
    self.$eventBus.$on("getDeptList",function () {
      self.getList();
    })
  },
  methods: {

    getList() {
      let self = this;
      self.$http({
        url: "/drug/dept/queryDeptList",
        method: "post",
      }).then(resp => {
        if (resp.success) {
          if(resp.result.length > 0){
            self.deptList = resp.result;
          }
        }
      });
    },

    handleEdit(){
      let self = this;
      let checkNodes = self.$refs.tree.getCheckedNodes();
      if(!checkNodes || checkNodes.length != 1){
        self.$notify({
          title: '提示',
          message: "选择一个节点！",
          type: 'warning'
        });
        return
      }
      self.$eventBus.$emit("openOrganizeAdd",checkNodes[0]);

    },

    handleDelete() {
      let self = this;
      let checkNodes = self.$refs.tree.getCheckedNodes();
      if(!checkNodes || checkNodes.length < 1){
        self.$notify({
          title: '提示',
          message: "至少选择一个节点！",
          type: 'warning'
        });
        return
      }
      let ids = [];
      for(let node of checkNodes){
        ids.push(node.id);
      }
      self.$confirm('确定删除该信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http({
          url: "/drug/dept/deleteDeptDetail",
          method: "post",
          data: JSON.stringify({ids:ids}),
          dataType: 'json',
          contentType: "application/json",
        }).then(resp => {
          if (resp.success) {
            self.getList();
            self.$notify({
              title: '提示',
              message: "删除成功！",
              type: 'success'
            });
            return
          }
          self.$notify({
            title: '提示',
            message: "操作失败，请联系管理员！",
            type: 'error'
          });
        });
      });
    },
    handleCreate() {
      this.editData = {id:""};
    }
  }
}
</script>

<style lang="scss">
.el-div-tree {
  .tree-container /deep/ .el-tree > .el-tree-node:after {
    border-top: none;
  }
}
</style>
<style lang="scss" scoped>
.filter-container {
  display: flex;
  flex-direction: row-reverse;
}

.app-main-container {
  margin: 10px 25px;
	/*height: calc(100vh - 252px);*/
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
.el-dev-logo {
  text-align: center;
  width: 86px;
  border-bottom: solid 1px #bebfbe;
  .svg-icon {
    width: 50px;
    height: 50px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}
.el-dev-divider {
  background-color: #bebfbe;
  position: relative;
  margin-left: 83px;
  margin-top: 5px;
  display: block;
  height: 1px;
  width: 20px;
  transform: rotate(40deg);
}
.el-div-tree {
  margin-left: 100px;
  margin-top: 6px;
}
.el-dialog-input {
  .el-checkbox {
    width: auto;
  }
}

.mytree /deep/ {
  border-left: 1px solid #bebfbe;
  padding-top: 40px;

  .el-tree-node__expand-icon{
      font-size: 16px;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }

  //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    content: '●';
    color: #bebfbe;
    left: -6px;
    top: 3px;
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: 1px solid #bebfbe;
  }

  .el-tree-node:before {
    content: '';
    left: 0px;
    padding-bottom: 10px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: '';
    left: 0px;
    color: #bebfbe;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px solid #bebfbe;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px solid #bebfbe;
    height: 10px;
    line-height: 1px;
    top: 12px;
    width: 24px;
  }
}
</style>
