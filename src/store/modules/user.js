// import { login,logout ,getInfo} from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  user:{},
  userId:""
};

const mutations = {

  SET_USER_INFO(state,user){
    state.user=user;
  },

  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSION(state,permission){
    state.permission=permission;
  },
  SET_USERID(state,id){
    state.userId=id;
  }
};

const actions = {


  setLoginUserDetail({commit},user) {
    return new Promise(resolve => {
      commit('SET_USER_INFO',user);
      resolve()
    })
  },

  setPermission({commit},permission) {
    return new Promise(resolve => {
      commit('SET_PERMISSION',permission);
      resolve()
    })
  },
  setUserId({commit},id) {
    return new Promise(resolve => {
      commit('SET_USERID',id);
      resolve()
    })
  },
  setUserName({commit},name) {
    return new Promise(resolve => {
      commit('SET_NAME',name);
      resolve()
    })
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      if (username && password) {
        commit("SET_TOKEN", "admin-token");
        setToken("admin-token");
        console.log("登录成功");
        resolve();
      } else {
        reject();
      }
      //   login({ username: username.trim(), password: password }).then(response => {
      //     const { data } = response
      //     commit('SET_TOKEN', data.token)
      //     setToken(data.token)
      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.token) {
        commit("SET_ROLES", ["admin"]);
        commit("SET_NAME", "hhh");
        resolve({"roles":["admin"]});
      } else {
        reject();
      }
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      if (state.token) {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        removeToken();
        resetRouter();
        dispatch("tagsView/delAllViews", null, { root: true });
        resolve();
      } else {
        reject();
      }
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";

      commit("SET_TOKEN", token);
      setToken(token);

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch("tagsView/delAllViews", null, { root: true });

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
