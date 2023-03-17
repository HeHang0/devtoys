<template>
    <div ref="editorRef" v-loading="loading" class="dev-toys-monaco-editor"></div>
</template>
  
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, onMounted, getCurrentInstance, watch } from "vue";

interface Props {
    originalValue: string;
    modifiedValue: string;
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    originalValue: '',
    modifiedValue: '',
})
const editorRef = ref<HTMLDivElement>();
const loading = ref(true);

const { emit } = getCurrentInstance() as any;

let editor: monaco.editor.IStandaloneDiffEditor;
let lastPosition: monaco.Position | null = null

onMounted(() => {
    editor = monaco.editor.createDiffEditor(editorRef.value!, {
        readOnly: true,
        wordWrap: "on",
        automaticLayout: true
    });
    const originalModel = monaco.editor.createModel(props.originalValue, props.language)
    const modifiedModel = monaco.editor.createModel(props.modifiedValue, props.language)

    editor.setModel({
      original: originalModel,
      modified: modifiedModel
    })
    loading.value = false;
});

watch(
    () => props.originalValue,
    (newValue) => {
        if (editor && newValue != editor.getOriginalEditor().getValue()) {
            editor.getOriginalEditor().setValue(newValue);
        }
    }
);
watch(
    () => props.modifiedValue,
    (newValue) => {
        if (editor && newValue != editor.getModifiedEditor().getValue()) {
            editor.getModifiedEditor().setValue(newValue);
        }
    }
)
</script>