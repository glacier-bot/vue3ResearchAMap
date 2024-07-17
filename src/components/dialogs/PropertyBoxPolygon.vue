<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps({
  ifShow: Boolean,
  reciveName: String,
  reciveRemarks: String,
  reciveIfFillColor: Boolean,
  reciveFillColor: String,
  reciveType: String,
  reciveOpacity: Number,
})

const form = reactive({
  name: 'testName',
  remarks: 'testRemarks',
  ifFillColor: true,
  fillColor: '#00B2D5',
  show: true,
  ifRing: true,
  opacity: 1,
})

const emit = defineEmits({
  'polygonAttrs': (payload: any) => payload,
  'handleCheckOrCancelClick': (payload: string) => payload,
})

const handleCheckClick = () => {
  emit('polygonAttrs', form)
  emit('handleCheckOrCancelClick', 'click')

  console.log('多边形名称：', form.name)
  console.log('是否填充多边形：', form.ifFillColor)
  console.log('填充颜色：', form.fillColor)
  console.log('备注：', form.remarks)
}

const handleCancelClick = () => {
  emit('handleCheckOrCancelClick', 'click')
}

watch(props, (newProps: any) => {
  form.name = newProps.reciveName
  form.remarks = newProps.reciveRemarks
  form.ifFillColor = newProps.reciveIfFillColor
  form.fillColor = newProps.reciveFillColor
  form.opacity = newProps.reciveOpacity
  // console.log('多边形类型：', newProps.reciveType)
  switch (newProps.reciveType) {
    case 'AMap.Marker': {
      console.log('不显示')
      form.ifRing = false
      form.ifFillColor = true
      break
    }
    default: {
      console.log('显示')
      form.ifRing = true
      break
    }
  }
})
</script>

<template>
  <div :v-show="props.ifShow">
    <el-dialog class="form" v-model="form.show" title="设置覆盖物属性" draggable :show-close="false">
      <el-form :model="form" label-width="auto" style="max-width:600px">
        <el-form-item label="覆盖物名称">
          <el-input v-model="form.name" placeholder="请输入覆盖物名称" clearable />
        </el-form-item>
        <el-form-item label="填充透明度">
          <el-slider v-model="form.opacity" :disabled="!form.ifFillColor || !form.ifRing" show-input size="small"
            :step=0.01 :min=0 :max=1 />
          <!-- <el-switch v-model="form.ifFillColor" active-text="是" inactive-text="否" :disabled="!form.ifRing" /> -->
        </el-form-item>
        <el-form-item label="填充颜色">
          <el-color-picker v-model="form.fillColor" :disabled="!form.ifFillColor || !form.ifRing" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" size="small" @click="handleCheckClick">确定</el-button>
          <el-button size="small" @click="handleCancelClick">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.form {
  padding: 10px 10px 0 10px;
  border: 2.5px outset violet;
}
</style>