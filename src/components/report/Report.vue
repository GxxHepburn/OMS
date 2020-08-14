<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据统计</el-breadcrumb-item>
          <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 为 ECharts 准备一个具备大小（宽高）的 Dom -->
            <div id="main" style="width: 750px;height: 400px;"></div>
        </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {},
  // 此时页面上的Dom元素已经被渲染完毕了
  async mounted () {
    // 基于准备好的 dom ， 初始化 echarts 实例（必须基于渲染完毕的 dom 元素）
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      this.$message.error('获取折线图数据失败!')
      return
    }
    console.log(res.data)

    // 准备数据和配置项
    const result = _.merge(res.data, this.options)

    // 展示数据
    myChart.setOption(result)
  },
  methods: {
    returnhome () {
      this.bus.$emit('rehome')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
