<template>
  <div :class="{'has-logo':showLogo}" class="leftMain">
    <!--<logo v-if="showLogo"
          :collapse="isCollapse" />-->
    <div style="width: 200px;height: 100px;background: #2e827f;">
    	
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper"  class="left_menuList">
      <el-menu :default-active="activeMenu"
               :collapse="isCollapse"
               :background-color="variables.menuHover"
               :text-color="variables.menuText"
               :unique-opened="false"
               :active-text-color="variables.menuActiveText"
               :collapse-transition="false"
               mode="vertical" class="meunList_contain">
        <sidebar-item v-for="route in permission_routes"
                      :key="route.path"
                      :item="route"
                      :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <footer class="el-footer"
            style="height: 60px;">2018 ©️ CopyRight Reserved .Well</footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style scoped lang="scss">
	.leftMain {
			.left_menuList {
				background: #f1f2f0;
				.el-menu {
					background-color: #f1f2f0 !important;
				}
				.meunList_contain {
					a {
						background-color: #f1f2f0 !important;
					}
				}
			}
	}
	
</style>
