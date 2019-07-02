<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        @keyup.enter.native="searchUser"
        v-model="keyWord"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
      </el-input>
    </div>
    <el-row class="add-user">
      <el-button type="success" plain @click="openAddUserDialog">添加用户</el-button>
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 在这里无法直接获取到每一行的数据，这个数据在el-table组件中，如果要获取每一行数据，那么我们就需要通过作用域插槽将数据接收到 -->
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit"
            @click="openEditUserDialog(row.id)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delUser(row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="onPageChange"
    ></el-pagination>

    <!-- 添加用户的模态框 -->
    <!-- title就是模态框的标题 -->
    <!-- visible用来控制模态框的显示和隐藏 -->
    <el-dialog title="添加用户" :visible.sync="isAddUserDialogShow">
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="addUserFormData"
        :rules="addUserDialog"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserFormData.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息的模态框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="isEditUserDialogShow"
      @close="$refs.editUserForm.resetFields()"
    >
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="editUserFormData"
        :rules="editUserDialog"
        ref="editUserForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editUserFormData.username"></el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditUserDialogShow=false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 3,
      currentPage: 1,
      keyWord: "",
      isAddUserDialogShow: false,
      labelPosition: "right",
      isEditUserDialogShow: false,

      addUserFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserDialog: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "电话号码格式不正确",
            trigger: "change"
          }
        ]
      },
      editUserFormData: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      editUserDialog: {
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "电话号码格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 请求用户数据
    getUserList() {
      axios({
        url: "http://localhost:8888/api/private/v1/users",
        params: {
          query: this.keyWord,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        let {
          data: { data, meta }
        } = res;
        this.tableData = data.users;
        this.total = data.total;
      });
    },
    // 点击分页重新请求用户数据
    onPageChange(page) {
      // 修改currentPage
      this.currentPage = page;
      // 重新请求数据
      this.getUserList();
    },
    searchUser() {
      this.currentPage = 1;
      this.getUserList();
    },
    async toggleState(user) {
      console.log(user);
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      // console.log(res);
      if (res.data.meta.status == 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });
      }
    },
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        console.log(id);
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          method: "delete",
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        console.log(res);
        // 重新渲染当前的列表数据
        if (res.data.meta.status == 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.currentPage = 1;
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    openAddUserDialog() {
      // 打开添加用户的模态框
      this.isAddUserDialogShow = true;
    },
    async addUser() {
      try {
        // console.log(this.addUserFormData);
        let res = await axios({
          url: "http://localhost:8888/api/private/v1/users",
          method: "post",
          data: this.addUserFormData,
          headers: {
            Authorization: localStorage.getItem("token")
          }
          // console.log(res);
        });
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.getUserList();
          this.isAddUserDialogShow = false;
        }
        console.log(res);
      } catch (err) {
        console.log("校验失败");
      }
    },
    async openEditUserDialog(id) {
      // 打开模态框
      this.isEditUserDialogShow = true;
      // 使用id去后台获取数据，展示到模态框中
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "get",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      this.editUserFormData = res.data.data;
    },
    async editUser() {
      try {
        console.log(11);
        await this.$refs.editUserForm.validate();
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${this.editUserFormData.id}`,
          method: "put",
          data: {
            email: this.editUserFormData.email,
            mobile: this.editUserFormData.mobile
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.isEditUserDialogShow = false;
          this.getUserList();
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      } catch {}
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb.breadcrumb {
  background-color: #d4dae0;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  padding-left: 10px;
}
.search {
  margin-top: 15px;
  display: inline-block;
}
.add-user {
  display: inline-block;
  margin-left: 20px;
}
</style>
