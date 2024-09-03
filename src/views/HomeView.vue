<script setup lang="ts">
import { ref } from 'vue';
// import AMap from '../components/AMap.vue'
import AMap from '../components/AMapReConstruct.vue'
import Aside from '../components/AsideItem.vue'
import DrawerManager from '../components/DrawerManager.vue'
import { ElNotification } from 'element-plus'
import { Location, SemiSelect, CircleCheck, Compass } from '@element-plus/icons-vue'
// import CollapseItem from '@/components/CollapseItem.vue';

const drawStatus = ref('')
// const testNum = ref(0)
const selectTimestamp = ref('')
const manageSelect = ref('')
const overlayData = ref<any[]>([])
const menuWidth = ref('64px')

const handleDrawSelected = (payload: string) => {
  // console.log('select: ', payload)
  drawStatus.value = payload
}
const openNotification = (str: any) => {
  // testNum.value += 1
  let triggerStr = ''
  let triggerIcon: any
  switch (str.triggerType) {
    case 'point': {
      triggerStr = '已到达 ' + str.triggerName + ' 点位附近，<br/>距离：' + str.triggerDistance + ' 米'
      triggerIcon = Location
      break
    }
    case 'polyline': {
      triggerStr = '已到达 ' + str.triggerName + ' 路线附近，<br/>距离：' + str.triggerDistance + ' 米'
      triggerIcon = SemiSelect
      break
    }
    case 'circle': {
      triggerStr = '已位于 ' + str.triggerName + ' 圆形范围内，<br/>半径：' + str.triggerRadius + ' 米，距离圆心：' + str.triggerDistance + ' 米'
      triggerIcon = CircleCheck
      break
    }
    default: {
      triggerStr = '已位于 ' + str.triggerName + ' 区域内'
      triggerIcon = Compass
      break
    }
  }
  ElNotification({
    title: '到达提示',
    // message: '已到达 ' + str + ': ' + testNum.value + ' 附近',
    message: triggerStr,
    // type: 'info',
    icon: triggerIcon,
    duration: 4500,
    appendTo: document.querySelector('.notification') as HTMLElement,
    zIndex: 1000,
    dangerouslyUseHTMLString: true
  })
}
const handleNotification = (payload: string) => {
  // console.log('notification:', payload)
  openNotification(payload)
}
const handleSelectTimestamp = (payload: string) => {
  selectTimestamp.value = payload
}
const handleDistanceTrigger = (payload: string) => {
  openNotification(payload)
}
const handleManageSelect = () => {
  // console.log('manage:', payload)
  manageSelect.value = new Date().valueOf().toString()
}
const handleOverlayDataEmit = (payload: any) => {
  console.log('Emit payload:', payload)
  let num = 0
  const arr = payload.map((item: any) => {
    num++
    switch (item.overlayType) {
      case 'AMap.Marker': {
        return {
          orderNumber: num,
          overlayIcon: 'Point',
          overlayType: '点位',
          overlayState: item.state,
          overlayDistance: item.distance,
          overlayNname: item.name
        }
      }
      case 'Overlay.Polyline': {
        return {
          orderNumber: num,
          overlayIcon: 'Polyline',
          overlayType: '路线',
          overlayState: item.state,
          overlayDistance: item.distance,
          overlayNname: item.name
        }
      }
      case 'Overlay.Circle': {
        return {
          orderNumber: num,
          overlayIcon: 'Circle',
          overlayType: '圆形范围',
          overlayState: item.state,
          overlayDistance: item.distance,
          overlayNname: item.name
        }
      }
      default: {
        return {
          orderNumber: num,
          overlayIcon: 'Polygon',
          overlayType: '多边形',
          overlayState: item.state,
          overlayDistance: item.distance,
          overlayNname: item.name
        }
      }
    }
  })
  overlayData.value = arr
}
const handleWidthChange = (payload: string) => {
  menuWidth.value = payload
}
</script>

<template>
  <el-container class="outter-main" style="height:100vh;">
    <el-aside :width="menuWidth">
      <Aside style="height:100%;" @on-draw-selected="handleDrawSelected" @on-notification="handleNotification"
        @on-select-timestamp="handleSelectTimestamp" @on-manage-selected="handleManageSelect"
        @on-width-change="handleWidthChange" />
    </el-aside>
    <el-container class="main">
      <el-main>
        <!-- <CollapseItem class="collapse" /> -->
        <DrawerManager :model-value="manageSelect" :overlay-data="overlayData" />
        <div class="notification" />
        <AMap :draw-status="`${drawStatus}`" :selectTime="`${selectTimestamp}`"
          @on-distance-trigger="handleDistanceTrigger" @on-overlay-data-emit="handleOverlayDataEmit" />
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
