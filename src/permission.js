import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // 验权
import {asyncRouterMap,constantRouterMap} from '@/router/index'
import {
  setTitle
} from '@/utils/util'
import {default as api} from "./utils/api"; // 设置浏览器头部标题

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
const whiteList = ['/login','/bigScreen','/workPlace'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  let allPermissionNarHead = {};
  for(let k in  constantRouterMap){
    let router = constantRouterMap[k];
    if(router.meta && router.meta.permission){
      allPermissionNarHead[router.path] = router.meta.permission;
    }
    if(router.children){
      for(let child of router.children){
        let r = router.path+"/"+child.path;
        if(child.meta &&child.meta.permission){
          allPermissionNarHead[r] = child.meta.permission;
        }
      }

    }
  }
  let user = getToken();
  if (user) {
    user = JSON.parse(user);
    store.dispatch('user/setUserId',user.id);
    store.dispatch('user/setUserName',user.userName);
    /* has token*/
    if (to.path == '/' || to.path == '') {
      next({path: '/login'})
    } else if (to.path === '/login') {
      next()
    }else {
      api({
        url: "/drug/permission/queryRolePermission",
        method: "post",
        params:{userAccount:user.userAccount}
      }).then(function (response) {
        let _permission = response.result;
        for(let r of _permission){
          if(r.split(":").length > 2){
            let p_r = r.substring(0,r.lastIndexOf(":"));
            if(_permission.indexOf(p_r) < 0){
              _permission.push(p_r);
            }
          }
        }
        store.dispatch('user/setPermission',_permission||[]);
        store.dispatch('permission/generateRoutes').then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          let path = to.path;
          let access = allPermissionNarHead[path];
          if(access && _permission.indexOf(access) < 0 &&user.type != 1){
            next({path: '/page403'});
          }else{
            next() // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          }
        });
        next();
      }).catch(function (resp) {
        next({path: '/login'})
      });
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  setTimeout(() => {
    // const browserHeaderTitle = store.getters.browserHeaderTitle
    setTitle("智慧检测管理系统")
  }, 0)
})
