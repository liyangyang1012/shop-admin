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
              <el-tag closable type="flex" @close="deleteRights(row, level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 2级菜单 -->
            <el-col>
              <el-row class="level2" type="flex" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRights(row, level2.id)"
                  >{{level2.authName}}</el-tag>
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
                    @close="deleteRights(row, level3.id)"
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
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="showAssainRightsDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限模态框 -->
    <el-dialog title="角色授权" :visible.sync="isAssainRightDialogShow">
      <!-- 
        data 是用来绑定数据的
        show-checkbox是用来设置是否要展示checkbox
        node-key指的是当前节点的唯一表示
        default-expanded-keys 这是一个数组，表示默认让哪些节点展开
        default-checked-keys 这是一个数组，表示默认选中哪些节点
        props: children是用来指定子级树的数据属性名，label以及节点要展示到文字的属性名
      -->
      <!-- default-expand-all 是否默认展开所有节点 -->

      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedRights"
        :props="defaultProps"
        :default-expand-all="true"
        ref="rightsTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAssainRightDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      isAssainRightDialogShow: false,
      rightList: [],
      checkedRights: [],
      // 这个是用来设置tree组件的 数据展示子节点以及展示的文字的
      defaultProps: {
        // 子集元素的属性名
        children: "children",
        // 当前节点展示的文字的属性名
        label: "authName"
      },
      // 用来存储要编辑的row,id
      currentEditRoleId: -1
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList(callback) {
      let res = await this.$http({
        url: "roles",
        method: "get"
      });
      this.rolesList = res.data.data;
      callback && callback();
    },
    async showAssainRightsDialog(row) {
      this.currentEditRoleId = row.id;

      this.isAssainRightDialogShow = true;
      let res = await this.$http({
        url: `rights/tree`
      });
      this.rightList = res.data.data;
      // 4需要让tree组件中默认选中当前角色拥有的权限信息
      // checkedRights: 我们需要把当前角色row中所有的权限的id，组合成一个数组，复制给checkedRights
      let level3Ids = [];
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      this.checkedRights = [...level3Ids];
    },
    async updateRoleRights() {
      // 1. 获取tree组件中，所有被勾选的ID
      let ids = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ].join(",");
      console.log(ids);
      // 2. 发送ajax请求
      let res = await this.$http({
        url: `roles/${this.currentEditRoleId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      });
      // 3. 提示用户更新成功
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });

      //4. 重新渲染权限列表
      this.getRoleList();

      // 5. 将id拼接成字符串之后，发送Ajax请求，修改角色权限
      this.isAssainRightDialogShow = false;
    },
    async deleteRights(row, id) {
      let res = await this.$http({
        url: `roles/${row.id}/rights/${id}`,
        method: "delete"
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.getRoleList(() => {
          this.$nextTick(() => {
            //让表格对应的项展开即可
            this.$refs.roleTable.toggleRowExpansion(
              this.roleList.find(v => v.id == row.id),
              true
            );
          });
        });
      }
    }
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

