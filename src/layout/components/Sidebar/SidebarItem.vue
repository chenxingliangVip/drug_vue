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
          <span class="txt_Icon" v-if="onlyOneChild.meta.title  == '质量标准'" v-show="InfoQuestion"><i style="color: #cec813;">new!</i></span>
          <img src="@/assets/img/errorImg.png" class="txt_Error"  v-if="onlyOneChild.meta.title  == '数据备份'"/>
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
    	InfoQuestion: true,
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

  },
  mounted() {
    let self = this;
    self.$eventBus.$on("updateNoticeCount",function (count) {
      self.txtNum = count;
    });
    self.$eventBus.$on("updateStandard",function (count) {
      self.InfoQuestion = (count > 0);
    })
  },
}
</script>
<style scoped lang="scss">
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
    /*background-color: #F56C6C;*/
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 10px;
    height: 18px;
    line-height: 16px;
    width: 18px;
    text-align: center;
    padding-right: 3px;
    white-space: nowrap;
    position: absolute;
    top: 9px;
    right: 20%;
	}
	.txt_Error {
    width: 18px;
    height: 18px;
    position: absolute;
    top: 9px;
    right: 22%;
	}
</style>
