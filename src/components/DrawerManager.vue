<script setup lang="ts">
import { reactive, watch } from 'vue'
const props = defineProps(['modelValue', 'overlayData'])
const state = reactive({
  drawer: false
})
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    state.drawer = true
  }
})
</script>

<template>
  <div class="drawer">
    <el-drawer v-model="state.drawer" title="覆盖物与到达提示管理" size="55%">
      <!-- <el-text type="danger">这里放列表</el-text> -->
      <div class="table">
        <el-table :data="props.overlayData" height="80vh" border stripe show-overflow-tooltip>
          <!-- <el-table-column type="selection" width="45" /> -->
          <el-table-column prop="orderNumber" label="序号" width="55" />
          <!-- <el-table-column prop="overlayIcon" label="图标" width="55" /> -->
          <el-table-column prop="overlayNname" label="名称" width="155" />
          <el-table-column prop="overlayType" label="类型" width="55" />
          <el-table-column prop="overlayState" label="到达状态" width="85" />
          <el-table-column prop="overlayDistance" label="距离" />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>