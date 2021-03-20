<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>店铺设置</el-breadcrumb-item>
      <el-breadcrumb-item>店铺信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 内容主体区 -->
      <!-- 双击修改，不再弹窗修改了！扁平化处理 -->
       <el-form :model="merInfoCopy" :rules="merInfoCopyRules" ref="merInfoCopyRef" label-width="200px">
        <el-form-item label="店铺名称" prop='m_Name'>
          <el-input placeholder="请输入店铺名称" @input="merInfoCopyChange"
            v-model="merInfoCopy.m_Name"
            @keyup.enter.native="$event.target.blur"
            @blur="merInfoInputBlur($event, merInfoCopy.m_Name, 'm_Name')">
          </el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop='m_Address'>
          <el-input placeholder="请输入店铺地址"
            @input="merInfoCopyChange"
            v-model="merInfoCopy.m_Address"
            @keyup.enter.native="$event.target.blur"
            @blur="merInfoInputBlur($event, merInfoCopy.m_Address, 'm_Address')"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop='m_Phone'>
          <el-input placeholder="请输入联系电话"
            @input="merInfoCopyChange"
            v-model="merInfoCopy.m_Phone"
            @keyup.enter.native="$event.target.blur"
            @blur="merInfoInputBlur($event, merInfoCopy.m_Phone, 'm_Phone')"></el-input>
        </el-form-item>
        <el-form-item label="餐厅原头像 (点击预览)" prop='m_img'>
          <el-image style="width: 30px; height: 30px"
            :src="merInfo.m_img"
            :preview-src-list="[merInfo.m_img]"
            @click.stop="handleClickItem">
          </el-image>
        </el-form-item>
        <el-form-item label="上传新图片">
          <el-upload
              class="avatar-uploader"
              action="https://www.donghuastar.com/OSM/uploadMerImg"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="uploadHeaders"
              :data="merInfo">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="营业时间" prop='m_beginTime'>
          <el-time-picker
            :clearable="false"
            :editable="false"
            v-model="merInfoCopy.m_BeginTime"
            placeholder="起始时间"
            value-format="HH:mm:ss"
            @change="merInfoCopyChange">
          </el-time-picker>
          至
          <el-time-picker
            :clearable="false"
            :editable="false"
            v-model="merInfoCopy.m_EndTime"
            placeholder="结束时间"
            value-format="HH:mm:ss"
            @change="merInfoCopyChange">
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="changeButtonStatus" @click="changeMerButtonClick">修 改</el-button>
          <el-button type="warning" :disabled="changeButtonStatus" @click="resetMerButtonClick">恢复上次设置</el-button>
        </el-form-item>
       </el-form>
    </el-card>

    <el-card class="merOperate_card">
      <div class="titleDiv">
            <span>餐厅管理</span>
          </div>
          <div class="dividerDiv"></div>
      <div>
      <div class="merOperate_label">餐厅营业状态：</div>
      <el-switch
        v-model="merInfo.m_IsInOpenTime"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value=1
        :inactive-value=0
        @change="changeMerOperateStatus">
      </el-switch>
      <div class="merOperate_info">{{merInfo.m_IsInOpenTime===1?'正常营业':'歇业休息'}}</div>
      </div>
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
      merInfo: {
        m_ID: '',
        m_Name: '',
        m_Address: '',
        m_Phone: '',
        m_BeginTime: '',
        m_EndTime: '',
        m_RegisterTime: '',
        m_img: '',
        m_IsInOpenTime: '',
        m_IsBan: ''
      },
      merInfoCopy: {},
      changeButtonStatus: true,
      imageUrl: '',
      uploadHeaders: { Authorization: window.sessionStorage.getItem('token') },
      merInfoCopyRules: {
        m_Name: [
          { required: true, message: '请输入店铺名称' },
          { min: 1, max: 10, message: '店铺名长度在3~10个字符之间' }
        ],
        m_Address: [
          { required: true, message: '请输入店铺地址' },
          { min: 1, max: 20, message: '店铺地址长度在3~10个字符之间' }
        ],
        m_Phone: [
          { required: true, message: '请输入联系电话' },
          { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' }
        ]
      }
    }
  },
  created () {
    this.getMerInfo()
  },
  methods: {
    // 修改餐厅营业状态
    async changeMerOperateStatus () {
      this.merInfo.mmngctUserName = window.sessionStorage.mmngctUserName
      const { data: res } = await this.$http.post('changeMerOperateStatus', this.merInfo)
      if (res.meta.status !== 200) {
        this.$message.error('修改餐厅营业状态失败')
        this.getMerInfo()
        return
      }
      // 修改成功
      this.$message.success('修改餐厅营业状态成功')
      this.getMerInfo()
    },
    // 点击修改按钮时，是否还需要trim呢？不需要，因为点击button时，是先触发blur，再触发click
    // 修改按钮
    async changeMerButtonClick () {
      this.$refs.merInfoCopyRef.validate(async valid => {
        // 验证验证规则
        if (!valid) {
          return
        }
        this.merInfoCopy.mmngctUserName = window.sessionStorage.mmngctUserName
        const { data: res } = await this.$http.post('changeMerInfo', this.merInfoCopy)
        if (res.meta.status !== 200) {
          this.$message.error('修改店铺信息失败')
          // 清空对话相关数据
          this.resetMerButtonClick()
          return
        }
        // 修改成功
        this.merInfo = res.data.merInfo
        this.$message.success('修改店铺信息成功')
        this.resetMerButtonClick()
      })
    },
    // 恢复店铺设置
    resetMerButtonClick () {
      this.merInfoCopy = JSON.parse(JSON.stringify(this.merInfo))
      this.imageUrl = ''
      this.merInfoCopyChange()
    },
    merInfoInputBlur ($event, merInfoItem, key) {
      // 这种方式赋值 否则就是再给merInfoItem中key属性赋值！！
      this.merInfoCopy[key] = merInfoItem.trim()
      this.merInfoCopyChange()
    },
    // 监听form change
    merInfoCopyChange () {
      if (this.$isEqual.isEqual(this.merInfo, this.merInfoCopy)) {
        this.changeButtonStatus = true
      } else {
        this.changeButtonStatus = false
      }
    },
    async getMerInfo () {
      const { data: res } = await this.$http.post('getMerInfo', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取店铺信息失败!')
        return
      }
      this.merInfo = res.data.merInfo
      this.merInfoCopy = JSON.parse(JSON.stringify(this.merInfo))
    },
    // 大图预览，点击遮幕关闭
    handleClickItem () {
      this.$nextTick(() => {
        // 获取遮罩层dom
        var domImageMask = document.querySelector('.el-image-viewer__mask')
        if (!domImageMask) {
          return
        }
        domImageMask.addEventListener('click', () => {
        // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector('.el-image-viewer__close').click()
        })
      })
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
    // 上传图片成功函数
    async handleAvatarSuccess (res, file) {
      if (res.meta.status !== 200) {
        this.imageUrl = ''
        this.$message.error('上传失败')
        return
      }
      this.imageUrl = res.data.imgUrl
      this.merInfoCopy.m_img = this.imageUrl
      this.$message.success('上传成功')
      this.merInfoCopyChange()
    }
  }
}
</script>

<style lang="less" scoped>
.merOperate_card {
  margin-top: 20px;
  .merOperate_label {
    display: inline-block;
    font-weight: bold;
    margin-right: 50px;
  }
  .merOperate_info {
    display: inline-block;
    font-size: 15px;
    font-weight: bold;
    margin-left: 10px;
  }
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
</style>
