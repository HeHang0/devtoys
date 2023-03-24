<script setup lang="ts">
import { ref, type Ref } from "vue";
import { CopyDocument, List, Document } from "@element-plus/icons-vue";
import { formatCode, uglifyCode } from "@/utils/formatter";
import { readTextFile } from "@/utils/utils";
import { useLanguageStore } from "@/stores/language";
import { useSettingsStore, EditorType } from "@/stores/settings";
import MonacoEditor from "./MonacoEditor.vue";
const settings = useSettingsStore();
const { t } = useLanguageStore();

interface Props {
  value: string;
  diffValue?: string;
  language?: string;
  difference?: boolean;
  readonly?: boolean;
  editorType?: EditorType;
  uglify?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  diffValue: "",
  difference: false,
  language: "text",
  readonly: false,
});

const textAreaRef: Ref<HTMLTextAreaElement | undefined> = ref();
const monacoEditorRef: Ref<typeof MonacoEditor | undefined> = ref();

const emit = defineEmits({
  delayInput: (value: string) => true,
  input: (value: string) => true,
  change: (value: string) => true,
  "update:value": (value: string) => true,
});
const copyText = () => {
  navigator.clipboard.writeText(props.value);
};
function insertText(text: string, cover?: boolean) {
  let code = "";
  if (
    monacoEditorRef.value &&
    ((props.editorType || settings.editorType) == EditorType.MonacoEditor ||
      props.difference)
  ) {
    code = monacoEditorRef.value.insertText(text, cover);
  } else if (textAreaRef.value) {
    let start = textAreaRef.value.selectionStart;
    let end = textAreaRef.value.selectionEnd;
    code = cover
      ? text
      : props.value.substring(0, start) + text + props.value.substring(start);
  }
  updateAllEvent(code);
}
const pasteText = () =>
  navigator.clipboard
    .readText()
    .then(insertText)
    .catch(() => {});

function readFile(uploadFile: any) {
  readTextFile(uploadFile)
    .then((r) => insertText(r, true))
    .catch(ElMessage.warning);
  return false;
}

function formatText() {
  const code = formatCode(props.language, props.value);
  updateAllEvent(code);
}


function uglifyText() {
  const code = uglifyCode(props.language, props.value);
  updateAllEvent(code);
}
function updateAllEvent(value: string) {
  emit("update:value", value);
  emit("input", value);
  emit("change", value);
  emit("delayInput", value);
}

function textChange(value: string) {
  emit("update:value", value);
  emit("change", value);
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(() => {
    emit("delayInput", value);
  }, 200);
}

let delayTimeout: any = null;
function textInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  emit("update:value", target.value || "");
  emit("input", target.value || "");
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(() => {
    emit("delayInput", target.value || "");
  }, 200);
}

function textAreaKeyDown(e: KeyboardEvent) {
  if(e.key == "Tab") {
    e.preventDefault()
    if(!e.shiftKey) insertText("    ")
  }
}
</script>
<template>
  <div class="devtoys-editor">
    <Title>
      <template #title>
        <slot name="title"></slot>
      </template>
      <template v-if="$slots.operate">
        <slot name="operate"></slot>
      </template>
      <template v-else>
        <slot name="more-operate"></slot>
        <el-button
          v-if="props.uglify"
          plain
          @click="uglifyText"
          size="small"
          :title="t('Format')"
        >
          <el-icon>
            <i class="devtoys-icon">&#x122;</i>
          </el-icon>
        </el-button>
        <el-button
          plain
          @click="formatText"
          size="small"
          :title="t('Format')"
          style="margin-right: 12px"
        >
          <el-icon>
            <i class="devtoys-icon">&#x123;</i>
          </el-icon>
        </el-button>
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
      v-if="
        (props.editorType || settings.editorType) == EditorType.MonacoEditor ||
        props.difference
      "
      class="devtoys-monaco-editor-body"
    >
      <MonacoEditor
        ref="monacoEditorRef"
        :value="props.value"
        :readonly="props.readonly"
        :language="props.language"
        :difference="props.difference"
        :diff-value="props.diffValue"
        @change="textChange"
      ></MonacoEditor>
    </div>
    <div v-else class="devtoys-editor-body el-textarea">
      <textarea
        ref="textAreaRef"
        class="el-textarea__inner"
        :value="props.value"
        :readonly="props.readonly"
        spellcheck="false"
        @keydown="textAreaKeyDown"
        @input="textInput"
      ></textarea>
    </div>
  </div>
</template>
<style lang="less">
.devtoys-editor {
  width: 100%;
  height: 100%;
  &-body {
    width: 100%;
    height: calc(100% - 30px);
    textarea {
      height: 100%;
      resize: none;
    }
  }
}
</style>