<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import { CopyDocument, List, Document } from "@element-plus/icons-vue";
import { formatCode } from "@/utils/formatter";
import { readTextFile } from "@/utils/utils";
import { useLanguageStore } from "@/stores/language";
const { t } = useLanguageStore();

interface Props {
  value: string;
  diffValue?: string;
  language?: string;
  difference?: boolean;
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  diffValue: "",
  difference: false,
  language: "text",
  readonly: false
});
const editorRef = ref<HTMLDivElement>();
const loading = ref(true);

const { emit } = getCurrentInstance() as any;

let editor: monaco.editor.IStandaloneCodeEditor;
let editorDiff: monaco.editor.IStandaloneDiffEditor;
let lastPosition: monaco.Position | null = null;

onMounted(() => {
  if (props.difference) {
    editorDiff = monaco.editor.createDiffEditor(editorRef.value!, {
      readOnly: true,
      wordWrap: "on",
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
      modified: modifiedModel,
    });
  } else {
    editor = monaco.editor.create(editorRef.value!, {
      ...props,
      wordWrap: "on",
      automaticLayout: true,
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      readOnly: props.readonly
    });
    editor.onDidChangeModelContent(() => {
      let pos = editor.getPosition();
      if (pos && pos.column > 1 && pos.lineNumber > 1) lastPosition = pos;
      emit("changeValue", editor.getValue());
      emit("update:value", editor.getValue());
    });
  }

  loading.value = false;
});

watch(
  () => props.value,
  (newValue) => {
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
  (newValue) => {
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
    (newValue) => {
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
const copyText = () => {
  const model = editor?.getModel();
  model && navigator.clipboard.writeText(model.getValue());
};
function inserCode(text: string, cover?: boolean) {
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

  editor.executeEdits("insert-code", [
    {
      range,
      text,
    },
  ]);
}
const pasteText = () =>
  navigator.clipboard
    .readText()
    .then(inserCode)
    .catch(() => {});

function readFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => inserCode(r, true))
    .catch(ElMessage.warning);
  return false;
}

monaco.languages.registerDocumentFormattingEditProvider("*", {
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
        text: formatted,
      },
    ];
  },
});
</script>
<template>
  <div class="dev-toys-monaco-editor">
    <Title>
      <template #title>
        <slot name="title"></slot>
      </template>
      <template v-if="$slots.operate">
        <slot name="operate"></slot>
      </template>
      <template v-else>
        <slot name="more-operate"></slot>
        <el-upload
          style="display: inline"
          :show-file-list="false"
          :before-upload="readFile"
        >
          <el-button
            plain
            :icon="Document"
            size="small"
            :title="t('Read from file')"
          />
        </el-upload>
        <el-button
          plain
          :icon="CopyDocument"
          @click="copyText"
          size="small"
          :title="t('Copy')"
          style="margin-left: 12px"
        />
        <el-button
          plain
          :icon="List"
          @click="pasteText"
          size="small"
          :title="t('Paste')"
        />
      </template>
    </Title>
    <div
      ref="editorRef"
      v-loading="loading"
      class="dev-toys-monaco-editor-body"
    ></div>
  </div>
</template>
<style lang="less">
.dev-toys-monaco-editor {
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