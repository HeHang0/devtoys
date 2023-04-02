<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { formatCode } from '@/utils/formatter';
import { useLanguageStore } from '@/stores/language';
const { t } = useLanguageStore();

interface Props {
  value: string;
  diffValue?: string;
  language?: string;
  difference?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  diffValue: '',
  difference: false,
  language: 'text',
  readonly: false
});
const editorRef = ref<HTMLDivElement>();
const loading = ref(true);

const emit = defineEmits({
  change: (value: string) => true
});

let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let editorDiff: monaco.editor.IStandaloneDiffEditor;
let lastPosition: monaco.Position | null = null;

function insertText(text: string, cover: boolean) {
  if (!editor) return;
  let range: monaco.Range | undefined;
  if (cover) {
    range = editor.getModel()?.getFullModelRange();
    if (!range) range = new monaco.Range(0, 0, 0, 0);
  } else {
    let position = editor.getPosition();
    if (!position) position = new monaco.Position(0, 0);
    range = new monaco.Range(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column
    );
  }

  editor.executeEdits('insert-code', [
    {
      range,
      text
    }
  ]);
  return editor.getModel()?.getValue() || '';
}

defineExpose({
  insertText
});

onMounted(() => {
  if (props.difference) {
    editorDiff = monaco.editor.createDiffEditor(editorRef.value!, {
      readOnly: true,
      wordWrap: 'on',
      automaticLayout: true,
      suggestOnTriggerCharacters: false
    });
    const originalModel = monaco.editor.createModel(
      props.value,
      props.language
    );
    const modifiedModel = monaco.editor.createModel(
      props.diffValue,
      props.language
    );

    editorDiff.setModel({
      original: originalModel,
      modified: modifiedModel
    });
  } else {
    editor = monaco.editor.create(editorRef.value!, {
      ...props,
      wordWrap: 'on',
      automaticLayout: true,
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      readOnly: props.readonly
    });
    editor.onDidChangeModelContent(() => {
      if (!editor) return;
      let pos = editor.getPosition();
      if (pos && pos.column > 1 && pos.lineNumber > 1) lastPosition = pos;
      emit('change', editor.getValue());
    });
  }

  loading.value = false;
});

onUnmounted(() => {
  editor && editor.dispose();
  editor = null;
});

watch(
  () => props.value,
  newValue => {
    if (props.difference) {
      if (
        props.difference &&
        editorDiff &&
        newValue != editorDiff.getOriginalEditor().getValue()
      ) {
        editorDiff.getOriginalEditor().setValue(newValue);
      }
    } else {
      if (editor && newValue != editor.getValue()) {
        editor.setValue(newValue);
        lastPosition && editor.setPosition(lastPosition);
      }
    }
  }
);

watch(
  () => props.language,
  newValue => {
    if (!editor) return;
    let model = editor.getModel();
    if (model && newValue != model.getLanguageId()) {
      monaco.editor.setModelLanguage(model, newValue);
    }
  }
);

props.difference &&
  watch(
    () => props.diffValue,
    newValue => {
      if (!editorDiff) return;
      if (
        props.difference &&
        editorDiff &&
        newValue != editorDiff.getModifiedEditor().getValue()
      ) {
        editorDiff.getModifiedEditor().setValue(newValue);
      }
    }
  );

monaco.languages.registerDocumentFormattingEditProvider('*', {
  provideDocumentFormattingEdits(model, options) {
    const formatted = formatCode(
      model.getLanguageId(),
      model.getValue(),
      options.tabSize,
      options.insertSpaces
    );
    return [
      {
        range: model.getFullModelRange(),
        text: formatted
      }
    ];
  }
});
</script>
<template>
  <div class="devtoys-monaco-editor">
    <div
      ref="editorRef"
      v-loading="loading"
      class="devtoys-monaco-editor-body"></div>
  </div>
</template>
<style lang="less">
.devtoys-monaco-editor {
  width: 100%;
  height: 100%;
  &-body {
    width: 100%;
    height: calc(100% - 30px);
    .monaco-editor,
    .overflow-guard {
      border-radius: 4px;
    }
  }
}
</style>
