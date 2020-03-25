<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="请输入关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" width="160px" label="机构名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="第三方账号">
        <template slot-scope="scope">
          <span>{{ scope.row.thirdPartyUserId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="证件类型">
        <template slot-scope="scope">
          <span>{{ scope.row.idType | idTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="证件号">
        <template slot-scope="scope">
          <span>{{ scope.row.idNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="企业法人名称">
        <template slot-scope="scope">
          <span>{{ scope.row.orgLegalName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="企业法人证件号">
        <template slot-scope="scope">
          <span>{{ scope.row.orgLegalIdNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="操作">
        <template slot-scope="{row, $index}">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="handleUpdate(row, $index)" />
          <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(row, $index)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="createFormVisible">
      <el-form
        ref="dataForm"
        :rules="createAccountRules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="机构名称:" prop="name">
          <el-input v-model="temp.name" placeholder="机构名称(必填)" />
        </el-form-item>
        <el-form-item label="创建者:" class="postInfo-container-item">
          <el-select v-model="temp.creator" :remote-method="getRemoteUserList" filterable
                     default-first-option remote
                     placeholder="查找用户"
          >
            <el-option v-for="item in userListOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="第三方账号:" prop="thirdPartyUserId">
          <el-input v-model="temp.thirdPartyUserId" placeholder="第三方账号(必填)" />
        </el-form-item>
        <el-form-item label="证件类型:" prop="idType">
          <el-select v-model="temp.idType" class="filter-item">
            <el-option v-for="item in idTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号:" prop="idNumber">
          <el-input v-model="temp.idNumber" placeholder="证件号(必填)" />
        </el-form-item>
        <el-form-item label="企业法人名称:" prop="orgLegalName">
          <el-input v-model="temp.orgLegalName" placeholder="企业法人名称(必填)" />
        </el-form-item>
        <el-form-item label="企业法人证件号:" prop="orgLegalIdNumber">
          <el-input v-model="temp.orgLegalIdNumber" placeholder="企业法人证件号(必填)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createOrg()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="updateFormVisible">
      <el-form
        ref="updateForm"
        :rules="createAccountRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="第三方账号" prop="thirdPartyUserId">
          <el-input v-model="temp.thirdPartyUserId" />
        </el-form-item>
        <el-form-item label="证件类型" prop="idType">
          <el-select v-model="temp.idType" class="filter-item" :disabled="true">
            <el-option v-for="item in idTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号:" prop="idNumber">
          <el-input v-model="temp.idNumber" :disabled="true" />
        </el-form-item>
        <el-form-item label="企业法人名称:" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="企业法人证件号:" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateAccount()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { searchAccount, createOrg, fetchOrg, deleteAccount, updateAccount } from '../../api/econtract'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const idTypeOptions = [
    { value: 'CRED_ORG_USCC', label: '统一社会信用代码' },
    { value: 'CRED_ORG_CODE', label: '组织机构代码证' },
    { value: 'CRED_ORG_REGCODE', label: '工商注册号' },
    { value: 'CRED_ORG_BUSINESS_REGISTTATION_CODE', label: '工商登记证' },
    { value: 'CRED_ORG_TAX_REGISTTATION_CODE', label: '税务登记证' },
    { value: 'CRED_ORG_LEGAL_PERSON_CODE', label: '法人代码证' },
    { value: 'CRED_ORG_ENT_LEGAL_PERSON_CODE', label: '事业单位法人证书' },
    { value: 'CRED_ORG_SOCIAL_REG_CODE', label: '社会团体登记证书' },
    { value: 'CRED_ORG_PRIVATE_NON_ENT_REG_CODE', label: '民办非机构登记证书' },
    { value: 'CRED_ORG_FOREIGN_ENT_REG_CODE', label: '外国机构常驻代表机构登记证' },
    { value: 'CRED_ORG_GOV_APPROVAL', label: '政府批文' },
    { value: 'CODE_ORG_CUSTOM', label: '自定义' },
    { value: 'CRED_ORG_UNKNOWN', label: '未知证件类型' }
  ]

  const idTypeKeyValue = idTypeOptions.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'EcontractAccount',
    components: { Pagination },
    directives: { waves },
    filters: {
      idTypeFilter(type) {
        return idTypeKeyValue[type]
      }
    },
    data() {
      const validateName = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('姓名不能为空'))
        } else {
          callback()
        }
      }
      const validateThirdPartyUserId = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('第三方账号不能为空'))
        } else {
          callback()
        }
      }
      const validateIdNumber = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('证件号不能为空'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('手机不能为空'))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('邮箱不能为空'))
        } else {
          callback()
        }
      }
      return {
        userListOptions: [],
        idTypeOptions,
        createAccountRules: {
          name: [{ required: true, trigger: 'blur', validator: validateName }],
          thirdPartyUserId: [{ required: true, trigger: 'blur', validator: validateThirdPartyUserId }],
          idNumber: [{ required: true, trigger: 'blur', validator: validateIdNumber }],
          mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
          email: [{ required: true, trigger: 'blur', validator: validateEmail }]
        },
        tableKey: 0,
        pvData: [],
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        createFormVisible: false,
        updateFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑个人账号',
          create: '添加个人账号'
        },
        temp: {
          id: '',
          name: '',
          thirdPartyUserId: '',
          idType: 'CRED_ORG_USCC',
          idNumber: '',
          mobile: '',
          email: '',
          createTime: ''
        },
        accountId: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getRemoteUserList(query) {
        searchAccount({ keyword: query }).then(response => {
          if (!response.data) {
            return
          } else {
            this.userListOptions = response.data
          }
        })
      },
      getList() {
        this.listLoading = true
        fetchOrg(this.listQuery).then(response => {
          const res = response.data
          this.list = res.list
          this.total = res.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          creator: '',
          thirdPartyUserId: '',
          idType: 'CRED_ORG_USCC',
          idNumber: '',
          orgLegalName: '',
          orgLegalIdNumber: '',
          createTime: ''
        }
      },
      initTemp(row) {
        this.temp = {
          id: row.id,
          name: row.name,
          thirdPartyUserId: row.thirdPartyUserId,
          idType: row.idType,
          idNumber: row.idNumber,
          mobile: row.mobile,
          email: row.email,
          createTime: row.createTime
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.createFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row, index) {
        this.initTemp(row)
        this.dialogStatus = 'update'
        this.updateFormVisible = true
      },
      handleDelete(row, index) {
        this.$confirm('删除操作无法恢复，请谨慎删除。', '是否删除"' + row.name + '"?', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error'
        })
          .then(async() => {
            this.accountId = row.id
            deleteAccount(row.id).then(response => {
              console.log(response)
              const code = response.status
              if (code === 200) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: 2000
                })
                this.list.splice(index, 1)
              } else {
                this.$notify({
                  message: '删除失败',
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(error => {
              this.$notify({
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            })
          })
      },
      createOrg() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createOrg(this.temp).then(response => {
              this.createFormVisible = false
              const code = response.status
              if (code === 200) {
                this.list.unshift(response.data)
                this.$notify({
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  message: '创建失败',
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(error => {
              const errorMsg = error.response.data.apiResultMessage
              this.$notify({
                message: '创建失败:' + errorMsg,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      updateAccount() {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            updateAccount(this.temp).then(response => {
              this.updateFormVisible = false
              const code = response.status
              if (code === 200) {
                this.$notify({
                  message: '编辑成功',
                  type: 'success',
                  duration: 2000
                })
                const index = this.list.findIndex(v => v.id === this.temp.id)
                this.list.splice(index, 1, this.temp)
              } else {
                this.$notify({
                  message: '编辑失败',
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(error => {
              const errorMsg = error.response.data.apiResultMessage
              this.$notify({
                message: '编辑失败:' + errorMsg,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>
