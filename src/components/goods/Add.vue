<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" :center="true" :show-icon="true" :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :align-center="true" :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(元)" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" placeholder="可以输入小数,如 3.98"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number" placeholder="可以输入小数,如 1.55"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number" placeholder="不可以输入小数"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 Item 项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" :border="true"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 服文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
const titleConfig = {
  'ql-bold': '加粗',
  'ql-color': '颜色',
  'ql-font': '字体',
  'ql-code': '插入代码',
  'ql-italic': '斜体',
  'ql-link': '添加链接',
  'ql-background': '背景颜色',
  'ql-size': '字体大小',
  'ql-strike': '删除线',
  'ql-script': '上标/下标',
  'ql-underline': '下划线',
  'ql-blockquote': '引用',
  'ql-header': '标题',
  'ql-indent': '缩进',
  'ql-list': '列表',
  'ql-align': '文本对齐',
  'ql-direction': '文本方向',
  'ql-code-block': '代码块',
  'ql-formula': '公式',
  'ql-image': '图片',
  'ql-video': '视频',
  'ql-clean': '清除字体样式',
  'ql-upload': '文件'
}
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 商品所属的分类列表
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性参数列表
      onlyTableData: [],
      // 图片上传地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的 headers 请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  mounted () {
    this.addQuillTitle()
  },
  methods: {
    returnhome () {
      this.bus.$emit('rehome')
    },
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类数据失败!')
        return
      }
      this.catelist = res.data
    },
    // 级联选择器选中项变化,触发的的函数
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请线选择商品分类!')
          return false
        }
      }
    },
    async tabClicked () {
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取动态参数列表失败!')
          return
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取静态属性列表失败!')
          return
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 1.获取将要删除的图片的临时路径
      const filtPath = file.response.data.tmp_path
      // 2.从 pics 数组中,找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filtPath)
      // 3.调用数组的splice方法,把图片信息对象,从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功事件
    handleSuccess (response) {
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象 push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请填写必要的表单项!')
          return
        }
        // 执行添加的业务逻辑
        // loadash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发起请求
        // 商品的名称，必须是唯一的
        // 对商品中number类型进行处理
        form.goods_number = form.goods_number - 0
        form.goods_price = form.goods_price - 0
        form.goods_weight = form.goods_weight - 0
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
          return
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/static/goods')
      })
    },
    addQuillTitle () {
      const oToolBar = document.querySelector('.ql-toolbar')
      const aButton = oToolBar.querySelectorAll('button')
      const aSelect = oToolBar.querySelectorAll('select')
      aButton.forEach(function (item) {
        if (item.className === 'ql-script') {
          item.value === 'sub' ? (item.title = '下标') : (item.title = '上标')
        } else if (item.className === 'ql-indent') {
          item.value === '+1'
            ? (item.title = '向右缩进')
            : (item.title = '向左缩进')
        } else {
          item.title = titleConfig[item.classList[0]]
        }
      })
      aSelect.forEach(function (item) {
        item.parentNode.title = titleConfig[item.classList[0]]
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
