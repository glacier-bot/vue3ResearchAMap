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
const testNum = ref(0)
const selectTimestamp = ref('')

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
  testNum.value += 1
  ElNotification({
    title: '到达提示',
    message: '已到达 ' + str + ': ' + testNum.value + ' 附近',
    type: 'info',
    duration: 4500,
    appendTo: document.querySelector('.notification') as HTMLElement,
    zIndex: 1000
  })
}
const handleNotification = (payload: string) => {
  // console.log('notification:', payload)
  openNotification(payload)
}
const handleSelectTimestamp = (payload: string) => {
  selectTimestamp.value = payload
}

</script>

<template>
  <el-container class="outter-main">
    <el-aside width="150px">
      <Aside @on-value-changed="handleValueChanged" @on-draw-selected="handleDrawSelected"
        @on-notification="handleNotification" @on-select-timestamp="handleSelectTimestamp" />
    </el-aside>
    <el-container class="main">
      <el-main>
        <!-- <CollapseItem class="collapse" /> -->
        <div class="notification" />
        <AMap :new-lng="`${longtitute}`" :new-lat="`${latitute}`" :draw-status="`${drawStatus}`"
          :selectTime="`${selectTimestamp}`" />
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
  display: flex;
  padding: 0;
  margin: 0;
  background-color: aqua;
}

.collapse {
  position: absolute;
  z-index: 1;
}

.notification {
  display: flex;
  // justify-content: center;
  overflow: clip;
  height: 75vh;
  flex-direction: column;
  position: absolute;
  z-index: 1000;
  top: 0;
  right: 0;
  // width: 275px;
  // background-color: rgba(0, 0, 0, 1);
  margin-top: 7px;
  margin-right: 10px;
  // border-radius: 7px;
  // padding: 8px 0px 8px 0px; //上右下左
  // color: aliceblue;
}
</style>
