<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, type Ref } from 'vue';
import { formatCode, highlightCode } from '@/utils/formatter';
import { useLanguageStore } from '@/stores/language';
const { t } = useLanguageStore();

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

const htmlRef: Ref<HTMLDivElement> = ref('' as any);
const innerHtml = ref('');

const emit = defineEmits({
  change: (value: string) => true
});

function editorInput(payload: Event) {
  const inputEvent = payload.target as HTMLDivElement;
  emit('change', inputEvent.innerText);
}

function insertText(text: string, cover: boolean) {}

defineExpose({
  insertText
});

onMounted(() => {
  textChange(props.value || '');
});

function textChange(text: string) {
  innerHtml.value = highlightCode(
    formatCode(props.language, text),
    props.language
  );
}

watch(
  () => props.value,
  newValue => {
    if (htmlRef.value && props.value != htmlRef.value.innerText) {
      textChange(props.value);
    }
  }
);

watch(
  () => props.language,
  () => {
    textChange(props.value);
  }
);
</script>
<template>
  <div
    class="devtoys-pica-editor el-textarea el-textarea__inner"
    ref="htmlRef"
    v-html="innerHtml"
    :contenteditable="Boolean(!props.readonly)"
    @input.native="editorInput"></div>
</template>
<style lang="less">
.devtoys-pica-editor {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
</style>
