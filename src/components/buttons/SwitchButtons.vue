<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(false) //控制标记点开关
const value2 = ref(false) //控制折线开关
const value3 = ref(false) //控制多边形开关
const value4 = ref(false) //控制矩形开关
const value5 = ref(false) //控制圆形开关
const arrSwitch = [value1, value2, value3, value4, value5]

const emit = defineEmits({
  'onSwitchChanged': (payload: { name: string, status: boolean }) => payload,
  'onClearClick': (payload: boolean) => payload
})

const exclusiveTrue = (id: number) => {
  arrSwitch.map((value, index) => {
    if (index !== id - 1) {
      value.value = false
    }
  })
}
const handleSwitchChange = (id: number) => (e: boolean) => {
  emit('onSwitchChanged', { name: `value${id}`, status: e })
  if (e) {
    exclusiveTrue(id)
  }
}
const handleMarkerChange = handleSwitchChange(1)
const handlePolylineChange = handleSwitchChange(2)
const handlePolygonChange = handleSwitchChange(3)
const handleRectangleChange = handleSwitchChange(4)
const handleCircleChange = handleSwitchChange(5)
const handleClick = () => {
  emit('onClearClick', true)
}
</script>

<template>
  <el-row class="switch-table1" justify="space-evenly" :gutter="16">
    <el-col :span="12">
      <el-switch v-model="value1" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="开始绘制标记点" inactive-text="结束绘制标记点" @change="handleMarkerChange" />
    </el-col>
    <el-col :span="12">
      <el-switch v-model="value2" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="开始绘制折线" inactive-text="结束绘制折线" @change="handlePolylineChange" />
    </el-col>
  </el-row>
  <el-row class="switch-table2" justify="space-evenly" :gutter="16">
    <el-col :span="12">
      <el-switch v-model="value3" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="开始绘制多边形" inactive-text="结束绘制多边形" @change="handlePolygonChange" />
    </el-col>
    <el-col :span="12">
      <el-switch v-model="value4" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="开始绘制矩形" inactive-text="结束绘制矩形" @change="handleRectangleChange" />
    </el-col>
  </el-row>
  <el-row class="switch-table3" :gutter="16">
    <el-col :span=11>
      <el-switch v-model="value5" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="开始绘制圆" inactive-text="结束绘制圆" @change="handleCircleChange" />
    </el-col>
    <el-col :span="12">
      <el-button text @click.left="handleClick">清空覆盖物</el-button>
    </el-col>
  </el-row>
  <el-row class="switch-text" :gutter="16">
    <el-col>
      <el-text size="small" type="info">
        提示：请在结束绘制后编辑覆盖物，否则<br />
        会出现覆盖物无法编辑的bug；<br />
        修改圆形覆盖物的填充颜色和填充透明度<br />
        会出现bug；<br />
        显示和隐藏标签的右键菜单有时会消失；<br />
        再次打开右键菜单即可显示
      </el-text>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.switch-table1,
.switch-table2,
.switch-table3,
.switch-text {
  background-color: white;
}

.switch-table1 {
  padding-top: 5px;
  border-radius: 6px 6px 0 0;
}

.switch-text {
  padding-bottom: 5px;
  border-radius: 0 0 6px 6px;
}
</style>
