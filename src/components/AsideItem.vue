<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Location, Setting, Edit } from '@element-plus/icons-vue'

const latitute = ref(0)
const longtitute = ref(0)
const value2 = ref(false)

const emit = defineEmits({
  'onValueChanged': (payload: { latitute: number, longtitute: number }) => true
})

watch([latitute, longtitute], (newVal, oldVal) => {
  console.log('latitute:', newVal[0], oldVal[0])
  console.log('longtitute:', newVal[1], oldVal[0])
  emit('onValueChanged', { latitute: newVal[0], longtitute: newVal[1] })
})

const handleSelect = (key: string) => {
  // console.log('key:', key)
  switch (key) {
    case '1':
      // console.log('Location')
      getGeoLocation()
      break
    case '9':
      // console.log('Setting')
      break
  }
}

const getGeoLocation = () => {
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
      定位
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
