<script setup lang="ts">
import { ArrowUpBold, ArrowDownBold, ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
defineEmits({
  'onArrowUp': () => true,
  'onArrowDown': () => true,
  'onArrowLeft': () => true,
  'onArrowRight': () => true
})
</script>

<template>
  <div style="display: none">两行三列布局，上下左右四个箭头，点击可以模拟移动定位点</div>
  <el-row>
    <el-col :span="8">
      <!-- <el-button type="success" circle /> -->
    </el-col>
    <el-col :span="8">
      <el-button type="primary" :icon="ArrowUpBold" circle @click="$emit('onArrowUp')" />
    </el-col>
    <el-col :span="8">
      <!-- <el-button type="success" circle /> -->
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="8">
      <el-button type="primary" :icon="ArrowLeftBold" circle @click="$emit('onArrowLeft')" />
    </el-col>
    <el-col :span="8">
      <el-button type="primary" :icon="ArrowDownBold" circle @click="$emit('onArrowDown')" />
    </el-col>
    <el-col :span="8">
      <el-button type="primary" :icon="ArrowRightBold" circle @click="$emit('onArrowRight')" />
    </el-col>
  </el-row>
</template>

<style scoped lang="less"></style>
