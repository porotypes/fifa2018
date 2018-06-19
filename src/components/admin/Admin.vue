<template>
  <div class="admin">
    <el-container>
      <el-aside width="240px">
        <el-menu default-active="1">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">球队信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Admin'
}
</script>

<style>
html, body {
  height: 100%;
}
.admin {
  min-height: 400px;
}
</style>
