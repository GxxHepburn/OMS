import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue')

// import GoodsList from '../components/goods/List.vue'
const GoodsList = () => import(/* webpackChunkName: "goodslist_add" */ '../components/goods/List.vue')

const Search = () => import('../components/goods/Search.vue')

// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "goodslist_add" */ '../components/goods/Add.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')

const AddCate = () => import('../components/goods/AddCate.vue')

// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order.vue')

const AddTab = () => import(/* webpackChunkName: "order_report" */ '../components/tabs/addTab.vue')

const AddTabType = () => import(/* webpackChunkName: "order_report" */ '../components/tabs/addTabType.vue')

const SearchTab = () => import(/* webpackChunkName: "order_report" */ '../components/tabs/searchTab.vue')

const TabList = () => import(/* webpackChunkName: "order_report" */ '../components/tabs/tabList.vue')

const TabType = () => import(/* webpackChunkName: "order_report" */ '../components/tabs/tabType.vue')

// import Mer
const MerInfoList = () => import('../components/mer/MerInfo.vue')

// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/static/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/static/login'
  },
  {
    path: '/static/home',
    component: Home,
    redirect: '/static/welcome',
    children: [
      {
        path: '/static/welcome',
        component: Welcome
      },
      {
        path: '/static/users',
        component: Users
      },
      {
        path: '/static/categories',
        component: Cate
      },
      {
        path: '/static/goods',
        component: GoodsList
      },
      {
        path: '/static/goods/add',
        component: Add
      },
      {
        path: '/static/goodsSearch',
        component: Search
      },
      {
        path: '/static/addCategories',
        component: AddCate
      },
      {
        path: '/static/orders',
        component: Order
      },
      {
        path: '/static/tabList',
        component: TabList
      },
      {
        path: '/static/addTab',
        component: AddTab
      },
      {
        path: '/static/addTabType',
        component: AddTabType
      },
      {
        path: '/static/searchTab',
        component: SearchTab
      },
      {
        path: '/static/tabType',
        component: TabType
      },
      {
        path: '/static/merInfo',
        component: MerInfoList
      },
      {
        path: '/static/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next () 放行   next('/login') 强制跳转路径
  if (to.path === '/static/login') {
    next()
    return
  }
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    next('/static/login')
    return
  }
  next()
})

export default router
