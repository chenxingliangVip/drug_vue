import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* 路由模块 */
import Layout from "@/layout";

const main = () => import("@/views/redirect/index.vue");
const home = () => import("@/views/home/index.vue");
const login = () => import("@/views/login/index.vue");


export const constantRouterMap = [
  {
    path: "/login",
    component: login,
    hidden: true
  },
  {
    path: "/iframe",
    component: () => import("@/views/iframe/index.vue"),
    props: (route) => ({ query: route.query.code })
  },
  {
    path: '/',
    component: login
  },
  {
    path: '/page403',
    component: () => import("@/views/page403.vue"),
  },
  {
    path: '',
    component: login
  },{
    path: "/bigScreen",
    component: () => import("@/views/bigScreen/index.vue"),
    name: "bigScreen",
  },
  //{
  //   path: '/board',
  //   component: () => import("@/views/board/index.vue"),
  // },
  {
    path: "/home",
    component: Layout,
    redirect: "/home",
    meta:{permission:"notice:index"},
    children: [
      {
        path: "index",
        component: home,
        name: "Home",
        meta: { title: "信息",image:require('@/assets/img/info.png'), icon: "home", affix: true ,permission:"see:notice"}
      }
    ]
  },
  {
    path: "/sending-station",
    component: Layout,
    name: "sending-station",
    meta: {
      title: "送检",
      icon: "sending_station",
      permission:"send:index",
      image:require('@/assets/img/send.png')
    },
    children: [
      {
        path: "sending",
        component: () => import("@/views/sending/sending.vue"),
        name: "Sending",
        meta: { title: "样品送检" ,permission:"yangpin:send",image:require('@/assets/img/send-01.png')}
      },
      {
        path: "material-coding",
        component: () => import("@/views/sending/material-coding.vue"),
        name: "material-coding",
        meta: { title: "物料编码",permission:"material:send",image:require('@/assets/img/send-02.png') }
      }
    ]
  },
  {
    path: "/inspection-area",
    component: Layout,
    name: "inspection-area",
    meta: {
      title: "检验",
      icon: "inspection_area",
      permission:"check:index",
      image:require('@/assets/img/sample.png')
    },
    children: [
      {
        path: "deptTask",
        component: () => import("@/views/inspection/deptTask.vue"),
        name: "deptTask",
        meta: { title: "部门任务" ,permission:"deptTask:check",image:require('@/assets/img/deptTask.png')}
      },
      {
        path: "sample-detection",
        component: () => import("@/views/inspection/sample-detection.vue"),
        name: "sample-detection",
        meta: { title: "样品检测" , permission:"sample:check",image:require('@/assets/img/sample-check.png')}
      },
      {
        path: "test-method",
        component: () => import("@/views/inspection/test-method.vue"),
        name: "test-method",
        meta: { title: "检验方法",permission:"method:check",image:require('@/assets/img/method.png') }
      },
      {
        path: "quality-standard",
        component: () => import("@/views/inspection/quality-standard.vue"),
        name: "quality-standard",
        meta: { title: "质量标准",permission:"standard:check",image:require('@/assets/img/material.png') }
      },
      {
        path: "sample-management",
        component: () => import("@/views/inspection/sample-management.vue"),
        name: "sample-management",
        meta: { title: "存样管理",permission:"saveSample:check",image:require('@/assets/img/sample-save.png') }
      }
    ]
  },
  {
    path: "/approval",
    component: Layout,
    meta:{permission:"approve:index",image:require('@/assets/img/approve.png') },
    children: [
      {
        path: "index",
        component: () => import("@/views/approval/index.vue",),
        name: "approval",
        meta: { title: "审批", icon: "approval",permission:"approve:index" ,image:require('@/assets/img/approve.png')}
      }
    ]
  },
  {
    path: "/check",
    component: Layout,
    meta:{permission:"effiect:index"},
    children: [
      {
        path: "index",
        component: () => import("@/views/check/index.vue"),
        name: "check",
        meta: { title: "检效", icon: "check" ,permission:"effiect:index",image:require('@/assets/img/check.png') }
      }
    ]
  },
  {
    path: "/param",
    component: Layout,
    name: "param",
    meta: {
      title: "参数",
      icon: "param",
      permission:"param:index",
      image:require('@/assets/img/param.png')
    },
    children: [
      {
        path: "inspection-specification",
        component: () => import("@/views/param/inspection-specification.vue"),
        name: "inspection-specification",
        meta: { title: "检验规则" , permission:"rule:param",image:require('@/assets/img/param-rule.png')}
      },
      // {
      //   path: "testRule-manage",
      //   component: () => import("@/views/param/testRule-manage.vue"),
      //   name: "inspection-specification",
      //   meta: { title: "检验规则管理" , permission:"testRule:param",image:require('@/assets/img/param-testRule.png')}
      // },
      {
        path: "index",
        component: () => import("@/views/param/index.vue"),
        name: "param-manage",
        meta: { title: "参数管理" ,permission:"manage:param",image:require('@/assets/img/param-manage.png')}
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    name: "system",
    meta: {
      title: "系统",
      icon: "system",
      permission:"system:index",
      image:require('@/assets/img/system-main.png')
    },
    children: [
      {
        path: "notice",
        component: () => import("@/views/system/notice.vue"),
        name: "notice",
        meta: { title: "信息发布",permission:"rule:system",image:require('@/assets/img/info-send.png') }
      },
      {
        path: "user",
        component: () => import("@/views/system/user.vue"),
        name: "user",
        meta: { title: "用户管理",permission:"user:system" ,image:require('@/assets/img/usermanage.png') }
      },
      {
        path: "organization",
        component: () => import("@/views/system/organization.vue"),
        name: "organization",
        meta: { title: "组织管理",permission:"org:system",image:require('@/assets/img/orgmanage.png')  }
      },
      {
        path: "role",
        component: () => import("@/views/system/role.vue"),
        name: "role",
        meta: { title: "角色权限管理" ,permission:"role:system",image:require('@/assets/img/rolemanage.png')}
      },
      {
        path: "logs",
        component: () => import("@/views/system/logs.vue"),
        name: "logs",
        meta: { title: "系统日志" ,permission:"log:system",image:require('@/assets/img/logmanage.png')}
      },
      {
        path: "backup",
        component: () => import("@/views/system/backup.vue"),
        name: "backup",
        meta: { title: "数据备份",permission:"copy:system" ,image:require('@/assets/img/sysback.png')}
      },
      {
        path: "picture",
        component: () => import("@/views/system/picture.vue"),
        name: "picture",
        meta: { title: "图片管理",permission:"images:system" ,image:require('@/assets/img/pictureIcon.png')}
      }
    ]
  }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]

export default router;
