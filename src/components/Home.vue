<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/home_top.png" alt="">
        <span>点菜宝智慧云餐厅 |</span>
        <label style="margin-left:10px;font-size:15px;">餐厅在线状态-</label>
        <label v-if="isWebSocket === '在线'" style="font-size:20px;margin-left:10px;color:#409EFF;font-weight:bold;">{{isWebSocket}}</label>
        <label v-if="isWebSocket === '休息'" style="font-size:20px;margin-left:10px;color:#F56C6C;font-weight:bold;">{{isWebSocket}}</label>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
         :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
         :router="true" :default-active="$route.path">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/static/' + subItem.path" v-for="subItem in item.children"
             :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
    <el-backtop :bottom="100">
      <div
        style="{
          height: 100%;
          width: 100%;
          background-color: #f2f5f6;
          box-shadow: 0 0 6px rgba(0,0,0, .12);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
        }"
      >
        UP
      </div>
    </el-backtop>
    <el-backtop>
      <div>
        <i class="el-icon-caret-top"></i>
      </div>
    </el-backtop>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        101: 'iconfont icon-user',
        201: 'iconfont icon-tijikongjian',
        301: 'iconfont icon-shangpin',
        401: 'iconfont icon-danju',
        501: 'iconfont icon-baobiao',
        601: 'el-icon-s-help',
        701: 'el-icon-s-finance'
      },
      // 是否折叠
      isCollapse: false,
      isWebSocket: '休息'
    }
  },
  created () {
    this.getMenuList()
    this.isNeedToConnectWebSocket()
    this.welcome()
  },
  computed: {
  },
  mounted () {
    window.$bus.$on('isWebSocketing', (val) => {
      if (val === 1) {
        this.isWebSocket = '在线'
      } else {
        this.isWebSocket = '休息'
      }
    })
  },
  methods: {
    // 欢迎界面-为了让用户点击，以确保
    welcome () {
      this.$confirm('您好，欢迎使用, 请注意餐厅状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
      }).catch(() => {
      })
    },
    // 检查是否需要开启websocket
    isNeedToConnectWebSocket () {
      if (window.sessionStorage.getItem('isNeedToConnectWebSocket') === '1') {
        this.$connectWebSocket.openWebSocket()
        // this.isWebSocket = '在线'
      }
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/static/login')
      // 检查关闭websocket
      if (window.wbss === undefined) {
        return
      }
      if (window.wbss.readyState !== 1) {
        window.wbss = undefined
        return
      }
      window.wbss.close()
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meat.msg)
        return
      }
      this.menulist = res.data
    },
    // 点击按钮， 切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  color: #ffffff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
