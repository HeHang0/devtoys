<script setup lang="ts">
// import * as monaco from 'monaco-editor';
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { formatCode } from '@/utils/formatter';
import { useLanguageStore } from '@/stores/language';
import { useSettingsStore } from '@/stores/settings';
const { t } = useLanguageStore();
const settings = useSettingsStore();

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
let editor: any = null;
let editorDiff: any;

function insertText(text: string, cover: boolean) {
  if (!editor) return;
  let range: any;
  if (cover) {
    range = editor.getModel()?.getFullModelRange();
    if (!range) range = new (window as any).monaco.Range(0, 0, 0, 0);
  } else {
    let position = editor.getPosition();
    if (!position) position = new (window as any).monaco.Position(0, 0);
    range = new (window as any).monaco.Range(
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
  (window as any).require(['vs/editor/editor.main'], function () {
    (window as any).monaco.editor.setTheme(
      settings.isDark() ? 'vs-dark' : 'vs'
    );
    (window as any).monaco.languages.registerDocumentFormattingEditProvider(
      '*',
      {
        provideDocumentFormattingEdits(model: any, options: any) {
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
      }
    );
    if (props.difference) {
      editorDiff = (window as any).monaco.editor.createDiffEditor(
        editorRef.value!,
        {
          readOnly: true,
          wordWrap: settings.editorWrap ? 'on' : 'off',
          automaticLayout: true,
          suggestOnTriggerCharacters: false
        }
      );
      const originalModel = (window as any).monaco.editor.createModel(
        props.value,
        props.language
      );
      const modifiedModel = (window as any).monaco.editor.createModel(
        props.diffValue,
        props.language
      );

      editorDiff.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    } else {
      editor = (window as any).monaco.editor.create(editorRef.value!, {
        ...props,
        wordWrap: settings.editorWrap ? 'on' : 'off',
        automaticLayout: true,
        suggestOnTriggerCharacters: false,
        quickSuggestions: false,
        readOnly: props.readonly
      });
      editor.onDidChangeModelContent(() => {
        if (!editor) return;
        emit('change', editor.getValue());
      });
    }
    loading.value = false;
  });
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
      editor &&
        editor.getModel().pushEditOperations(
          [],
          [
            {
              range: editor.getModel().getFullModelRange(),
              text: newValue
            }
          ]
        );
    }
  }
);

watch(
  () => props.language,
  newValue => {
    if (!editor) return;
    let model = editor.getModel();
    if (model && newValue != model.getLanguageId()) {
      (window as any).monaco.editor.setModelLanguage(model, newValue);
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
</script>
<template>
  <div class="devtoys-monaco-editor el-textarea">
    <div
      ref="editorRef"
      v-loading="loading"
      class="devtoys-monaco-editor-body el-textarea__inner"
      :style="props.difference ? 'height: 100%' : ''"></div>
  </div>
</template>
<style lang="less">
.devtoys-monaco-editor {
  width: 100%;
  height: 100%;
  &-body {
    width: 100%;
    height: 100%;
    .monaco-editor,
    .overflow-guard {
      border-radius: 4px;
    }
  }
}
</style>
