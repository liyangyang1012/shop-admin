<template>
  <el-row type="flex" justify="center" align="middle" class="row-bg">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form
        :model="form"
        ref="loginForm"
        label-position="top"
        label-width="80px"
        class="login-from"
        :rules="ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      ruleForm: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名必须 5 到 12 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 5,
            max: 16,
            message: "密码必须 6 到 16 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: "login",
            method: "post",
            data: this.form
          }).then(({ data: { data, meta } }) => {
            // console.log(res);
            // console.log(data, meta);
            // console.log(data);
            // console.log(res);
            if (meta.status == 200) {
              // console.log(meta.msg);

              localStorage.setItem("token", data.token);
              this.$router.push("/home");
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.login-from {
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 10px;
  min-width: 400px;
}
</style>
<style>
</style>
