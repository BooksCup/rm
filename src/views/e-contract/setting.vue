<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="temp" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar ' + 'draft'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          生成token
        </el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-form-item label-width="130px" label="appId:" class="postInfo-container-item">
          <el-input v-model="temp.appId" placeholder="请输入appId" style="width: 400px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="secret:" class="postInfo-container-item">
          <el-input v-model="temp.secret" placeholder="请输入secret" style="width: 400px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="grantType:" class="postInfo-container-item">
          <el-input v-model="temp.grantType" placeholder="请输入grantType" style="width: 400px; margin-left: 10px;" />
        </el-form-item>

        <el-form-item label-width="130px" label="token:" class="postInfo-container-item">
          <el-input v-model="temp.content" style="width: 400px; margin-left: 10px;" disabled="true" />
        </el-form-item>

        <el-form-item label-width="130px" label="有效期:" class="postInfo-container-item">
          <el-input v-model="temp.expiryTime" style="width: 400px; margin-left: 10px;" disabled="true" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { validURL } from '@/utils/validate'
  import { fetchToken, addToken } from '@/api/econtract'
  import { searchUser } from '@/api/remote-search'

  export default {
    name: 'EcontractSetting',
    components: { Sticky },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(new Error(rule.field + '为必传项'))
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(new Error('外链url填写不正确'))
          }
        } else {
          callback()
        }
      }
      return {
        temp: {
          appId: '',
          secret: '',
          grantType: '',
          content: '',
          expiresIn: 0,
          expiryTime: '',
          createTime: ''
        },
        loading: false,
        userListOptions: [],
        rules: {
          image_uri: [{ validator: validateRequire }],
          title: [{ validator: validateRequire }],
          content: [{ validator: validateRequire }],
          source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
        },
        tempRoute: {}
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      },
      displayTime: {
        // set and get is useful when the data
        // returned by the back end api is different from the front end
        // back end return => "2013-06-25 06:59:25"
        // front end need timestamp => 1372114765000
        get() {
          return (+new Date(this.postForm.display_time))
        },
        set(val) {
          this.postForm.display_time = new Date(val)
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        fetchToken().then(response => {
          this.temp = response.data
        }).catch(err => {
          console.log(err)
        })
      },
      setTagsViewTitle() {
        const title = 'Edit Article'
        const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
        this.$store.dispatch('tagsView/updateVisitedView', route)
      },
      setPageTitle() {
        const title = 'Edit Article'
        document.title = `${title} - ${this.postForm.id}`
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            addToken(this.temp).then(response => {
              const code = response.status
              this.temp = response.data
              console.log(response.status)
              console.log(response.data)
              if (code === 200) {
                this.$notify({
                  message: 'token生成成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  message: 'token生成失败',
                  type: 'error',
                  duration: 2000
                })
              }
            })
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm() {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
      },
      getRemoteUserList(query) {
        searchUser(query).then(response => {
          if (!response.data.items) return
          this.userListOptions = response.data.items.map(v => v.name)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
