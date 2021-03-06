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

const OrderTaking = () => import('../components/order/OrderTaking.vue')

const OrderItemSetting = () => import('../components/order/OrderItemSetting.vue')

const LastOrder = () => import('../components/order/LastOrder.vue')

const NotPayOrder = () => import('../components/order/NotPayReturnAndNotFiAndFiOrder.vue')

const ReturnOrder = () => import('../components/order/NotPayReturnAndNotFiAndFiOrder.vue')

const NotFiOrder = () => import('../components/order/NotPayReturnAndNotFiAndFiOrder.vue')

const FiOrder = () => import('../components/order/NotPayReturnAndNotFiAndFiOrder.vue')

const AddTab = () => import('../components/tabs/addTab.vue')

const AddTabType = () => import('../components/tabs/addTabType.vue')

const SearchTab = () => import('../components/tabs/searchTab.vue')

const TabList = () => import('../components/tabs/tabList.vue')

const TabType = () => import('../components/tabs/tabType.vue')

const PayRecord = () => import('../components/finance/PayRecord.vue')

const RefundRecord = () => import('../components/finance/RefundRecord.vue')

// import Mer
const MerInfoList = () => import('../components/mer/MerInfo.vue')

const OrderReports = () => import('../components/report/OrderReport.vue')

const GoodsReport = () => import('../components/report/GoodsReport.vue')

const TabsReport = () => import('../components/report/TabsReport.vue')

const UsersReport = () => import('../components/report/UsersReport.vue')

const BusinessReport = () => import('../components/report/BusinessReport.vue')

const OtherReport = () => import('../components/report/OtherReport.vue')

const FinanceReport = () => import('../components/report/FinanceReport.vue')

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
        name: 'Users',
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
        name: 'Order',
        component: Order
      },
      {
        path: '/static/nowOrders',
        component: OrderTaking
      },
      {
        path: '/static/orderItemSetting',
        component: OrderItemSetting
      },
      {
        path: '/static/notPayOrders',
        component: NotPayOrder
      },
      {
        path: '/static/lastOrders',
        component: LastOrder
      },
      {
        path: '/static/returnOrders',
        component: ReturnOrder
      },
      {
        path: '/static/notFiOrders',
        component: NotFiOrder
      },
      {
        path: '/static/fiOrders',
        component: FiOrder
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
        path: '/static/payRecord',
        component: PayRecord
      },
      {
        path: '/static/refundRecord',
        component: RefundRecord
      },
      {
        path: '/static/orderReports',
        component: OrderReports
      },
      {
        path: '/static/goodsReport',
        component: GoodsReport
      },
      {
        path: '/static/tabsReport',
        component: TabsReport
      },
      {
        path: '/static/usersReport',
        component: UsersReport
      },
      {
        path: '/static/businessReport',
        component: BusinessReport
      },
      {
        path: '/static/otherReport',
        component: OtherReport
      },
      {
        path: '/static/financeReport',
        component: FinanceReport
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
