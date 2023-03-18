<template>
  <div ref="editorRef" v-loading="loading" class="dev-toys-monaco-editor"></div>
</template>
  
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import { formatCode } from "@/utils/formatter";

interface Props {
  value: string;
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  language: "text",
});
const editorRef = ref<HTMLDivElement>();
const loading = ref(true);

const { emit } = getCurrentInstance() as any;

let editor: monaco.editor.IStandaloneCodeEditor;
let lastPosition: monaco.Position | null = null;

onMounted(() => {
  editor = monaco.editor.create(editorRef.value!, {
    ...props,
    wordWrap: "on",
    automaticLayout: true,
  });
  editor.onDidChangeModelContent(() => {
    let pos = editor.getPosition();
    if (pos && pos.column > 1 && pos.lineNumber > 1) lastPosition = pos;
    emit("changeValue", editor.getValue());
    emit("update:value", editor.getValue());
  });
  monaco.languages.registerDocumentFormattingEditProvider("*", {
    provideDocumentFormattingEdits(model, options) {
      const formatted = formatCode(model.getLanguageId(), model.getValue(), options.tabSize, options.insertSpaces);
      return [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ];
    },
  });
  
  loading.value = false;
});

watch(
  () => props.value,
  (newValue) => {
    if (!editor) return;
    if (newValue != editor.getValue()) {
      editor.setValue(newValue);
      lastPosition && editor.setPosition(lastPosition);
    }
  }
);

watch(
  () => props.language,
  (newValue) => {
    if (!editor) return;
    let model = editor.getModel();
    if (model && newValue != model.getLanguageId()) {
      monaco.editor.setModelLanguage(model, newValue);
    }
  }
);
</script>
<style lang="less">
.dev-toys-monaco-editor {
  width: 100%;
  height: 100%;
  .monaco-editor,
  .overflow-guard {
    border-radius: 4px;
  }
}
</style>