<script setup lang="ts">
import { ref } from 'vue'
import { Setting, Edit, Guide, Switch } from '@element-plus/icons-vue'

let draw = false

const emit = defineEmits({
  'onDrawSelected': (payload: string) => payload,
  'onNotification': (payload: string) => payload,
  'onSelectTimestamp': (payload: string) => payload,
  'onManageSelected': (payload: string) => payload,
  'onWidthChange': (payload: string) => payload
})
const isCollapse = ref(true)
const handle2Click = () => {
  draw = !draw
  emit('onDrawSelected', draw ? 'edit' : 'noEdit')
  emit('onSelectTimestamp', new Date().valueOf().toString())
}
const handle4Click = () => {
  emit('onManageSelected', 'manage')
}
const handle9Click = () => {
  emit('onDrawSelected', 'settings')
  emit('onNotification', 'Setting')
}
// const handleSelect = (key: string) => {
//   // console.log('key:', key)
//   switch (key) {
//     case '1': {
//       break
//     }
//     case '2': {
//       emit('onDrawSelected', 'selectedDraw')
//       emit('onSelectTimestamp', new Date().valueOf().toString())
//       // console.log('Selected')
//       break
//     }
//     case '3': {
//       break
//     }
//     case '4': {
//       emit('onManageSelected', 'manage')
//       break
//     }
//     case '9': {
//       // console.log('Setting')
//       // alert('Setting')
//       emit('onDrawSelected', 'settings')
//       emit('onNotification', 'Setting')
//       break
//     }
//     case '10': {
//       // console.log('Switch')
//       emit('onDrawSelected', 'switch')
//       // alert('Switch')
//       break
//     }
//   }
// }

const handleHideShowClick = () => {
  isCollapse.value = !isCollapse.value
  if (!isCollapse.value) {
    emit('onWidthChange', '210px')
  } else {
    emit('onWidthChange', '64px')
  }
}

</script>

<template>
  <el-menu :collapse="isCollapse" :collapse-transition="false">
    <el-menu-item index="2" @click="handle2Click">
      <el-icon>
        <Edit />
      </el-icon>
      <template #title>创建覆盖物</template>
    </el-menu-item>
    <el-menu-item index="4" @click="handle4Click">
      <el-icon>
        <Guide />
      </el-icon>
      <template #title>覆盖物与到达提示管理</template>
    </el-menu-item>
    <el-menu-item index="9" @click="handle9Click">
      <el-icon>
        <Setting />
      </el-icon>
      <template #title>设置</template>
    </el-menu-item>
    <el-menu-item index="10">
      <el-icon @click="handleHideShowClick">
        <Switch />
      </el-icon>
      <template #title>
        <div @click="handleHideShowClick">展开/折叠菜单</div>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="less">
.el-menu {
  // width: 210px;
  height: 95vh;
}
</style>
