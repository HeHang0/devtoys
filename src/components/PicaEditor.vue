<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, type Ref, nextTick } from 'vue';
import { formatCode, highlightCode } from '@/utils/formatter';
import { useLanguageStore } from '@/stores/language';
import { useSettingsStore } from '@/stores/settings';
const { t } = useLanguageStore();
const settings = useSettingsStore();

interface Props {
  value: string;
  language?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  diffValue: '',
  difference: false,
  language: 'text',
  readonly: false
});

const htmlRef = ref('' as any);
const hljsCodeClass = ref('hljs');

const emit = defineEmits({
  change: (value: string) => true
});

function editorInput(payload: Event) {
  const inputEvent = payload.target as HTMLDivElement;
  emit('change', inputEvent.innerText);
}

function insertText(text: string, cover?: boolean) {
  return htmlRef.value?.innerText || '';
}

defineExpose({
  insertText
});

onMounted(() => {
  textChange(props.value || '');
});

function textChange(text: string) {
  const hlCode = highlightCode(
    formatCode(props.language, text),
    props.language,
    true
  ) as { value: string; language: string };
  hljsCodeClass.value = `hljs ` + (hlCode.language || '');
  if (htmlRef.value) {
    htmlRef.value.innerHTML = hlCode.value;
  }
}

watch(
  () => props.value,
  newValue => {
    if (htmlRef.value && newValue != htmlRef.value.innerText) {
      textChange(newValue);
    }
  }
);

watch(
  () => props.language,
  () => {
    textChange(props.value);
  }
);

function codeInputKeyDown(e: KeyboardEvent) {
  if (e.key == 'Tab') {
    e.preventDefault();
    if (!e.shiftKey) insertText('    ');
  }
}
</script>
<template>
  <div class="devtoys-pica-editor">
    <pre :style="{ whiteSpace: settings.editorWrap ? 'pre-wrap' : 'pre' }"><code
    ref="htmlRef"
    :contenteditable="Boolean(!props.readonly)"
        @keydown="codeInputKeyDown"
    @input.native="editorInput" class="el-textarea el-textarea__inner" :class="hljsCodeClass"></code></pre>
  </div>
</template>
<style lang="less">
.devtoys-pica-editor {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  pre,
  code {
    width: 100%;
    height: 100%;
  }
  code {
    resize: none;
  }
}
</style>
