<script setup lang="ts">
import { Setting, Edit, Guide } from '@element-plus/icons-vue'

const emit = defineEmits({
  'onDrawSelected': (payload: string) => payload,
  'onNotification': (payload: string) => payload,
  'onSelectTimestamp': (payload: string) => payload,
  'onManageSelected': (payload: string) => payload
})

const handleSelect = (key: string) => {
  // console.log('key:', key)
  switch (key) {
    case '1': {
      break
    }
    case '2': {
      emit('onDrawSelected', 'selected')
      emit('onSelectTimestamp', new Date().valueOf().toString())
      // console.log('Selected')
      break
    }
    case '3': {
      break
    }
    case '4': {
      emit('onManageSelected', 'manage')
      break
    }
    case '9': {
      // console.log('Setting')
      // alert('Setting')
      emit('onDrawSelected', 'settings')
      emit('onNotification', 'Setting')
      break
    }
  }
}

</script>

<template>
  <el-menu :collapse="true" @select="handleSelect">
    <el-menu-item index="2">
      <el-icon>
        <Edit />
      </el-icon>
      创建覆盖物
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <Guide />
      </el-icon>
      覆盖物与到达提示管理
    </el-menu-item>
    <el-menu-item index="9">
      <el-icon>
        <Setting />
      </el-icon>
      设置
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="less">
.el-menu {
  width: 210px;
}
</style>
