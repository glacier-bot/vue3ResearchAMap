<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps({
  ifShow: Boolean,
  reciveName: String,
  reciveRemarks: String,
  reciveIfFillColor: Boolean,
  reciveFillColor: String
})

const form = reactive({
  name: 'testName',
  remarks: 'testRemarks',
  ifFillColor: true,
  fillColor: '#00B2D5',
  show: true
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
})
</script>

<template>
  <div :v-show="props.ifShow">
    <el-dialog class="form" v-model="form.show" title="设置多边形属性" draggable :show-close="false">
      <el-form :model="form" label-width="auto" style="max-width:600px">
        <el-form-item label="多边形名称">
          <el-input v-model="form.name" placeholder="请输入多边形名称" clearable />
        </el-form-item>
        <el-form-item label="是否填充多边形">
          <el-switch v-model="form.ifFillColor" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="填充颜色">
          <el-color-picker v-model="form.fillColor" :disabled="!form.ifFillColor" />
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