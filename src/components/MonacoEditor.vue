<template>
    <div ref="editorRef" class="dev-toys-monaco-editor"></div>
</template>
  
<script setup lang="ts">
import * as monaco from "monaco-editor";
import jsyaml from "js-yaml";
import { ref, onMounted, watch, getCurrentInstance, defineProps } from "vue";
import { formatCode } from "@/utils/formatter";

interface Props {
    value: string;
    language: string;
}

const props = withDefaults(defineProps<Props>(), {
    value: '',
    language: 'json'
})
const editorRef = ref<HTMLDivElement>();

const { emit } = getCurrentInstance() as any;

let editor: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
    editor = monaco.editor.create(editorRef.value!, {
        ...props,
        wordWrap: "on",
        automaticLayout: true
    });

    editor.onDidChangeModelContent(() => {
        emit("change", editor.getValue());
        emit("update:value", editor.getValue());
    });

    // 格式化代码
    editor.addAction({
        id: "format",
        label: "Format code",
        keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
        run: function (editor: monaco.editor.ICodeEditor) {
            const model = editor.getModel();
            if (model) {
                const language = model.getLanguageId();
                const text = model.getValue();
                const formatted = formatCode(language, text);
                if (formatted) {
                    const edit = {
                        range: model.getFullModelRange(),
                        text: formatted,
                    };
                    editor.executeEdits("my-source", [edit]);
                    emit("change", editor.getValue());
                }
            }
        },
    });
});

watch(
    () => props.value,
    (newValue) => {
        if (editor && newValue != editor.getValue()) {
            console.log("变了", props.language, newValue.length, editor.getValue().length)
            editor.setValue(newValue);
            // editor.getAction("editor.action.formatDocument")?.run()
        }
    }
);
</script>
<style scoped>
.dev-toys-monaco-editor {
    width: 100%;
    height: 100%;
}
</style>