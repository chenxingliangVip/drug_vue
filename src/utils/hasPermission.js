import { getToken } from '@/utils/auth' // 验权
export function hasPermission(value) {
  if(typeof value=='string' ){
    value = {meta:{permission:value}};
  }
  if ((value.meta && value.meta.permission)) {
    let self = this;
    let permission = value.meta.permission;
    //adminFlag为1是超级管理员，0是普通用户,超级管理员能看到所有的菜单
    let user = JSON.parse(getToken());
    if (user.type == 1) {
      return true;
    } else {
      const roles = JSON.parse(JSON.stringify(self.$store.state.user.permission||[]));
      if(roles.indexOf(permission) < 0 ){
        let flags = [];
        getChildrenCheck(value.children,roles,flags);
        return flags.length > 0?true:false;
      }

    }
    return true;
  }
  return true;
}

function getChildrenCheck(children,roles,flags) {
  if(!children){
    return;
  }
  for(let child of children){
    if(child.meta && child.meta.permission){
      let _p = child.meta.permission;
      if(roles.indexOf(_p) > -1){
        flags.push(true);
        return;
      }
      getChildrenCheck(child.children,roles);
    }
  }
}
