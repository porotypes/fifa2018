<template>
  <div class="team">
    <div class="button">
      <el-button type="primary" @click="toLink('editTeam')">添加球队</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Team',
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    toLink (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style>
.team .button {
  margin: 1rem 0;
  text-align: left;
}
</style>
