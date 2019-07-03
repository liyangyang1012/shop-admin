<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 角色列表 -->
    <!-- expand-change当用户对展开行进行打开或者关闭时会触发的事件 -->
    <!-- @expand-change="getRoleRights"接口不支持  无法实现 -->
    <el-table :data="rolesList" stripe style="width: 100%">
      <!-- type="expand" 给列加上这个属性之后，可以实现 展开行的效果 -->
      <el-table-column type="expand" width="50">
        <template v-slot="{row}">
          <!-- <div v-for="item in row.children" :key="item.id">{{item.authName}}</div> -->
          <!-- 1级菜单 -->
          <el-row
            class="first-menu level1"
            type="flex"
            v-for="level1 in row.children"
            :key="level1.id"
          >
            <el-col :span="6">
              <el-tag closable type="flex">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 2级菜单 -->
            <el-col>
              <el-row class="level2" type="flex" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag closable type="success">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级菜单 -->
                <el-col class="level3">
                  <el-tag
                    class="level3"
                    closable
                    type="warning"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      let res = await this.$http({
        url: "roles",
        method: "get"
      });
      this.rolesList = res.data.data;
    }
    // getRoleRights(row, expandedRows) {
    //   // row就是当前行的数据
    //   // console.log(row);
    //   if (expandedRows.length) {
    //     console.log("打开");
    //   } else {
    //     console.log("关闭");
    //   }
    // }
    // 接口不支持  无法实现
  }
};
</script>


<style lang="less" scoped >
.el-breadcrumb.breadcrumb {
  background-color: #d4dae0;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  padding-left: 10px;
}
.first-menu {
  padding: 10px 0;
}
.level1 {
  border-bottom: 1px dashed #ccc;
}
.level1:last-child {
  border: none;
}
.level2 {
  padding-bottom: 10px;
}
.level3 {
  margin: 0 10px 10px 0;
}
</style>

