<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
type PasteType = 'file' | 'text';
const emit = defineEmits({
  change: (type: PasteType, result: File | string, resultType?: string) => true,
});

function onPaste(event: ClipboardEvent) {
  if (!event.clipboardData || event.clipboardData.items.length <= 0) return;
  if (event.clipboardData.files.length > 0) {
    emit(
      'change',
      'file',
      event.clipboardData.files[0],
      event.clipboardData.files[0].type
    );
    return;
  }
  const item = event.clipboardData.items[0];
  if (item.kind == 'string') {
    item.getAsString(text => {
      emit('change', 'text', text);
    });
  } else if (item.kind == 'file') {
    emit('change', 'file', item.getAsFile()!, item.type);
  }
}

onMounted(() => {
  document.addEventListener('paste', onPaste);
});
onUnmounted(() => {
  document.removeEventListener('paste', onPaste);
});
</script>

<template>
  <div class="devtoys-file-paste">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.devtoys-file-paste {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  .devtoys-icon--paste {
    font-size: 67px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
    line-height: 50px;
  }
}
</style>
<style lang="less">
.devtoys-file-paste {
  .devtoys-icon--paste {
    font-size: 67px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
    line-height: 50px;
  }
  .devtoys-paste__text {
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}
</style>
