<script setup lang="ts">
import { ref, watch } from 'vue'
import { Location, Setting, Edit } from '@element-plus/icons-vue'

const latitute = ref(0)
const longtitute = ref(0)
const flag = ref(false)
// let intervalId: number

const emit = defineEmits({
  'onValueChanged': (payload: { latitute: number, longtitute: number }) => payload,
  'onDrawSelected': (payload: string) => payload,
  'onNotification': (payload: string) => payload
})

watch([latitute, longtitute], (newVal, oldVal) => {
  console.log('latitute:', newVal[0], oldVal[0])
  console.log('longtitute:', newVal[1], oldVal[1])
  emit('onValueChanged', { latitute: newVal[0], longtitute: newVal[1] })
})

const handleSelect = (key: string) => {
  // console.log('key:', key)
  switch (key) {
    case '1':
      // console.log('Location')
      getGeoLocationOnce()
      emit('onDrawSelected', 'location')
      break
    case '2':
      emit('onDrawSelected', 'selected')
      break
    case '3':
      flag.value=!flag.value
      if (flag.value) {
        console.log('Start updating location')
        getGeoLocation()
        // intervalId=setInterval(() => {
        //   console.log('Updating location...')
        //   getGeoLocation()
        // }, 1000)
      }else{
        console.log('Stop updating location')
        // clearInterval(intervalId)
        navigator.geolocation.clearWatch((window as any).myParams.watchID)
      }
      break
    case '9':
      // console.log('Setting')
      // alert('Setting')
      emit('onDrawSelected', 'settings')
      emit('onNotification', 'Setting')
      break
  }
}

//getCurrentPosition改为watchPosition
const getGeoLocation = () => {
  if (navigator.geolocation) {
    const watchID = navigator.geolocation.watchPosition((position) => {
      console.log('watching location...')
      // console.log('Latitude:', position.coords.latitude)
      latitute.value = parseFloat(position.coords.latitude.toFixed(2))
      // console.log('Longitude:', position.coords.longitude)
      longtitute.value = parseFloat(position.coords.longitude.toFixed(2))
    });
    (window as any).myParams = {watchID: watchID}
  } else {
    console.log('Geolocation is not supported by this browser.')
  }
}

const getGeoLocationOnce = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log('Latitude:', position.coords.latitude)
      latitute.value = parseFloat(position.coords.latitude.toFixed(2))
      // console.log('Longitude:', position.coords.longitude)
      longtitute.value = parseFloat(position.coords.longitude.toFixed(2))
    })
  } else {
    console.log('Geolocation is not supported by this browser.')
  }
}
</script>

<template>
  <el-menu :collapse="true" @select="handleSelect">
    <el-menu-item index="1">
      <el-icon>
        <Location />
      </el-icon>
      校准定位
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon>
        <Location />
      </el-icon>
      持续更新定位
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon>
        <Edit />
      </el-icon>
      创建覆盖物
    </el-menu-item>
    <el-menu-item index="9">
      <el-icon>
        <Setting />
      </el-icon>
      设置
    </el-menu-item>
  </el-menu>
  <div id="location" v-show="false">
    {{ latitute }},
    {{ longtitute }}
  </div>
</template>

<style scoped lang="less">
.el-menu {
  width: 150px;
}
</style>
