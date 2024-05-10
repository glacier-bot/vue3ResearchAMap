<script setup lang="ts">
import { ref } from 'vue';
// import AMap from '../components/AMap.vue'
import AMap from '../components/AMapReConstruct.vue'
import Aside from '../components/AsideItem.vue'
import { ElNotification } from 'element-plus'
// import CollapseItem from '@/components/CollapseItem.vue';

const latitute = ref(0)
const longtitute = ref(0)
const drawStatus = ref('')

const handleValueChanged = (payload: { latitute: number, longtitute: number }) => {
  // console.log('payload:', payload)
  latitute.value = payload.latitute
  longtitute.value = payload.longtitute
}
const handleDrawSelected = (payload: string) => {
  // console.log('select: ', payload)
  drawStatus.value = payload
}
const openNotification = (str: string) => {
  // bug：在app的底部出现
  ElNotification({
    title: 'Title',
    message: 'This is a notification message: ' + str,
    type: 'success',
    duration: 0
  })
}
const handleNotification = (payload: string) => {
  // console.log('notification:', payload)
  openNotification(payload)
}

</script>

<template>
  <el-container>
    <el-aside width="150px">
      <Aside @on-value-changed="handleValueChanged" @on-draw-selected="handleDrawSelected"
        @on-notification="handleNotification" />
    </el-aside>
    <el-container class="main">
      <el-main>
        <!-- <CollapseItem class="collapse" /> -->
        <AMap :new-lng="`${longtitute}`" :new-lat="`${latitute}`" :draw-status="`${drawStatus}`" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.el-aside {
  background-color: aliceblue;
}

.main {
  display: flex;
  background-color: antiquewhite;
}

.el-main {
  padding: 0;
  margin: 0;
  background-color: aqua;
}

.collapse {
  position: absolute;
  z-index: 1;
}
</style>
