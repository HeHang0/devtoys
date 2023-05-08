<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import { CopyDocument, List, Document } from '@element-plus/icons-vue';
import { formatCode, uglifyCode, formattableLanguage } from '@/utils/formatter';
import { readTextFile } from '@/utils/utils';
import { useLanguageStore } from '@/stores/language';
import { useSettingsStore, EditorType } from '@/stores/settings';
import MonacoEditor from './MonacoEditor.vue';
import PicaEditor from './PicaEditor.vue';
import Title from './Title.vue';
const settings = useSettingsStore();
const { t } = useLanguageStore();

interface Props {
  value: string;
  diffValue?: string;
  language?: string;
  difference?: boolean;
  readonly?: boolean;
  editorType?: EditorType;
  uglify?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  diffValue: '',
  difference: false,
  language: 'text',
  readonly: false
});

const textAreaRef: Ref<HTMLTextAreaElement | undefined> = ref();
const monacoEditorRef: Ref<typeof MonacoEditor | undefined> = ref();

const emit = defineEmits({
  delayInput: (value: string) => true,
  input: (value: string) => true,
  change: (value: string) => true,
  'update:value': (value: string) => true,
  'update:language': (value: string) => true
});
const language = reactive({
  value: props.language
});
const copyText = () => {
  navigator.clipboard.writeText(props.value);
};
function insertText(text: string, cover?: boolean) {
  let code = '';
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
    .then(r => insertText(r, true))
    .catch(ElMessage.warning);
  return false;
}

function formatText() {
  const code = formatCode(language.value, props.value);
  updateAllEvent(code);
}

function uglifyText() {
  const code = uglifyCode(language.value, props.value);
  updateAllEvent(code);
}
function updateAllEvent(value: string) {
  emit('update:value', value);
  emit('input', value);
  emit('change', value);
  emit('delayInput', value);
}

function textChange(value: string) {
  emit('update:value', value);
  emit('change', value);
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(() => {
    emit('delayInput', value);
  }, 200);
}

let delayTimeout: any = null;
function textInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  emit('update:value', target.value || '');
  emit('input', target.value || '');
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(() => {
    emit('delayInput', target.value || '');
  }, 200);
}

function textAreaKeyDown(e: KeyboardEvent) {
  if (e.key == 'Tab') {
    e.preventDefault();
    if (!e.shiftKey) insertText('    ');
  }
}

function languageChange(lang: string) {
  emit('update:language', lang);
  language.value = lang;
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
          class="plus-ml12"
          plain
          @click="uglifyText"
          size="small"
          :title="t('Uglify')">
          <el-icon>
            <i class="devtoys-icon">&#x122;</i>
          </el-icon>
        </el-button>
        <el-dropdown
          v-if="(props.editorType || settings.editorType) != EditorType.Default"
          class="plus-ml12"
          @command="languageChange">
          <span class="el-dropdown-link"
            ><el-button plain size="small" :title="t('Language')">
              <el-icon>
                <i class="devtoys-icon">&#x108;</i>
              </el-icon>
            </el-button></span
          >
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                command="text"
                :class="
                  language.value == 'text' ? 'el-dropdown-menu__item-focus' : ''
                "
                >Text</el-dropdown-item
              >
              <el-dropdown-item
                command="json"
                :class="
                  language.value == 'json' ? 'el-dropdown-menu__item-focus' : ''
                "
                >Json</el-dropdown-item
              >
              <el-dropdown-item
                command="yaml"
                :class="
                  language.value == 'yaml' ? 'el-dropdown-menu__item-focus' : ''
                "
                >Yaml</el-dropdown-item
              >
              <el-dropdown-item
                command="sql"
                :class="
                  language.value == 'sql' ? 'el-dropdown-menu__item-focus' : ''
                "
                >SQL</el-dropdown-item
              >
              <el-dropdown-item
                command="html"
                :class="
                  language.value == 'html' ? 'el-dropdown-menu__item-focus' : ''
                "
                >Html</el-dropdown-item
              >
              <el-dropdown-item
                command="xml"
                :class="
                  language.value == 'xml' ? 'el-dropdown-menu__item-focus' : ''
                "
                >Xml</el-dropdown-item
              >
              <el-dropdown-item
                command="javascript"
                :class="
                  language.value == 'javascript'
                    ? 'el-dropdown-menu__item-focus'
                    : ''
                "
                >JavaScript</el-dropdown-item
              >
              <el-dropdown-item
                command="markdown"
                :class="
                  language.value == 'markdown'
                    ? 'el-dropdown-menu__item-focus'
                    : ''
                "
                >MarkDown</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          v-if="formattableLanguage.includes(language.value)"
          class="plus-ml12"
          plain
          @click="formatText"
          size="small"
          :title="t('Format')">
          <el-icon>
            <i class="devtoys-icon">&#x123;</i>
          </el-icon>
        </el-button>
        <el-upload
          v-if="!props.readonly"
          class="plus-ml12"
          style="display: inline"
          :show-file-list="false"
          :before-upload="readFile">
          <el-button
            plain
            :icon="Document"
            size="small"
            :title="t('Read from file')" />
        </el-upload>
        <el-button
          plain
          class="plus-ml12"
          :icon="CopyDocument"
          @click="copyText"
          size="small"
          :title="t('Copy')"
          style="margin-left: 12px" />
        <el-button
          v-if="!props.readonly"
          plain
          class="plus-ml12"
          :icon="List"
          @click="pasteText"
          size="small"
          :title="t('Paste')" />
      </template>
    </Title>
    <div
      v-if="
        (props.editorType || settings.editorType) == EditorType.MonacoEditor ||
        props.difference
      "
      class="devtoys-editor-body">
      <MonacoEditor
        ref="monacoEditorRef"
        :value="props.value"
        :readonly="props.readonly"
        :language="language.value"
        :difference="props.difference"
        :diff-value="props.diffValue"
        @change="textChange"></MonacoEditor>
    </div>
    <div
      v-else-if="
        (props.editorType || settings.editorType) == EditorType.PicaPicoEditor
      "
      class="devtoys-editor-body">
      <PicaEditor
        ref="monacoEditorRef"
        :value="props.value"
        :readonly="props.readonly"
        :language="language.value"
        @change="textChange"></PicaEditor>
    </div>
    <div v-else class="devtoys-editor-body el-textarea">
      <textarea
        ref="textAreaRef"
        class="el-textarea__inner"
        :value="props.value"
        :readonly="props.readonly"
        spellcheck="false"
        :style="{ whiteSpace: settings.editorWrap ? 'pre-wrap' : 'pre' }"
        @keydown="textAreaKeyDown"
        @input="textInput"></textarea>
    </div>
  </div>
</template>
<style lang="less" scoped>
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
  .plus-ml12 + .plus-ml12 {
    margin-left: 12px;
  }
}
</style>
<style lang="less">
.el-dropdown-menu__item-focus {
  background-color: var(--el-dropdown-menuItem-hover-fill);
  color: var(--el-dropdown-menuItem-hover-color);
}
</style>
