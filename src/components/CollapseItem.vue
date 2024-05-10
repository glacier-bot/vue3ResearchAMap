<script setup lang="ts">
import { ref } from 'vue'
const activeNames = ref<string[]>(['1'])
const handleChange = (val: string[]) => {
  console.log(val)
}
</script>

<template>
  <div class="collapse">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Title 1" name="1">
        <p>Content 1</p>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="less"></style>
