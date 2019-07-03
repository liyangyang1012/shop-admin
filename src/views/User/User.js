export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 3,
      currentPage: 1,
      keyWord: '',
      isAddUserDialogShow: false,
      labelPosition: 'right',
      isEditUserDialogShow: false,

      addUserFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserDialog: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'change'
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '电话号码格式不正确',
            trigger: 'change'
          }
        ]
      },
      editUserFormData: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      editUserDialog: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '电话号码格式不正确',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 请求用户数据
    getUserList() {
      this.$http({
        url: 'users',
        params: {
          query: this.keyWord,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(res => {
        let {
          data: { data, meta }
        } = res
        this.tableData = data.users
        this.total = data.total
      })
    },
    // 点击分页重新请求用户数据
    onPageChange(page) {
      // 修改currentPage
      this.currentPage = page
      // 重新请求数据
      this.getUserList()
    },
    searchUser() {
      this.currentPage = 1
      this.getUserList()
    },
    async toggleState(user) {
      console.log(user)
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
      })
      // console.log(res);
      if (res.data.meta.status == 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
      } else {
        this.$message({
          type: 'error',
          message: res.data.meta.msg,
          duration: 1000
        })
      }
    },
    async delUser(id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log(id)
        let res = await this.$http({
          url: `users/${id}`,
          method: 'delete'
        })
        console.log(res)
        // 重新渲染当前的列表数据
        if (res.data.meta.status == 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          this.currentPage = 1
          this.getUserList()
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    openAddUserDialog() {
      // 打开添加用户的模态框
      this.isAddUserDialogShow = true
    },
    async addUser() {
      try {
        // console.log(this.addUserFormData);
        let res = await this.$http({
          url: 'users',
          method: 'post',
          data: this.addUserFormData
        })
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          })
          this.getUserList()
          this.isAddUserDialogShow = false
        }
        console.log(res)
      } catch (err) {
        console.log('校验失败')
      }
    },
    async openEditUserDialog(id) {
      // 打开模态框
      this.isEditUserDialogShow = true
      // 使用id去后台获取数据，展示到模态框中
      let res = await this.$http({
        url: `users/${id}`,
        method: 'get'
      })
      this.editUserFormData = res.data.data
    },
    async editUser() {
      try {
        console.log(11)
        await this.$refs.editUserForm.validate()
        let res = await this.$http({
          url: `users/${this.editUserFormData.id}`,
          method: 'put',
          data: {
            email: this.editUserFormData.email,
            mobile: this.editUserFormData.mobile
          }
        })
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          this.isEditUserDialogShow = false
          this.getUserList()
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 1000
          })
        }
      } catch {}
    }
  }
}
