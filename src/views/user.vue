<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 在这里无法直接获取到每一行的数据，这个数据在el-table组件中，如果要获取每一行数据，那么我们就需要通过作用域插槽将数据接收到 -->
        <template v-slot="{row}">
          <el-switch v-model="row.type" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      params: {
        pagenum: 1,
        pagesize: 5
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res => {
      // console.log(res);
      let {
        data: { data, meta }
      } = res;
      // this.tableData = res.data.data.users;
      this.tableData = data.users;
    });
  }
};
</script>