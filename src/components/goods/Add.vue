<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="200px">
        <el-form-item label="商品名称" prop='F_Name'>
          <el-input placeholder="请输入商品名称" v-model="editForm.F_Name" @blur="editForm.F_Name = editForm.F_Name.trim()"></el-input>
        </el-form-item>
        <el-form-item label="商品价格 (元)" prop="F_Price">
          <el-input placeholder="请输入商品价格" v-model="editForm.F_Price"></el-input>
        </el-form-item>
        <el-form-item label="上传新图片">
          <el-upload
              class="avatar-uploader"
              action="https://www.donghuastar.com/OSM/uploadFoodImg"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="uploadHeaders">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="商品库存" prop="F_Stock">
          <el-tag v-if="editForm.F_Stock == -1" :closable="true" @close="removeBottomLess" :disable-transitions="true">不限量</el-tag>
          <div class="editForm_F_Stock_Bottom_Wrap" v-else>
            <el-input placeholder="请输入商品库存" class="editForm_F_Stock_Input" v-model="editForm.F_Stock"></el-input>
            <el-radio class="editForm_F_Stock_Radio" v-model="editForm.F_Stock" label=-1>不限量</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="商品单位" prop="F_Unit">
          <el-input placeholder="请输入商品单位" v-model.trim="editForm.F_Unit" @blur="editForm.F_Unit = editForm.F_Unit.trim()"></el-input>
        </el-form-item>
        <el-form-item label="营销标签 (不超过四个字)" prop="F_Tag">
          <el-input placeholder="请输入营销标签" v-model="editForm.F_Tag" @blur="editForm.F_Tag = editForm.F_Tag.trim()"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-tag class="FS_Tag" size="mini" v-if="editForm.F_Specs == undefined || editForm.F_Specs.length <= 0">原价 : {{editForm.F_Price}} 元</el-tag>
          <el-tag class="FS_Tag"
            :disable-transitions="true"
            :closable="true"
              size="mini"
              v-else v-for="item in editForm.F_Specs"
              :key="item.FS_ID"
              @close="removeEditFormFSTag(item)">
              {{item.FS_Key}} : {{$math.chain($math.bignumber(Number(item.FS_Value))).add($math.bignumber(Number(editForm.F_Price)))}} 元</el-tag>
          <el-button v-if="(editForm.F_Specs == undefined || editForm.F_Specs.length <= 2) && !FSinputVisible"
            class="button-new-tag" size="small"
            @click="showInput">+ New</el-button>
          <el-input
            class="editDialogSpecsInput"
            placeholder="规格名称/价格"
            v-if="FSinputVisible"
            v-model="editFormF_Specs_Input_Value"
            @keyup.enter.native="$event.target.blur" @blur="handleInputConfirm"
            ref="saveeditDialogFSInput"></el-input>
        </el-form-item>
        <el-form-item label="属性">
          <el-dropdown :hide-on-click="false" v-for="item in editForm.F_Properties" :key="item.FP_ID" trigger="click">
              <el-button type="primary" size="mini">
                {{item.FP_Name}}
                <i class="el-icon-arrow-down el-icon--right"></i>
                |<i class="el-icon-circle-close el-icon--right editDialogFPDelete" @click.stop="handleEditDialogFPDelete(item)"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="editDialogFPDropdownMenu">
                <el-dropdown-item class="editDialogFPDropdownMenuItem">
                  一：
                  <el-input placeholder="请输入" class="editDialogFPItemInput" v-model="item.FP_ValueOne" @blur="fpblur(0, item)"></el-input>
                </el-dropdown-item>
                <el-dropdown-item class="editDialogFPDropdownMenuItem">
                  二：
                  <el-input placeholder="请输入" class="editDialogFPItemInput" v-model="item.FP_ValueTwo" @blur="fpblur(1, item)"></el-input>
                </el-dropdown-item>
                <el-dropdown-item class="editDialogFPDropdownMenuItem">
                  三：
                  <el-input placeholder="请输入" class="editDialogFPItemInput" v-model="item.FP_ValueThree" @blur="fpblur(2, item)"></el-input>
                </el-dropdown-item>
                <el-dropdown-item class="editDialogFPDropdownMenuItem">
                  四：
                  <el-input placeholder="请输入" class="editDialogFPItemInput" v-model="item.FP_ValueFour" @blur="fpblur(3, item)"></el-input>
                </el-dropdown-item>
                <el-dropdown-item class="editDialogFPDropdownMenuItem">
                  五：
                  <el-input placeholder="请输入" class="editDialogFPItemInput" v-model="item.FP_ValueFive" @blur="fpblur(4, item)"></el-input>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="(editForm.F_Properties == undefined || editForm.F_Properties.length <= 1) && !FPinputVisible"
              class="button-new-fp" size="small"
              :style="editForm.F_Properties == undefined || editForm.F_Properties.length == 0?'margin-left:0;':'margin-left:20px;'"
              @click="showProInput">+ New</el-button>
            <el-input
              class="editDialogProInput"
              placeholder="属性类别名称"
              v-if="FPinputVisible"
              v-model="editFormF_Properties_Input_Value"
              :style="editForm.F_Properties == undefined || editForm.F_Properties.length == 0?'margin-left:0;':'margin-left:20px;'"
              @keyup.enter.native="$event.target.blur" @blur="handleProInputConfirm"
              ref="saveditDialogFPInput"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="F_FTID">
          <el-select v-model="editForm.F_FTID" placeholder="请选择">
            <el-option
              v-for="item in catesList"
              :key="item.FT_ID"
              :label="item.FT_Name"
              :value="item.FT_ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="addFoodButton" type="primary" @click="addFood">添 加</el-button>
          <el-button class="resetFoodButton" type="info" @click="resetFood">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      editFormF_Specs_Input_Value: '',
      editForm: {
        F_Stock: '',
        F_Tag: '',
        F_Properties: [],
        F_Specs: [],
        F_Unit: '',
        F_Name: '',
        F_ImageUrl: '',
        F_Price: '',
        F_FTID: ''
      },
      imageUrl: '',
      // 上传图片所需headers
      uploadHeaders: { Authorization: window.sessionStorage.getItem('token') },
      editFormRules: {
        // 修改价格的时候，一定注意，降价的时候，规格中的最低价不能低于0！！！
        F_Name: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          { min: 1, max: 20, message: '商品名长度在1~20个字符之间', trigger: 'blur' }
        ],
        F_Price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/, message: '请输入正确的金额' }
        ],
        F_Stock: [
          { required: true, message: '请输入库存', trigger: 'change' },
          { pattern: /^-1$|^0$|(^[1-9]\d*$)/, message: '请输入正确的库存' }
        ],
        F_Unit: [
          { required: true, message: '请输入商品单位', trigger: 'blur' },
          { min: 1, max: 1, message: '商品单位只能是一个字符', trigger: 'blur' }
        ],
        F_Tag: [
          { max: 4, message: '商品标签最多四个字符', trigger: 'blur' }
        ],
        F_FTID: [
          { required: true, message: '请选择商品分类' }
        ]
      },
      FSinputVisible: false,
      // 控制FPinput是否显示
      FPinputVisible: false,
      // FPInput值
      editFormF_Properties_Input_Value: '',
      // 商品分类数组
      catesList: []
    }
  },
  created () {
    this.getCatesList()
  },
  methods: {
    // 属性项blur
    fpblur (index, item) {
      if (index === 0) {
        if (item.FP_ValueOne.trim().length > 5) {
          this.$message.error('属性项不能超过5个字符')
          item.FP_ValueOne = ''
        }
      }
      if (index === 1) {
        if (item.FP_ValueTwo.trim().length > 5) {
          this.$message.error('属性项不能超过5个字符')
          item.FP_ValueTwo = ''
        }
      }
      if (index === 2) {
        if (item.FP_ValueThree.trim().length > 5) {
          this.$message.error('属性项不能超过5个字符')
          item.FP_ValueThree = ''
        }
      }
      if (index === 3) {
        if (item.FP_ValueFour.trim().length > 5) {
          this.$message.error('属性项不能超过5个字符')
          item.FP_ValueFour = ''
        }
      }
      if (index === 4) {
        if (item.FP_ValueFive.trim().length > 5) {
          this.$message.error('属性项不能超过5个字符')
          item.FP_ValueFive = ''
        }
      }
    },
    resetFood () {
      this.$refs.editFormRef.resetFields()
      this.editForm.F_Properties = []
      this.editForm.F_Specs = []
      this.editForm.F_FTID = ''
      this.imageUrl = ''
    },
    addFood () {
      this.$refs.editFormRef.validate(async valid => {
        // 验证验证规则
        if (!valid) {
          return
        }
        // 图片地址不能为''
        if (this.imageUrl === '') {
          this.$message.error('未上传图片')
          return
        }
        // 规格不需要额外审查，因为在输入的时候，已经做了额外的审查了，只需要加一个因为价格影响，导致规格可能小于0的审查！
        // 加一个规格小于0检查，因为价格调整后可能导致规格小于0
        for (var FSItemIndex in this.editForm.F_Specs) {
          if (this.$math.chain(this.$math.bignumber(Number(this.editForm.F_Specs[FSItemIndex].FS_Value))).add(this.$math.bignumber(Number(this.editForm.F_Price))).done() < 0) {
            this.$message.error('规格不能小于0')
            return
          }
        }
        // 属性相关检查,属性item要先trim操作
        // 如果属性类别下没有属性项，则将该属性类别删除
        for (var FPItemIndex in this.editForm.F_Properties) {
          if ((this.editForm.F_Properties[FPItemIndex].FP_ValueOne === undefined || this.editForm.F_Properties[FPItemIndex].FP_ValueOne === '') &&
            (this.editForm.F_Properties[FPItemIndex].FP_ValueTwo === undefined || this.editForm.F_Properties[FPItemIndex].FP_ValueTwo === '') &&
            (this.editForm.F_Properties[FPItemIndex].FP_ValueThree === undefined || this.editForm.F_Properties[FPItemIndex].FP_ValueThree === '') &&
            (this.editForm.F_Properties[FPItemIndex].FP_ValueFour === undefined || this.editForm.F_Properties[FPItemIndex].FP_ValueFour === '') &&
            (this.editForm.F_Properties[FPItemIndex].FP_ValueFive === undefined || this.editForm.F_Properties[FPItemIndex].FP_ValueFive === '')) {
            this.editForm.F_Properties.splice(FPItemIndex, 1)
          }
        }
        // 对非空确保不重复（trim操作已经在元素上操作了)
        for (var FPItemIndex2 in this.editForm.F_Properties) {
          var ary = []
          if (this.editForm.F_Properties[FPItemIndex2].FP_ValueOne !== undefined) {
            ary.push(this.editForm.F_Properties[FPItemIndex2].FP_ValueOne)
          }
          if (this.editForm.F_Properties[FPItemIndex2].FP_ValueTwo !== undefined) {
            ary.push(this.editForm.F_Properties[FPItemIndex2].FP_ValueTwo)
          }
          if (this.editForm.F_Properties[FPItemIndex2].FP_ValueThree !== undefined) {
            ary.push(this.editForm.F_Properties[FPItemIndex2].FP_ValueThree)
          }
          if (this.editForm.F_Properties[FPItemIndex2].FP_ValueFour !== undefined) {
            ary.push(this.editForm.F_Properties[FPItemIndex2].FP_ValueFour)
          }
          if (this.editForm.F_Properties[FPItemIndex2].FP_ValueFive !== undefined) {
            ary.push(this.editForm.F_Properties[FPItemIndex2].FP_ValueFive)
          }
          var nary = ary.slice().sort()
          for (var i = 0; i < ary.length - 1; i++) {
            if (nary[i] !== '' && nary[i] === nary[i + 1]) {
              this.$message.error('属性项名不能重复')
              return
            }
          }
        }
        // 所属分类不需要操作
        // 替换图片imgUrl
        this.editForm.F_ImageUrl = this.imageUrl
        // 添加管理员账号
        this.editForm.mmngctUserName = window.sessionStorage.mmngctUserName
        // 正式的请求
        this.realAddFood()
      })
    },
    // 真正的数据请求
    async realAddFood () {
      const { data: res } = await this.$http.post('addFood', this.editForm)

      if (res.meta.status !== 200) {
        this.$message.error('添加商品失败')
        // 清空对话相关数据
        this.resetFood()
        return
      }
      // 修改成功，关闭对话框，刷数据列表
      this.$message.success('添加商品成功')
      this.resetFood()
    },
    // 获取商家商品分类列表
    async getCatesList () {
      const { data: res } = await this.$http.post('cates', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取分类数据失败!')
        return
      }
      this.catesList = res.data.cates
    },
    // 上传图片成功函数
    async handleAvatarSuccess (res, file) {
      if (res.meta.status !== 200) {
        this.imageUrl = ''
        this.$message.error('上传失败')
        return
      }
      this.imageUrl = res.data.imgUrl
      this.$message.success('上传成功')
    },
    // 限制图片类型，大小
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 去掉修改商品信息弹窗的不限量Tag
    removeBottomLess () {
      this.editForm.F_Stock = 0
    },
    // 删除修改信息弹窗规格Tag
    removeEditFormFSTag (item) {
      if (this.editForm.F_Specs.length > 1 && item.FS_Key === '标准') {
        this.$message.error('只能最后删除标准报价')
        return
      }
      if (this.editForm.F_Specs.length === 2) {
        this.editForm.F_Specs = []
        return
      }
      this.editForm.F_Specs.splice(this.editForm.F_Specs.indexOf(item), 1)
    },
    // 显示editDialog添加规格输入框
    showInput () {
      this.FSinputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用,就是当页面上元素被重新渲染之后,才会指定回调函数中的代码
      this.$nextTick(_ => {
        // 如果不再nextTick内部调用的话,会因为输入框还没来得及渲染,导致获取不到输入框
        this.$refs.saveeditDialogFSInput.$refs.input.focus()
      })
    },
    // editDialogInput失去焦点或回车时触发
    handleInputConfirm () {
      // 先判断输入是否合法，1，规格名不能为标准，第二，价格不能相同，且不能<0,不能>1000000
      var values = this.editFormF_Specs_Input_Value.split('/')
      if (values === undefined || values.length !== 2) {
        this.$message.error('请输入正确的格式')
        // input输入框消失
        this.FSinputVisible = false
        // 清空input值
        this.editFormF_Specs_Input_Value = ''
        return
      }
      // 规格名称不能是为空
      if (values[0].trim() === '') {
        this.$message.error('规格名不能为空')
        // input输入框消失
        this.FSinputVisible = false
        // 清空input值
        this.editFormF_Specs_Input_Value = ''
        return
      }
      if (values[0] === '标准' || values[0] === '原价') {
        this.$message.error('标准规格不必添加')
        // input输入框消失
        this.FSinputVisible = false
        // 清空input值
        this.editFormF_Specs_Input_Value = ''
        return
      }
      // 不能重名
      if (this.editForm.F_Specs !== undefined && this.editForm.F_Specs.length === 2) {
        if (this.editForm.F_Specs[1].FS_Key === values[0]) {
          this.$message.error('规格不能重名')
          // input输入框消失
          this.FSinputVisible = false
          // 清空input值
          this.editFormF_Specs_Input_Value = ''
          return
        }
      }
      // 判断价格是否是数字
      // var numReg = /^[0-9]*$/
      var numReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/
      var numRe = new RegExp(numReg)
      if (!numRe.test(values[1])) {
        this.$message.error('请输入正确的价格')
        this.FSinputVisible = false
        // 清空input值
        this.editFormF_Specs_Input_Value = ''
        return
      }
      if (values[1] >= 1000000) {
        this.$message.error('价格不能大于1000000')
        // input输入框消失
        this.FSinputVisible = false
        // 清空input值
        this.editFormF_Specs_Input_Value = ''
        return
      }
      // 先判断FS数组是否为空，如果为空，添加两个元素，如果不为空，添加一个元素
      if (this.editForm.F_Specs === undefined || this.editForm.F_Specs.length <= 0) {
        this.editForm.F_Specs.push({
          FS_Key: '标准',
          FS_Value: 0
        })
        this.editForm.F_Specs.push({
          FS_Key: values[0],
          FS_Value: parseFloat(this.$math.chain(this.$math.bignumber(Number(values[1]))).subtract(this.$math.bignumber(Number(this.editForm.F_Price))).done())// 浮点数计算  values[1] - this.editForm.F_Price
        })
      } else {
        this.editForm.F_Specs.push({
          FS_Key: values[0],
          FS_Value: parseFloat(this.$math.chain(this.$math.bignumber(Number(values[1]))).subtract(this.$math.bignumber(Number(this.editForm.F_Price))).done()) // 浮点数计算
        })
      }
      // input输入框消失
      this.FSinputVisible = false
      // 清空input值
      this.editFormF_Specs_Input_Value = ''
    },
    // editDialogFP属性类别删除
    handleEditDialogFPDelete (item) {
      this.editForm.F_Properties.splice(this.editForm.F_Properties.indexOf(item), 1)
    },
    // editDialogFPInput失去焦点或回车时触发
    handleProInputConfirm () {
      // this.editFormF_Properties_Input_Value = this.editFormF_Properties_Input_Value.toString()
      // 判断是否为空，如过不为空，就加一个属性数组进去，如果为空，就弹错误信息-不得为空
      if (this.editFormF_Properties_Input_Value.length === 0 || this.editFormF_Properties_Input_Value.split(' ').join('').length === 0) {
        this.$message.error('属性类别名称不能为空')
        // FPinput输入框消失
        this.FPinputVisible = false
        // 清空FPinput值
        this.editFormF_Properties_Input_Value = ''
        return
      }
      // 属性类别名不能超过五个字符
      if (this.editFormF_Properties_Input_Value.trim().length > 5) {
        this.$message.error('属性类别名称不能超过5个字符')
        // FPinput输入框消失
        this.FPinputVisible = false
        // 清空FPinput值
        this.editFormF_Properties_Input_Value = ''
        return
      }
      // 不能重名
      if (this.editForm.F_Properties !== undefined && this.editForm.F_Properties.length === 1) {
        if (this.editForm.F_Properties[0].FP_Name === this.editFormF_Properties_Input_Value.trim()) {//eslint-disable-line
          this.$message.error('属性类别名称不能重复')
          // FPinput输入框消失
          this.FPinputVisible = false
          // 清空FPinput值
          this.editFormF_Properties_Input_Value = ''
          return
        }
      }
      this.editForm.F_Properties.push({
        FP_Name: this.editFormF_Properties_Input_Value.trim()
      })
      // FPinput输入框消失
      this.FPinputVisible = false
      // 清空FPinput值
      this.editFormF_Properties_Input_Value = ''
    },
    // 显示editDialog添加属性类别输入框
    showProInput () {
      this.FPinputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用,就是当页面上元素被重新渲染之后,才会指定回调函数中的代码
      this.$nextTick(_ => {
        // 如果不再nextTick内部调用的话,会因为输入框还没来得及渲染,导致获取不到输入框
        this.$refs.saveditDialogFPInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.FS_Tag {
  display: inline-block;
  margin-right: 15px;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.editForm_F_Stock_Radio{
  margin: 0 auto;
  margin-left: 50px;
  margin-right: 50px;
}
.editForm_F_Stock_Bottom_Wrap {
  display: flex;
  align-items: center;
}
.editDialog {
  min-width: 1500px;
}

// 上传图片
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #000;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 58px;
  height: 58px;
  line-height: 58px;
  text-align: center;
}
/deep/ .avatar {
  width: 58px;
  height: 58px;
  display: block;
}
// 修改信息窗口，规格输入
.editDialogSpecsInput {
  display: inline-block;
  width: 200px;
}
// .editDialogFPItemDelete {
//   margin-left: 10px;
//   height: 25px;
//   width: 50px;
//   padding: 0 0 0 0;
// }
.editDialogFPDropdownMenuItem:hover {
  background-color: #ffffff;
}
.editDialogFPDropdownMenuItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
// 修改信息窗口，属性输入
.editDialogProInput {
  display: inline-block;
  width: 200px;
}
// 修改信息窗口，属性item输入
.editDialogFPItemInput {
  display: inline-block;
  width: 80px;
  padding-top: 5px;
  padding-bottom: 5px;
}
// 修改信息窗口，属性类别删除
.editDialogFPDelete:hover {
  color: #000;
}
.addFoodButton, .resetFoodButton {
  width: 150px;
}
</style>
