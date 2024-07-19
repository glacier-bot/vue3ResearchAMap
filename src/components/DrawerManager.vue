<script setup lang="ts">
import { reactive, watch } from 'vue'

interface OverlayData {
  orderNumber: number
  overlayNname: string
  overlayType: string
  overlayState: string
  overlayDistance: string
}

const props = defineProps(['modelValue', 'overlayData'])
const state = reactive({
  drawer: false
})
// const columnName = reactive(props.overlayData.map((item: any) => {
//   return { text: item.overlayNname, value: item.overlayNname }
// }))
// const columnType = reactive([...new Set(props.overlayData.map((item: any) => item.overlayType))].map(type => {
//   return { text: type, value: type }
// }))
let columnName = reactive<any[]>([])
let columnType = reactive<any[]>([])
let columnState = reactive<any[]>([])
watch(() => props.overlayData, (newVal) => {
  columnName = newVal.map((item: any) => {
    return { text: item.overlayNname, value: item.overlayNname }
  })
  columnType = [...new Set(newVal.map((item: any) => item.overlayType))].map(type => {
    return { text: type, value: type }
  })
  columnState = [...new Set(newVal.map((item: any) => item.overlayState))].map(state => {
    return { text: state, value: state }
  })
})
const filterType = (value: string, row: OverlayData) => {
  return row.overlayType === value
}
const filterName = (value: string, row: OverlayData) => {
  return row.overlayNname === value
}
const filterState = (value: string, row: OverlayData) => {
  return row.overlayState === value
}

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
          <el-table-column prop="overlayNname" label="名称" width="155" :filters="columnName"
            :filter-method="filterName" />
          <el-table-column prop="overlayType" label="类型" width="85" :filters="columnType" :filter-method="filterType" />
          <el-table-column prop="overlayState" label="到达状态" width="100" :filters="columnState"
            :filter-method="filterState" />
          <el-table-column prop="overlayDistance" label="距离" />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>