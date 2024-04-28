<script setup lang="ts">
import { provide, ref } from 'vue';
import AMap from '../components/AMap.vue'
import Aside from '../components/AsideItem.vue'

const latitute = ref(39.90923)
const longtitute = ref(116.397428)

const handleValueChanged = (payload: { latitute: number, longtitute: number }) => {
  // console.log('payload:', payload)
  latitute.value = payload.latitute
  longtitute.value = payload.longtitute
}

provide('location', [latitute, longtitute])

</script>

<template>
  <el-container>
    <el-aside width="64px">
      <Aside @on-value-changed="handleValueChanged" />
    </el-aside>
    <el-container>
      <el-main>
        <AMap />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.el-aside {
  background-color: aliceblue;
}

.el-container {
  display: flex;
  background-color: antiquewhite;
}

.el-main {
  padding: 0;
  margin: 0;
  background-color: aqua;
}
</style>
