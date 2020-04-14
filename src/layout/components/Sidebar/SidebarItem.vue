<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow&&hasRole(item)">
      <app-link v-if="onlyOneChild.meta"
                :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)"
                      :class="{'submenu-title-noDropdown':!isNest}">
          <!--<item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"-->
                <!--:title="onlyOneChild.meta.title" />-->
          <img :src="onlyOneChild.meta.image" style="width: 17px;margin-right: 4px;margin-left: 15px">
          <span  slot="title">{{onlyOneChild.meta.title}}</span>
					<span class="txt_Num" v-if="onlyOneChild.meta.title  == '信息'">{{txtNum}}</span>
          <span class="txt_Icon" v-if="onlyOneChild.meta.title  == '质量标准'" v-show="InfoQuestion"><i style="color: #fff;">?</i></span>
        </el-menu-item>
      </app-link>
    </template>

    <div v-else class="el-menu-item-title">
      <el-submenu ref="subMenu" v-if="hasRole(item)"
                  :index="resolvePath(item.path)"
                  popper-append-to-body>
        <template slot="title">
          <!--<item v-if="item.meta"-->
                <!--:icon="item.meta && item.meta.icon"-->
                <!--:title="item.meta.title" />-->
          <img :src="item.meta.image" style="width: 17px;margin-right: 4px;margin-left: 15px">
          <span  slot="title">{{item.meta.title}}</span>
        </template>
        <sidebar-item v-for="child in item.children"
                      :key="child.path"
                      :is-nest="true"
                      :item="child"
                      :base-path="resolvePath(child.path)"
                      class="nest-menu" />
      </el-submenu>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import { getToken } from '@/utils/auth' // 验权

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
    	txtNum: 0,
    	InfoQuestion: false,
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    fetchData() {
      let self = this;
      let user = JSON.parse(getToken());
      self.$http({
        url: "/drug/notice/queryNoticeList",
        method: "post",
        params: {userId:user.id,status:"1"}
      }).then(resp => {
        if (resp.success) {
          self.txtNum = resp.result.length;
        }
      });
    },
    getList() {
      let self = this;
      self.$http({
        url: "/drug/standard/queryMaterialStandardList",
        method: "post",
        params: {
        	id: '',
        	userName: '',
        	materialCode:'',
        	startTime: '',
        	endTime:'',
        	materialGradeId: '',
        	materialTypeId:'',
        	finalProd: '',
        	status: '',
        }
      }).then(resp => {
        if (resp.success) {
			    for(let data of resp.result){
				     if(data.checkStatusCn == '审核中' || data.checkStatusCn == '驳回'){
				      	self.InfoQuestion = true
				      }
				  }
        }
      });
    },
  },
  mounted() {
    let self = this;
    self.fetchData();
    self.getList();
    self.$eventBus.$on("updateTxtNum",function () {
      self.fetchData();
    });
    self.$eventBus.$on("updateCheck",function () {
      self.getList();
    });
  },
}
</script>
<style scoped>
	.txt_Num {
		background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    position: absolute;
    top: 8px;
    left: 46%;
	}
	.txt_Icon {
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 14px;
    height: 18px;
    line-height: 18px;
    width: 18px;
    text-align: center;
    padding-right: 1px;
    white-space: nowrap;
    position: absolute;
    top: 9px;
    right: 20%;
	}
</style>
